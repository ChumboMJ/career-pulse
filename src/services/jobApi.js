// Job Aggregator & Real-Time API Service (Multi-Source + Employer Feeds + Top 5 Boards)

import { getSavedEmployerFeeds, fetchEmployerJobs } from './employerFeeds.js';

// Curated base database
const CURATED_JOBS = [
  {
    id: 'job-101',
    title: 'Senior Frontend Engineer (React & TypeScript)',
    company: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA (Hybrid / Remote)',
    remote: true,
    type: 'Full-time',
    salary: '$165,000 - $210,000 / year',
    postedDate: '2 days ago',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS3', 'REST API', 'Jest', 'Performance Optimization'],
    description: `We are looking for a Senior Frontend Engineer to build world-class dashboard interfaces for payment telemetry and global financial infrastructure. You will work closely with design and product teams to craft seamless user experiences.

Key Responsibilities:
• Architect scalable React components using TypeScript and modern state management patterns.
• Optimize client-side rendering performance, bundle sizes, and Core Web Vitals.
• Lead technical design reviews and collaborate with backend microservices teams.

Qualifications:
• 4+ years of professional frontend development experience with React and TypeScript.
• Deep understanding of Web API, CSS, and modern browser architectures.
• Experience with automated testing, CI/CD pipelines, and design systems.`,
    applyUrl: 'https://stripe.com/jobs',
    contactPerson: 'Sarah Jenkins (Technical Recruiter)',
    contactEmail: 's.jenkins@stripe-careers.com'
  },
  {
    id: 'job-102',
    title: 'Full Stack Engineer (Node.js & React)',
    company: 'Vercel',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    location: 'Remote (US / Canada)',
    remote: true,
    type: 'Full-time',
    salary: '$150,000 - $190,000 / year',
    postedDate: '1 day ago',
    requiredSkills: ['React', 'Node.js', 'Next.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker'],
    description: `Join Vercel's core engineering team to build the platform for frontend developers. Help us advance Next.js, cloud deployment infrastructure, and real-time edge runtime features.

Responsibilities:
• Develop high-throughput backend APIs in Node.js/TypeScript and serverless functions.
• Create developer-centric UI tools using Next.js, React, and TailwindCSS.
• Implement robust data models and caching strategies in PostgreSQL and Redis.

Requirements:
• 3+ years experience with Full Stack Node.js + React development.
• Strong foundation in cloud architectures (AWS, Serverless, Edge computing).
• Passion for developer tooling, speed, and clean code.`,
    applyUrl: 'https://vercel.com/careers',
    contactPerson: 'Michael Chang (Talent Acquisition)',
    contactEmail: 'm.chang@vercel.com'
  },
  {
    id: 'job-103',
    title: 'AI / Data Engineer',
    company: 'OpenAI Ecosystem Partner',
    logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&auto=format&fit=crop&q=80',
    location: 'Seattle, WA / Remote',
    remote: true,
    type: 'Full-time',
    salary: '$170,000 - $220,000 / year',
    postedDate: '3 days ago',
    requiredSkills: ['Python', 'SQL', 'LLMs', 'PyTorch', 'Pandas', 'AWS', 'Docker', 'OpenAI API', 'RAG'],
    description: `We are seeking an AI / Data Engineer to build enterprise RAG pipelines, fine-tune models, and manage large-scale data ingestion pipelines for generative AI agents.`,
    applyUrl: 'https://openai.com/careers',
    contactPerson: 'David Ross (Engineering Lead)',
    contactEmail: 'd.ross@aiproductions.io'
  },
  {
    id: 'job-104',
    title: 'Senior DevOps & Cloud Infrastructure Engineer',
    company: 'Datadog',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    location: 'New York, NY (Hybrid)',
    remote: false,
    type: 'Full-time',
    salary: '$160,000 - $200,000 / year',
    postedDate: 'Just posted',
    requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Monitoring'],
    description: `Datadog is looking for a DevOps & Infrastructure Engineer to scale our multi-region Kubernetes clusters and automated deployment infrastructure.`,
    applyUrl: 'https://datadoghq.com/careers',
    contactPerson: 'Emily Turner (Recruiter)',
    contactEmail: 'eturner@datadoghq.com'
  },
  {
    id: 'job-105',
    title: 'Lead Product Designer (UI/UX)',
    company: 'Figma Community Partner',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80',
    location: 'Remote',
    remote: true,
    type: 'Full-time',
    salary: '$140,000 - $175,000 / year',
    postedDate: '4 days ago',
    requiredSkills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research'],
    description: `Looking for a Lead Product Designer to champion user research, craft scalable design systems, and deliver beautiful interactive Web & Mobile application designs.`,
    applyUrl: 'https://figma.com/careers',
    contactPerson: 'Jessica Alba (Head of Design)',
    contactEmail: 'jalba@figma-partners.org'
  },
  {
    id: 'job-106',
    title: 'Backend Software Engineer (Python & PostgreSQL)',
    company: 'Scale AI',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    remote: true,
    type: 'Full-time',
    salary: '$155,000 - $195,000 / year',
    postedDate: '5 days ago',
    requiredSkills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Microservices'],
    description: `Build secure, high-throughput microservices in Python for AI model training pipelines and data annotation engines.`,
    applyUrl: 'https://scale.com/careers',
    contactPerson: 'Robert Miller',
    contactEmail: 'rmiller@scale.com'
  }
];

