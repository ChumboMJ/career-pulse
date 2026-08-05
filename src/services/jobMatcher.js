// Job Match Engine & Skill Gap Analyzer

import { KNOWN_SKILLS } from './resumeParser.js';

/**
 * Calculates match score, matched skills, missing skills, and recommendations
 */
export function calculateJobMatch(job, userProfile) {
  if (!job || !userProfile) {
    return { matchScore: 0, matchedSkills: [], missingSkills: [], grade: 'C' };
  }

  const candidateSkills = new Set(
    (userProfile.skills || []).map(s => s.toLowerCase().trim())
  );

  // Extract skills required by job posting (from job.requiredSkills or parsing job description)
  let jobSkills = [];
  if (job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0) {
    jobSkills = job.requiredSkills;
  } else {
    jobSkills = extractSkillsFromJobText(job.description + ' ' + (job.title || ''));
  }

  // Fallback if job description has few explicit skills
  if (jobSkills.length === 0) {
    jobSkills = ['JavaScript', 'Communication', 'Problem Solving', 'React'];
  }

  const matched = [];
  const missing = [];

  jobSkills.forEach(skill => {
    const sLower = skill.toLowerCase().trim();
    if (candidateSkills.has(sLower)) {
      matched.push(skill);
    } else {
      // Check partial match (e.g. React vs React.js)
      let foundPartial = false;
      candidateSkills.forEach(candSkill => {
        if (candSkill.includes(sLower) || sLower.includes(candSkill)) {
          foundPartial = true;
        }
      });

      if (foundPartial) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    }
  });

  // Calculate Base Skill Match Percentage
  const skillRatio = jobSkills.length > 0 ? (matched.length / jobSkills.length) : 0.5;
  let baseScore = Math.round(skillRatio * 100);

  // Bonus for Experience & Role Alignment
  let titleBonus = 0;
  if (job.title && userProfile.title) {
    const jobTitleLower = job.title.toLowerCase();
    const userTitleLower = userProfile.title.toLowerCase();
    
    // Key words overlap in title
    const jobTitleWords = jobTitleLower.split(/\s+/).filter(w => w.length > 3);
    const hasWordMatch = jobTitleWords.some(w => userTitleLower.includes(w));
    if (hasWordMatch) titleBonus += 10;
  }

  const finalScore = Math.min(98, Math.max(25, baseScore + titleBonus));

  // Determine Grade
  let grade = 'C';
  let gradeColor = 'var(--accent-rose)';
  if (finalScore >= 88) {
    grade = 'S';
    gradeColor = 'var(--accent-emerald)';
  } else if (finalScore >= 75) {
    grade = 'A';
    gradeColor = 'var(--accent-indigo)';
  } else if (finalScore >= 60) {
    grade = 'B';
    gradeColor = 'var(--accent-amber)';
  }

  return {
    matchScore: finalScore,
    matchedSkills: matched,
    missingSkills: missing,
    grade,
    gradeColor,
    totalRequiredCount: jobSkills.length,
    recommendation: getMatchRecommendation(finalScore, missing)
  };
}

function extractSkillsFromJobText(text) {
  const textLower = text.toLowerCase();
  const extracted = new Set();

  KNOWN_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, 'i');
    if (regex.test(textLower)) {
      extracted.add(skill);
    }
  });

  return Array.from(extracted);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getMatchRecommendation(score, missing) {
  if (score >= 88) {
    return 'Strong match! High probability of passing initial recruiter screening.';
  } else if (score >= 75) {
    return `Good fit. Consider highlighting ${missing.slice(0, 2).join(' and ')} in your tailored resume.`;
  } else if (score >= 60) {
    return `Moderate fit. Add key terms like ${missing.slice(0, 3).join(', ')} to your application.`;
  } else {
    return 'Low match score. We recommend adding missing core skills before applying.';
  }
}
