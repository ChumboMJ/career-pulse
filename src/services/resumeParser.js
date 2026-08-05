// Resume Parser & Skill Extraction Engine

// Comprehensive taxonomy of tech & professional skills
export const KNOWN_SKILLS = [
  // Programming & Dev
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
  'PHP', 'HTML5', 'CSS3', 'Sass', 'TailwindCSS', 'Vue.js', 'Angular', 'Next.js', 'Vite', 'Express',
  'Django', 'Flask', 'FastAPI', 'Spring Boot', 'GraphQL', 'REST API', 'Microservices',

  // Cloud & DevOps
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions',
  'Linux', 'Bash', 'Nginx', 'Monitoring', 'Serverless',

  // Data & AI / ML
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'BigQuery', 'Snowflake', 'Pandas', 'NumPy',
  'Scikit-Learn', 'PyTorch', 'TensorFlow', 'OpenAI API', 'LLMs', 'Prompt Engineering', 'RAG',
  'Data Visualization', 'Tableau', 'Power BI', 'Etl',

  // Product & Project Management
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Product Management', 'Roadmapping', 'User Stories',
  'A/B Testing', 'Stakeholder Management', 'Sprint Planning',

  // Design & UX
  'Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research',
  'Adobe XD', 'Photoshop', 'Illustrator',

  // Business & Marketing & Soft Skills
  'SEO', 'Content Strategy', 'Google Analytics', 'Digital Marketing', 'Copywriting',
  'Communication', 'Leadership', 'Problem Solving', 'Customer Support', 'Salesforce',
  'Negotiation', 'Financial Analysis', 'Budgeting'
];

/**
 * Extracts skills, title, experience level, and summary from raw text
 */
export function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return createEmptyProfile();
  }

  const textLower = rawText.toLowerCase();

  // Extract skills by checking presence in text
  const extractedSkills = new Set();
  KNOWN_SKILLS.forEach(skill => {
    // Regex for word boundary matching
    const regex = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, 'i');
    if (regex.test(textLower)) {
      extractedSkills.add(skill);
    }
  });

  // Basic title extraction heuristic
  let detectedTitle = 'Software Engineer / Professional';
  const titlePatterns = [
    /senior\s+[a-z\s]+engineer/i,
    /frontend\s+developer/i,
    /full\s*stack\s+developer/i,
    /backend\s+engineer/i,
    /data\s+scientist/i,
    /product\s+manager/i,
    /ui\/ux\s+designer/i,
    /devops\s+engineer/i,
    /software\s+engineer/i,
    /marketing\s+manager/i
  ];

  for (const pattern of titlePatterns) {
    const match = rawText.match(pattern);
    if (match) {
      detectedTitle = capitalizeWords(match[0]);
      break;
    }
  }

  // Estimate experience years
  let yearsOfExperience = 3;
  const expMatch = rawText.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    yearsOfExperience = parseInt(expMatch[1], 10);
  }

  // Extract email & phone
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);

  return {
    fullName: extractName(rawText) || 'Alex Johnson',
    email: emailMatch ? emailMatch[0] : 'alex.johnson@example.com',
    phone: phoneMatch ? phoneMatch[0] : '(555) 234-5678',
    location: 'San Francisco, CA (Open to Remote)',
    title: detectedTitle,
    yearsOfExperience,
    skills: Array.from(extractedSkills).sort(),
    summary: rawText.slice(0, 350).trim() + '...',
    rawText: rawText,
    updatedAt: new Date().toISOString()
  };
}

export function createSampleProfile() {
  return {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 234-5678',
    location: 'San Francisco, CA (Remote Friendly)',
    title: 'Senior Full Stack Software Engineer',
    yearsOfExperience: 5,
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'REST API',
      'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Agile', 'CI/CD',
      'HTML5', 'CSS3', 'TailwindCSS', 'Jest', 'Problem Solving'
    ],
    summary: 'Versatile Full Stack Engineer with 5+ years of experience building high-performance web applications using React, Node.js, and Cloud services. Track record of scaling SaaS platforms and optimizing frontend bundle performance.',
    experience: [
      {
        company: 'TechFlow Solutions',
        role: 'Senior Frontend Engineer',
        period: '2022 - Present',
        bullets: [
          'Architected responsive React/TypeScript frontend supporting 100k+ active monthly users.',
          'Reduced LCP page load times by 42% through lazy-loading, code-splitting, and memoization.',
          'Mentored junior engineers and led daily agile standups.'
        ]
      },
      {
        company: 'CloudPulse Inc.',
        role: 'Full Stack Engineer',
        period: '2019 - 2022',
        bullets: [
          'Developed microservices with Node.js, Express, and PostgreSQL.',
          'Integrated REST APIs and payment gateways processing $2M+ in transactions annually.',
          'Configured CI/CD pipelines via GitHub Actions and Docker.'
        ]
      }
    ],
    education: 'B.S. in Computer Science - University of California (2019)',
    rawText: 'Alex Johnson - Senior Full Stack Software Engineer with React, Node.js, TypeScript, Python, AWS, PostgreSQL experience.',
    updatedAt: new Date().toISOString()
  };
}

function createEmptyProfile() {
  return {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: 'Job Seeker',
    yearsOfExperience: 0,
    skills: [],
    summary: '',
    rawText: '',
    updatedAt: new Date().toISOString()
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function extractName(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length < 35 && !lines[0].includes('@')) {
    return lines[0];
  }
  return null;
}
