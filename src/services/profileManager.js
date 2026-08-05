// Multi-Profile Management Service

import { createSampleProfile } from './resumeParser.js';

const PROFILES_KEY = 'careerpulse_multi_profiles_v1';
const ACTIVE_PROFILE_KEY = 'careerpulse_active_profile_id';

const PRESET_PROFILES = [
  {
    id: 'profile-alex-johnson',
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
    summary: 'Versatile Full Stack Engineer with 5+ years of experience building high-performance web applications using React, Node.js, and Cloud services.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile-sarah-connor',
    fullName: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '(555) 345-6789',
    location: 'Seattle, WA (Remote)',
    title: 'AI / Data Engineer',
    yearsOfExperience: 4,
    skills: [
      'Python', 'SQL', 'LLMs', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy',
      'OpenAI API', 'RAG', 'BigQuery', 'AWS', 'Docker', 'ETL', 'Scikit-Learn'
    ],
    summary: 'Data Engineer focused on LLM pipelines, RAG architectures, and scalable data infrastructure.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile-marcus-vance',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '(555) 456-7890',
    location: 'Austin, TX (Hybrid)',
    title: 'Senior DevOps & Cloud Engineer',
    yearsOfExperience: 6,
    skills: [
      'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'GitHub Actions',
      'Linux', 'Bash', 'Python', 'Monitoring', 'Nginx', 'Serverless'
    ],
    summary: 'Cloud Infrastructure specialist with expertise in multi-region Kubernetes clusters and automated CI/CD.',
    updatedAt: new Date().toISOString()
  }
];

/**
 * Gets all saved profiles or initializes with presets
 */
export function getAllProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading profiles', e);
  }
  return PRESET_PROFILES;
}

/**
 * Saves all profiles array to localStorage
 */
export function saveAllProfiles(profiles) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles', e);
  }
}

/**
 * Gets currently active profile ID
 */
export function getActiveProfileId() {
  const saved = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (saved) return saved;
  const all = getAllProfiles();
  return all[0].id;
}

/**
 * Sets active profile ID
 */
export function setActiveProfileId(profileId) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

/**
 * Gets currently active profile object
 */
export function getActiveProfile() {
  const activeId = getActiveProfileId();
  const all = getAllProfiles();
  const found = all.find(p => p.id === activeId);
  return found || all[0] || createSampleProfile();
}

/**
 * Updates or creates a profile
 */
export function saveProfile(profile) {
  const all = getAllProfiles();
  const profileId = profile.id || `profile-custom-${Date.now()}`;
  const updatedProfile = { ...profile, id: profileId, updatedAt: new Date().toISOString() };

  const existingIdx = all.findIndex(p => p.id === profileId);
  if (existingIdx >= 0) {
    all[existingIdx] = updatedProfile;
  } else {
    all.unshift(updatedProfile);
  }

  saveAllProfiles(all);
  setActiveProfileId(profileId);
  return { all, active: updatedProfile };
}

/**
 * Deletes a profile
 */
export function deleteProfile(profileId) {
  let all = getAllProfiles();
  if (all.length <= 1) return { all, active: all[0] }; // Don't delete last profile

  all = all.filter(p => p.id !== profileId);
  saveAllProfiles(all);

  const newActiveId = all[0].id;
  setActiveProfileId(newActiveId);
  return { all, active: all[0] };
}
