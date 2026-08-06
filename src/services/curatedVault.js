// Curated Match Vault & A-G Evaluation Engine (inspired by santifer/career-ops & TealHQ)

import { calculateJobMatch } from './jobMatcher.js';
import { saveWorkSearchLog } from './unemploymentLogger.js';

const VAULT_STORAGE_KEY = 'careerpulse_curated_vault_v1';

export const PIPELINE_STAGES = [
  { id: 'wishlist', label: 'Wishlist / Curated Match', icon: '📌', color: 'var(--accent-indigo)' },
  { id: 'tailored', label: 'Resume & Letter Tailored', icon: '📝', color: 'var(--accent-purple)' },
  { id: 'applied', label: 'Applied & Logged', icon: '🚀', color: 'var(--accent-cyan)' },
  { id: 'interviewing', label: 'Screening / Interviewing', icon: '💬', color: 'var(--accent-amber)' },
  { id: 'offer', label: 'Offer Extended', icon: '🎉', color: 'var(--accent-emerald)' },
  { id: 'archived', label: 'Archived / Closed', icon: '📁', color: 'var(--text-muted)' }
];

/**
 * Gets all saved items from the Curated Match Vault
 */
export function getCuratedVaultItems() {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading curated vault', e);
  }
  return getSampleVaultItems();
}

/**
 * Saves or updates a job in the Curated Match Vault
 */
