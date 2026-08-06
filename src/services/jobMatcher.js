// Weighted Job Match Engine & Skill Gap Analyzer

import { KNOWN_SKILLS } from './resumeParser.js';

/**
 * Calculates weighted match score considering designated Core Skills (2.0x weight)
 * while keeping all secondary skills fully included (1.0x weight).
 */
export function calculateJobMatch(job, userProfile) {
  if (!job || !userProfile) {
    return { matchScore: 0, matchedSkills: [], missingSkills: [], grade: 'C' };
  }

  const candidateSkills = new Set(
    (userProfile.skills || []).map(s => s.toLowerCase().trim())
  );

  const candidateCoreSkills = new Set(
    (userProfile.coreSkills || []).map(s => s.toLowerCase().trim())
  );

  // Extract job skills
  let jobSkills = [];
  if (job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0) {
    jobSkills = job.requiredSkills;
  } else {
    jobSkills = extractSkillsFromJobText(job.description + ' ' + (job.title || ''));
  }

  if (jobSkills.length === 0) {
    jobSkills = ['C#', '.NET Core', 'RESTful APIs', 'Communication', 'Problem Solving'];
  }

  const matched = [];
  const missing = [];
  const matchedCore = [];
  const missingCore = [];
  const matchedSecondary = [];
  const missingSecondary = [];

  let earnedPoints = 0;
  let totalPossiblePoints = 0;

  jobSkills.forEach(skill => {
    const sLower = skill.toLowerCase().trim();
    const isCandidateCore = candidateCoreSkills.has(sLower);
    const weight = isCandidateCore ? 2.0 : 1.0;

    totalPossiblePoints += weight;

    // Check exact or partial match
    let isMatched = candidateSkills.has(sLower);
    if (!isMatched) {
      candidateSkills.forEach(candSkill => {
        if (candSkill.includes(sLower) || sLower.includes(candSkill)) {
          isMatched = true;
        }
      });
    }

    if (isMatched) {
      earnedPoints += weight;
      matched.push(skill);
      if (isCandidateCore) matchedCore.push(skill);
      else matchedSecondary.push(skill);
    } else {
      missing.push(skill);
      if (isCandidateCore) missingCore.push(skill);
      else missingSecondary.push(skill);
    }
  });

  // Calculate Base Weighted Percentage
  const weightedRatio = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) : 0.5;
  let baseScore = Math.round(weightedRatio * 100);

  // Title relevance bonus
  let titleBonus = 0;
  if (job.title && userProfile.title) {
    const jobTitleLower = job.title.toLowerCase();
    const userTitleLower = userProfile.title.toLowerCase();
    const jobTitleWords = jobTitleLower.split(/\s+/).filter(w => w.length > 3);
    const hasWordMatch = jobTitleWords.some(w => userTitleLower.includes(w));
    if (hasWordMatch) titleBonus += 8;
  }

  const finalScore = Math.min(98, Math.max(20, baseScore + titleBonus));

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
    matchedCoreSkills: matchedCore,
    missingCoreSkills: missingCore,
    matchedSecondarySkills: matchedSecondary,
    missingSecondarySkills: missingSecondary,
    earnedPoints,
    totalPossiblePoints,
    grade,
    gradeColor,
    totalRequiredCount: jobSkills.length,
    recommendation: getMatchRecommendation(finalScore, missingCore, missingSecondary)
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

function getMatchRecommendation(score, missingCore, missingSecondary) {
  if (missingCore.length > 0) {
    return `Note: Missing ${missingCore.length} Core Skill${missingCore.length > 1 ? 's' : ''} (${missingCore.join(', ')}). High priority to emphasize in your application.`;
  }
  if (score >= 88) {
    return 'Strong match! High probability of passing recruiter screening.';
  } else if (score >= 75) {
    return `Good fit. Consider highlighting ${missingSecondary.slice(0, 2).join(' and ')} in your tailored resume.`;
  } else {
    return `Moderate fit. Consider tailoring your resume keywords for ${missingSecondary.slice(0, 3).join(', ')}.`;
  }
}
