// AI Resume Tailor & Cover Letter Builder Service

import { calculateJobMatch } from './jobMatcher.js';

/**
 * Generates a tailored resume customized specifically for a target job posting
 */
export function generateTailoredResume(userProfile, job) {
  if (!userProfile || !job) return null;

  const matchData = calculateJobMatch(job, userProfile);
  const matchedSkills = matchData.matchedSkills || [];
  const missingSkills = matchData.missingSkills || [];

  // Tailored Summary
  const tailoredSummary = `Results-driven ${userProfile.title || 'Professional'} with ${userProfile.yearsOfExperience || 4}+ years of experience specializing in ${matchedSkills.slice(0, 4).join(', ')}. Proven track record of delivering impactful solutions for high-growth technical projects. Highly aligned with ${job.company}'s mission for the ${job.title} role.`;

  // Tailored Skills grouping
  const topKeySkills = [...matchedSkills, ...missingSkills.slice(0, 2)];
  const secondarySkills = (userProfile.skills || []).filter(s => !topKeySkills.includes(s));

  // Tailored Bullet Highlights
  const tailoredBullets = [
    `Leveraged ${matchedSkills.slice(0, 3).join(', ')} to architect scalable solutions aligned with key technical requirements for ${job.title}.`,
    `Streamlined cross-functional workflows, achieving measurable improvements in reliability, performance, and code quality.`,
    `Applied expertise in ${matchedSkills[3] || 'modern frameworks'} to optimize application performance and maintain high test coverage.`
  ];

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    tailoredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fullName: userProfile.fullName || 'Alex Johnson',
    email: userProfile.email || 'alex.johnson@example.com',
    phone: userProfile.phone || '(555) 234-5678',
    location: userProfile.location || 'San Francisco, CA',
    title: `${job.title} (Tailored Variant)`,
    summary: tailoredSummary,
    primarySkills: topKeySkills,
    secondarySkills: secondarySkills,
    highlightBullets: tailoredBullets,
    matchedKeywordsCount: matchedSkills.length,
    atsMatchScore: matchData.matchScore,
    formattedMarkdown: formatResumeAsMarkdown({
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location,
      title: `${job.title}`,
      company: job.company,
      summary: tailoredSummary,
      topKeySkills,
      secondarySkills,
      tailoredBullets,
      experience: userProfile.experience || []
    })
  };
}

/**
 * Generates a job-specific cover letter tailored to the job description and company
 */
export function generateCoverLetter(userProfile, job, tone = 'Professional') {
  if (!userProfile || !job) return '';

  const matchData = calculateJobMatch(job, userProfile);
  const matchedSkills = matchData.matchedSkills || ['software engineering', 'problem solving'];
  const topSkillsStr = matchedSkills.slice(0, 3).join(', ');

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const contactName = job.contactPerson || 'Hiring Manager';

  let intro = '';
  let body = '';
  let closing = '';

  if (tone === 'Enthusiastic') {
    intro = `I was thrilled to see the opening for the ${job.title} position at ${job.company}! With my extensive background in ${topSkillsStr}, I am excited about the prospect of bringing my energy and problem-solving skills to your team.`;
    body = `Throughout my career as a ${userProfile.title}, I have consistently pushed the boundaries of what is possible. At my previous roles, I used ${matchedSkills[0] || 'core technologies'} to deliver high-impact features, streamline performance, and foster collaborative team environments. The opportunity to contribute to ${job.company}'s upcoming initiatives aligns perfectly with my professional passion.`;
    closing = `I would love the opportunity to discuss how my background and enthusiasm make me a fantastic fit for ${job.company}. Thank you for your time and consideration!`;
  } else if (tone === 'Executive') {
    intro = `I am writing to express my formal interest in the ${job.title} leadership role at ${job.company}. Bringing ${userProfile.yearsOfExperience || 5}+ years of hands-on technical execution and strategic delivery, I offer a strong foundation in ${topSkillsStr}.`;
    body = `In my work as a ${userProfile.title}, I have spearheaded critical engineering initiatives, optimized complex system architectures, and driven cross-functional alignment. My expertise in ${matchedSkills.slice(0, 4).join(' and ')} positions me to immediately add value to ${job.company}'s strategic goals for the ${job.title} role.`;
    closing = `I welcome the opportunity for a conversation to review how my strategic orientation and proven technical execution align with your team's objectives.`;
  } else {
    // Standard Professional
    intro = `Please accept this application for the ${job.title} position at ${job.company}. Having reviewed your job requirements, I am confident that my experience in ${topSkillsStr} aligns closely with the qualifications you seek.`;
    body = `As a ${userProfile.title} with over ${userProfile.yearsOfExperience || 4} years of experience, I have successfully designed, built, and deployed robust applications. My experience with ${matchedSkills.join(', ')} directly addresses the key responsibilities outlined in your job posting. I pride myself on writing clean, maintainable code and solving complex technical challenges efficiently.`;
    closing = `Thank you for reviewing my application. I look forward to discussing how my skills and experience can support ${job.company}'s goals in an interview.`;
  }

  const fullLetter = `${dateStr}

Hiring Manager / ${contactName}
${job.company}

RE: Application for ${job.title}

Dear ${contactName},

${intro}

${body}

${closing}

Sincerely,

${userProfile.fullName || 'Alex Johnson'}
${userProfile.email || 'alex.johnson@example.com'}
${userProfile.phone || '(555) 234-5678'}
`;

  return fullLetter;
}

function formatResumeAsMarkdown(data) {
  return `# ${data.fullName || 'Alex Johnson'}
${data.email} | ${data.phone} | ${data.location}

## Target Position: ${data.title} (${data.company})

### Professional Summary
${data.summary}

### Core Competencies & Key Technical Skills
- **Target Job Match Skills:** ${data.topKeySkills.join(', ')}
- **Additional Technical Stack:** ${data.secondarySkills.join(', ')}

### Tailored Achievements & Highlights
${data.tailoredBullets.map(b => `- ${b}`).join('\n')}

### Work Experience
${data.experience && data.experience.length > 0 ? data.experience.map(e => `
**${e.role}** — *${e.company}* (${e.period})
${e.bullets ? e.bullets.map(b => `- ${b}`).join('\n') : ''}
`).join('\n') : `
**Senior Software Engineer** — *TechFlow Solutions* (2022 - Present)
- Led development of modern web applications matching key requirements.
- Optimized performance, reduced latency, and improved code quality.
`}
`;
}
