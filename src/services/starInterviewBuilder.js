// STAR+R Interview Story Generator (Situation, Task, Action, Result + Reflection)

/**
 * Generates tailored STAR+R behavioral interview responses matching candidate Core Skills to target job details
 */
export function generateStarInterviewStories(userProfile, job) {
  if (!userProfile || !job) return [];

  const coreSkills = (userProfile.coreSkills || []).slice(0, 4);
  const primarySkill = coreSkills[0] || 'software development';
  const secondarySkill = coreSkills[1] || 'cloud architecture';
  const company = job.company || 'Target Employer';
  const role = job.title || 'Senior Engineer';

  return [
    {
      id: 'star-1',
      category: 'System Architecture & Scale',
      question: `Tell me about a time you modernized a complex system using ${primarySkill} and ${secondarySkill}.`,
      situation: `At my previous role, our legacy monolithic services were experiencing high latency and bottlenecking deployment velocity as user traffic grew.`,
      task: `I was tasked with architecting a modern, event-driven solution to decouple services and improve system throughput without disrupting live business operations.`,
      action: `Leveraged ${primarySkill} and ${secondarySkill} to design high-performance microservices, implementing asynchronous message patterns, robust automated testing, and comprehensive telemetry logging.`,
      result: `Reduced system latency by 42%, improved test coverage to over 85%, and maintained 100% uptime SLA during the rollout.`,
      reflection: `This experience highlighted the importance of high observability and incremental deployment when modernizing core enterprise infrastructure.`
    },
    {
      id: 'star-2',
      category: 'Cross-Cloud Integration & Reliability',
      question: `How do you approach investigating and resolving critical production incidents in hybrid environments?`,
      situation: `During a major release, cross-cloud service integrations experienced transient timeout failures impacting API telemetry.`,
      task: `I led the Tier 3 incident response to quickly isolate the root cause, restore full operational performance, and prevent recurring failures.`,
      action: `Utilized Datadog and Application Insights to trace request flows, optimized SQL execution query plans, and refactored synchronous calls into asynchronous patterns with Dead Letter Queue retry handling.`,
      result: `Resolved the critical incident within SLA, eliminated transient timeouts, and saved 15+ developer hours per week in manual triage.`,
      reflection: `Proactive monitoring and automated fallback queues are essential for building resilient, enterprise-grade cloud platforms.`
    },
    {
      id: 'star-3',
      category: 'Technical Leadership & Mentorship',
      question: `Describe a situation where you aligned team engineering standards and mentored junior developers.`,
      situation: `Our team had inconsistent code formatting and testing practices across microservices, slowing down code reviews and onboarding.`,
      task: `I stepped up to establish clear engineering standards, lead technical workshops, and mentor team members through pair programming.`,
      action: `Authored comprehensive architecture documentation on Confluence, introduced automated CI/CD linting checks, and hosted bi-weekly engineering tech talks.`,
      result: `Reduced developer onboarding time by 35% and improved overall team velocity and code review efficiency.`,
      reflection: `Fostering a culture of shared ownership and continuous mentorship strengthens technical alignment across the entire organization.`
    }
  ];
}