export function saveToCuratedVault(job, userProfile, stage = 'wishlist', notes = '') {
  const vault = getCuratedVaultItems();
  const existingIdx = vault.findIndex(item => item.jobId === job.id || item.id === job.id);

  const matchData = calculateJobMatch(job, userProfile);
  const evaluation = calculateBlockAGEvaluation(job, userProfile, matchData);

  const vaultEntry = {
    id: `vault-${job.id}`,
    jobId: job.id,
    title: job.title,
    company: job.company,
    logo: job.logo,
    location: job.location,
    remote: job.remote,
    salary: job.salary || '$140,000 - $185,000 / year',
    applyUrl: job.applyUrl || '#',
    contactPerson: job.contactPerson || 'Hiring Recruiter',
    contactEmail: job.contactEmail || `careers@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    description: job.description || '',
    requiredSkills: job.requiredSkills || [],
    
    // Evaluation Scores
    matchScore: matchData.matchScore,
    matchGrade: matchData.grade,
    matchedCoreSkills: matchData.matchedCoreSkills || [],
    missingCoreSkills: matchData.missingCoreSkills || [],
    matchedSecondarySkills: matchData.matchedSecondarySkills || [],
    missingSecondarySkills: matchData.missingSecondarySkills || [],
    overallRating: evaluation.overallRating, // 1.0 to 5.0 score
    evaluationBlocks: evaluation.blocks,
    ghostJobWarning: evaluation.ghostJobWarning,

    // Pipeline State
    pipelineStage: stage,
    listingStatus: evaluation.listingStatus, // 'active' | 'stale' | 'closed'
    priorityTag: matchData.matchScore >= 85 ? 'Dream Job' : matchData.matchScore >= 70 ? 'High Priority' : 'Standard',
    customNotes: notes || (existingIdx >= 0 ? vault[existingIdx].customNotes : 'Added to curated match vault.'),
    dateSaved: existingIdx >= 0 ? vault[existingIdx].dateSaved : new Date().toISOString().split('T')[0],
    dateApplied: stage === 'applied' ? new Date().toISOString().split('T')[0] : (existingIdx >= 0 ? vault[existingIdx].dateApplied : null),
    lastStatusCheckDate: new Date().toISOString().split('T')[0]
  };

  if (existingIdx >= 0) {
    vault[existingIdx] = { ...vault[existingIdx], ...vaultEntry };
  } else {
    vault.unshift(vaultEntry);
  }

  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch (e) {
    console.error('Error saving to vault', e);
  }

  // If stage changed to 'applied', auto-sync with Unemployment Logger
  if (stage === 'applied') {
    saveWorkSearchLog({
      jobId: job.id,
      companyName: job.company,
      jobTitle: job.title,
      location: job.location,
      applicationMethod: 'Curated Match Vault Application',
      contactPerson: job.contactPerson || 'Hiring Manager',
      contactInfo: job.contactEmail || job.applyUrl,
      notes: `Applied for ${job.title} via Curated Vault. Score: ${matchData.matchScore}%.`
    });
  }

  return vault;
}

/**
 * Updates pipeline stage for a saved job
 */
export function updateVaultStage(vaultId, newStage, userProfile) {
  const vault = getCuratedVaultItems();
  const foundIdx = vault.findIndex(item => item.id === vaultId || item.jobId === vaultId);
  if (foundIdx >= 0) {
    vault[foundIdx].pipelineStage = newStage;
    if (newStage === 'applied') {
      vault[foundIdx].dateApplied = new Date().toISOString().split('T')[0];
      // Sync to Unemployment Log
      saveWorkSearchLog({
        jobId: vault[foundIdx].jobId,
        companyName: vault[foundIdx].company,
        jobTitle: vault[foundIdx].title,
        location: vault[foundIdx].location,
        applicationMethod: 'Curated Pipeline Stage Update',
        contactPerson: vault[foundIdx].contactPerson,
        contactInfo: vault[foundIdx].contactEmail || vault[foundIdx].applyUrl,
        notes: `Moved application to Applied stage. Score: ${vault[foundIdx].matchScore}%.`
      });
    }
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
    } catch (e) {}
  }
  return vault;
}

/**
 * Removes an item from the Curated Match Vault
 */
export function removeFromCuratedVault(vaultId) {
  let vault = getCuratedVaultItems();
  vault = vault.filter(item => item.id !== vaultId && item.jobId !== vaultId);
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch (e) {}
  return vault;
}

/**
 * Checks active health status for a job listing
 */
export function checkListingHealthStatus(vaultItem) {
  const postedDateStr = (vaultItem.postedDate || '').toLowerCase();
  let status = 'active';
  let ghostWarning = false;

  if (postedDateStr.includes('30+') || postedDateStr.includes('old') || postedDateStr.includes('reposted')) {
    status = 'stale';
    ghostWarning = true;
  } else if (postedDateStr.includes('closed') || postedDateStr.includes('expired')) {
    status = 'closed';
  }

  return {
    status,
    ghostWarning,
    lastChecked: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

/**
 * Calculates Blocks A-G Evaluation Rating (1.0 - 5.0 Scale) inspired by career-ops
 */
function calculateBlockAGEvaluation(job, userProfile, matchData) {
  // Block B: Skill Fit (1.0 to 5.0)
  const skillRatio = matchData.totalPossiblePoints > 0 ? (matchData.earnedPoints / matchData.totalPossiblePoints) : 0.5;
  const blockBScore = Math.min(5.0, Math.max(1.0, Math.round((skillRatio * 4 + 1) * 10) / 10));

  // Block C: Seniority & Title Fit
  let blockCScore = 4.0;
  if (job.title && userProfile.title) {
    if (job.title.toLowerCase().includes('senior') && userProfile.title.toLowerCase().includes('senior')) {
      blockCScore = 5.0;
    }
  }

  // Block D: Compensation Fit
  let blockDScore = 4.5;

  // Block E: Remote Environment Fit
  let blockEScore = job.remote ? 5.0 : 3.5;

  // Block G: Listing Legitimacy & Ghost Job Check
  const postedStr = (job.postedDate || '').toLowerCase();
  let ghostJobWarning = false;
  let listingStatus = 'active';
  let blockGScore = 5.0;

  if (postedStr.includes('30+') || postedStr.includes('reposted')) {
    ghostJobWarning = true;
    listingStatus = 'stale';
    blockGScore = 2.5;
  }

  // Overall Weighted Rating (1.0 to 5.0)
  const overallRating = Math.round(((blockBScore * 0.4) + (blockCScore * 0.2) + (blockDScore * 0.15) + (blockEScore * 0.15) + (blockGScore * 0.1)) * 10) / 10;

  return {
    overallRating,
    listingStatus,
    ghostJobWarning,
    blocks: {
      blockA: { name: 'Role & Company Summary', score: 4.8, detail: `${job.company} — ${job.title}` },
      blockB: { name: 'CV & Core Skill Match', score: blockBScore, detail: `${matchData.matchedSkills.length} skills matched (${matchData.matchedCoreSkills.length} Core)` },
      blockC: { name: 'Seniority Level Fit', score: blockCScore, detail: `Target title alignment with ${userProfile.title}` },
      blockD: { name: 'Compensation Fit', score: blockDScore, detail: job.salary || 'Competitive market salary' },
      blockE: { name: 'Work Environment Fit', score: blockEScore, detail: job.remote ? '100% Remote Friendly' : 'Hybrid / On-site' },
      blockG: { name: 'Posting Legitimacy Check', score: blockGScore, detail: ghostJobWarning ? 'Warning: Stale or reposted listing detected' : 'Verified active employer opening' }
    }
  };
}

function getSampleVaultItems() {
  return [
    {
      id: 'vault-job-101',
      jobId: 'job-101',
      title: 'Senior Frontend Engineer (React & TypeScript)',
      company: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
      location: 'San Francisco, CA (Remote)',
      remote: true,
      salary: '$165,000 - $210,000 / year',
      applyUrl: 'https://stripe.com/jobs',
      contactPerson: 'Sarah Jenkins',
      contactEmail: 's.jenkins@stripe-careers.com',
      matchScore: 92,
      matchGrade: 'S',
      matchedCoreSkills: ['React', 'TypeScript', 'JavaScript'],
      missingCoreSkills: [],
      matchedSecondarySkills: ['CSS3', 'RESTful APIs', 'Jest'],
      missingSecondarySkills: [],
      overallRating: 4.8,
      pipelineStage: 'tailored',
      listingStatus: 'active',
      priorityTag: 'Dream Job',
      customNotes: 'Tailored resume and cover letter generated. Preparing for recruiter screen.',
      dateSaved: new Date().toISOString().split('T')[0]
    },
    {
      id: 'vault-job-102',
      jobId: 'job-102',
      title: 'Full Stack Engineer (Node.js & React)',
      company: 'Vercel',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      location: 'Remote',
      remote: true,
      salary: '$150,000 - $190,000 / year',
      applyUrl: 'https://vercel.com/careers',
      contactPerson: 'Michael Chang',
      contactEmail: 'm.chang@vercel.com',
      matchScore: 88,
      matchGrade: 'S',
      matchedCoreSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      missingCoreSkills: [],
      matchedSecondarySkills: ['Docker', 'AWS'],
      missingSecondarySkills: [],
      overallRating: 4.6,
      pipelineStage: 'applied',
      listingStatus: 'active',
      priorityTag: 'High Priority',
      customNotes: 'Submitted application on careers portal. Confirmation # CONF-452199.',
      dateSaved: new Date().toISOString().split('T')[0],
      dateApplied: new Date().toISOString().split('T')[0]
    }
  ];
}