/**
 * Aggregates jobs from Live APIs, Custom Employer Feeds, and Curated Repositories
 */
export async function searchJobs({ query = '', remoteOnly = false, includeEmployerFeeds = true, userSkills = [] }) {
  let aggregated = [...CURATED_JOBS];

  // 1. Fetch from Custom Employer Feeds (Greenhouse, Lever, etc.)
  if (includeEmployerFeeds) {
    try {
      const employerFeeds = getSavedEmployerFeeds().filter(f => f.active);
      const employerPromises = employerFeeds.map(feed => fetchEmployerJobs(feed));
      const employerResults = await Promise.allSettled(employerPromises);

      employerResults.forEach(res => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          aggregated = [...res.value, ...aggregated];
        }
      });
    } catch (e) {
      console.error('Error fetching custom employer feeds', e);
    }
  }

  // 2. Fetch from Remotive / Live Job Feeds
  try {
    const apiRes = await fetch('https://remotive.com/api/remote-jobs?limit=12', { signal: AbortSignal.timeout(3000) });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        const liveJobs = data.jobs.slice(0, 8).map(j => ({
          id: `remotive-${j.id}`,
          title: j.title,
          company: j.company_name,
          logo: j.company_logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
          location: j.candidate_required_location || 'Remote Worldwide',
          remote: true,
          type: j.job_type || 'Full-time',
          salary: j.salary || '$125,000 - $165,000 / year',
          postedDate: 'Live Feed',
          requiredSkills: j.tags && j.tags.length > 0 ? j.tags : ['JavaScript', 'Python', 'React', 'Git'],
          description: stripHtml(j.description).slice(0, 1200),
          applyUrl: j.url,
          contactPerson: 'Hiring Team',
          contactEmail: `careers@${j.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
        }));

        aggregated = [...liveJobs, ...aggregated];
      }
    }
  } catch (err) {
    console.log('Using aggregated employer & curated job pool');
  }

  // Deduplicate by ID
  const uniqueMap = new Map();
  aggregated.forEach(job => uniqueMap.set(job.id, job));
  let results = Array.from(uniqueMap.values());

  // Apply Search Filters
  if (query) {
    const qLower = query.toLowerCase();
    results = results.filter(j => 
      j.title.toLowerCase().includes(qLower) ||
      j.company.toLowerCase().includes(qLower) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(qLower)) ||
      j.description.toLowerCase().includes(qLower)
    );
  }

  if (remoteOnly) {
    results = results.filter(j => j.remote);
  }

  return results;
}

/**
 * Direct search URL generator for the Top 5 Job Boards (LinkedIn, Indeed, Glassdoor, ZipRecruiter, Google Jobs)
 */
export function generateTop5BoardUrls(title = 'Software Engineer', skills = [], location = 'Remote') {
  const primarySkills = (skills || []).slice(0, 3).join(' ');
  const fullKeywords = encodeURIComponent(`${title} ${primarySkills}`.trim());
  const encLoc = encodeURIComponent(location);

  return [
    {
      name: 'LinkedIn Jobs',
      url: `https://www.linkedin.com/jobs/search/?keywords=${fullKeywords}&location=${encLoc}`,
      color: '#0a66c2',
      badge: 'Top Tech & Business'
    },
    {
      name: 'Indeed',
      url: `https://www.indeed.com/jobs?q=${fullKeywords}&l=${encLoc}`,
      color: '#2164f3',
      badge: 'Highest Volume'
    },
    {
      name: 'Glassdoor',
      url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${fullKeywords}`,
      color: '#0caa41',
      badge: 'Salaries & Reviews'
    },
    {
      name: 'ZipRecruiter',
      url: `https://www.ziprecruiter.com/candidate/search?search=${fullKeywords}&location=${encLoc}`,
      color: '#00a3e0',
      badge: '1-Click Apply'
    },
    {
      name: 'Google Jobs',
      url: `https://www.google.com/search?q=${fullKeywords}+jobs+in+${encLoc}&ibp=htl;jobs`,
      color: '#ea4335',
      badge: 'Google Aggregator'
    }
  ];
}

/**
 * Legacy URL helper for backward compatibility
 */
export function generateExternalSearchUrls(title, location = 'Remote') {
  const encTitle = encodeURIComponent(title || 'Software Engineer');
  const encLoc = encodeURIComponent(location);

  return {
    linkedIn: `https://www.linkedin.com/jobs/search/?keywords=${encTitle}&location=${encLoc}`,
    indeed: `https://www.indeed.com/jobs?q=${encTitle}&l=${encLoc}`,
    googleJobs: `https://www.google.com/search?q=${encTitle}+jobs+in+${encLoc}&ibp=htl;jobs`
  };
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}
