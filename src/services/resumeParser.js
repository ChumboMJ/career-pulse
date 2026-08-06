// Comprehensive Resume Parser & Skill Extraction Engine

export const KNOWN_SKILLS = [
  // Languages & Frameworks
  'C#', '.NET', '.NET Core', 'ASP.NET', 'VB.NET', 'JavaScript', 'TypeScript', 'Node.js', 'NestJS', 
  'Python', 'PowerShell', 'React', 'Vue.js', 'Angular', 'Next.js', 'Express', 'Django', 'Flask', 
  'FastAPI', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'HTML5', 'CSS3', 'Sass', 'TailwindCSS', 
  'Kendo UI', 'jQuery',

  // Cloud, Containers & DevOps
  'Azure', 'Microsoft Azure', 'GCP', 'Google Cloud', 'AWS', 'Docker', 'Kubernetes', 'GKE', 
  'Pub/Sub', 'Terraform', 'Azure DevOps', 'GitLab', 'CI/CD', 'GitHub Actions', 'Linux', 'WSL', 
  'Bash', 'Nginx', 'Monitoring', 'Serverless', 'App Service', 'Key Vault',

  // Architecture, APIs & Security
  'Microservices', 'Event-Driven Architecture', 'RESTful APIs', 'REST API', 'GraphQL', 
  'SOLID Principles', 'Dependency Injection', 'MVC', 'MVVM', 'Service Bus', 'JWT', 'OAuth',

  // Databases, ORM & Data
  'PostgreSQL', 'Oracle', 'Microsoft SQL Server', 'SQL Server', 'Azure Cosmos DB', 'Cosmos DB', 
  'MSDB', 'SQL', 'MongoDB', 'Redis', 'Dapper', 'Dapper ORM', 'Entity Framework', 'Snowflake', 
  'BigQuery', 'Pandas', 'NumPy', 'XML', 'ETL',

  // Tools, Testing & AI
  'TDD', 'Test-Driven Development', 'xUnit', 'NUnit', 'Jest', 'Datadog', 'Splunk', 'Git', 
  'Postman', 'VS Code', 'Visual Studio', 'Jira', 'Confluence', 'Draw.io', 'Google Gemini CLI', 
  'Google Gemini', 'GitHub Copilot', 'OpenAI API', 'LLMs', 'RAG',

  // Methodologies & SDLC
  'Agile', 'Scrum', 'Kanban', 'Code Reviews', 'Pair Programming'
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
    const escaped = escapeRegExp(skill.toLowerCase());
    const pattern = `(?:^|\\b|\\s)${escaped}(?:$|\\b|\\s|\\,|\\.|\\;)`;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(textLower)) {
      extractedSkills.add(standardizeSkillName(skill));
    }
  });

  const skillsList = Array.from(extractedSkills).sort();
  // Default top 8 extracted skills as core skills (up to 10 max)
  const coreSkills = skillsList.slice(0, 8);

  // Title extraction
  let detectedTitle = 'Senior Software Engineer';
  const titlePatterns = [
    /senior\s+software\s+engineer/i,
    /senior\s+[a-z\s]+engineer/i,
    /it\s+applications\s+engineer/i,
    /full\s*stack\s+developer/i,
    /frontend\s+developer/i,
    /backend\s+engineer/i,
    /devops\s+engineer/i,
    /data\s+engineer/i,
    /software\s+architect/i,
    /software\s+developer/i
  ];

  for (const pattern of titlePatterns) {
    const match = rawText.match(pattern);
    if (match) {
      detectedTitle = capitalizeWords(match[0]);
      break;
    }
  }

  let yearsOfExperience = 5;
  const expMatch = rawText.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    yearsOfExperience = parseInt(expMatch[1], 10);
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let fullName = 'Tim Forste';
  if (lines.length > 0 && lines[0].length < 35 && !lines[0].includes('@') && !lines[0].toLowerCase().includes('resume')) {
    fullName = lines[0];
  }

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);

  let location = 'Independence, Oregon (Remote Friendly)';
  const locMatch = rawText.match(/([A-Z][a-z]+,\s*(?:Oregon|OR|WA|CA|NY|TX|[A-Z]{2})\s*\d{5}?)/i);
  if (locMatch) {
    location = locMatch[0];
  }

  return {
    id: `profile-${Date.now()}`,
    fullName,
    email: emailMatch ? emailMatch[0] : 'tforste@gmail.com',
    phone: phoneMatch ? phoneMatch[0] : '971-600-4205',
    location,
    title: detectedTitle,
    yearsOfExperience,
    skills: skillsList,
    coreSkills: coreSkills,
    summary: rawText.slice(0, 450).trim() + '...',
    rawText: rawText,
    updatedAt: new Date().toISOString()
  };
}

export function createSampleProfile() {
  const allSkills = [
    'C#', '.NET Core', 'ASP.NET', 'JavaScript', 'TypeScript', 'Node.js', 'NestJS', 
    'Python', 'PowerShell', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 
    'Microservices', 'Event-Driven Architecture', 'RESTful APIs', 'PostgreSQL', 
    'Oracle', 'Microsoft SQL Server', 'Dapper', 'TDD', 'Jest', 'Datadog', 'Splunk', 'Git'
  ];

  return {
    id: 'profile-tim-forste',
    fullName: 'Tim Forste',
    email: 'tforste@gmail.com',
    phone: '971-600-4205',
    location: 'Independence, Oregon (Remote)',
    title: 'Senior Software Engineer',
    yearsOfExperience: 12,
    skills: allSkills,
    coreSkills: ['C#', '.NET Core', 'Azure', 'GCP', 'Microservices', 'Event-Driven Architecture', 'RESTful APIs', 'PostgreSQL', 'Docker', 'Kubernetes'],
    summary: 'Senior Software Engineer with 12+ years of experience specializing in C#, .NET Core, and hybrid-cloud architectures (Azure, GCP). Proven expertise in modernizing legacy systems, architecting event-driven microservices, and integrating enterprise-scale data pipelines.',
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
    coreSkills: [],
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

function standardizeSkillName(skill) {
  if (skill.toLowerCase() === 'microsoft azure') return 'Azure';
  if (skill.toLowerCase() === 'google cloud' || skill.toLowerCase() === 'gcp') return 'GCP';
  if (skill.toLowerCase() === 'test-driven development') return 'TDD';
  if (skill.toLowerCase() === 'rest api') return 'RESTful APIs';
  return skill;
}
