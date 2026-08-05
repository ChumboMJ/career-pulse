// Unemployment Work Search Activity Logger & Compliance Exporter

const LOG_STORAGE_KEY = 'careerpulse_unemployment_log_v1';

/**
 * Gets all logged job search entries from local storage
 */
export function getWorkSearchLogs() {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading unemployment logs', e);
  }
  return getSampleLogs();
}

/**
 * Saves or updates a work search log entry
 */
export function saveWorkSearchLog(entry) {
  const logs = getWorkSearchLogs();
  const existingIdx = logs.findIndex(item => item.id === entry.id || (item.jobId && item.jobId === entry.jobId));

  const updatedEntry = {
    id: entry.id || `log-${Date.now()}`,
    jobId: entry.jobId || null,
    dateApplied: entry.dateApplied || new Date().toISOString().split('T')[0],
    companyName: entry.companyName || 'Company Name',
    jobTitle: entry.jobTitle || 'Position Title',
    location: entry.location || 'Remote',
    applicationMethod: entry.applicationMethod || 'Online Application Portal',
    contactPerson: entry.contactPerson || 'Hiring Manager / HR',
    contactInfo: entry.contactInfo || entry.applyUrl || 'Company Careers Page',
    confirmationNum: entry.confirmationNum || `CONF-${Math.floor(100000 + Math.random() * 900000)}`,
    status: entry.status || 'Applied',
    weeklyBenefitPeriod: getWeekEndingDate(entry.dateApplied || new Date()),
    notes: entry.notes || 'Submitted tailored resume and cover letter.'
  };

  if (existingIdx >= 0) {
    logs[existingIdx] = { ...logs[existingIdx], ...updatedEntry };
  } else {
    logs.unshift(updatedEntry);
  }

  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save log', e);
  }

  return logs;
}

/**
 * Deletes a work search log entry
 */
export function deleteWorkSearchLog(id) {
  let logs = getWorkSearchLogs();
  logs = logs.filter(item => item.id !== id);
  try {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to delete log', e);
  }
  return logs;
}

/**
 * Groups logs by week ending date (Sunday)
 */
export function getLogsGroupedByWeek(logs) {
  const groups = {};

  logs.forEach(log => {
    const weekEnding = log.weeklyBenefitPeriod || getWeekEndingDate(log.dateApplied);
    if (!groups[weekEnding]) {
      groups[weekEnding] = [];
    }
    groups[weekEnding].push(log);
  });

  return groups;
}

/**
 * Exports logs to CSV format for unemployment portal upload
 */
export function exportLogsToCSV(logs) {
  const headers = [
    'Date Applied',
    'Company / Employer Name',
    'Job Title',
    'Location / Remote',
    'Application Method',
    'Contact Person / Info',
    'Confirmation # / Link',
    'Status',
    'Week Ending Date',
    'Notes'
  ];

  const rows = logs.map(l => [
    escapeCSV(l.dateApplied),
    escapeCSV(l.companyName),
    escapeCSV(l.jobTitle),
    escapeCSV(l.location),
    escapeCSV(l.applicationMethod),
    escapeCSV(l.contactPerson + ' (' + l.contactInfo + ')'),
    escapeCSV(l.confirmationNum),
    escapeCSV(l.status),
    escapeCSV(l.weeklyBenefitPeriod),
    escapeCSV(l.notes)
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + 
    [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Unemployment_Work_Search_Log_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCSV(str) {
  if (!str) return '""';
  return `"${String(str).replace(/"/g, '""')}"`;
}

function getWeekEndingDate(dateInput) {
  const d = new Date(dateInput);
  // Get next Saturday/Sunday for week ending
  const day = d.getDay();
  const diff = d.getDate() + (6 - day); // Saturday week ending
  const saturday = new Date(d.setDate(diff));
  return saturday.toISOString().split('T')[0];
}

function getSampleLogs() {
  const today = new Date();
  const d1 = new Date(today);
  const d2 = new Date(today);
  d2.setDate(d2.getDate() - 3);
  const d3 = new Date(today);
  d3.setDate(d3.getDate() - 5);

  return [
    {
      id: 'log-1',
      jobId: 'job-101',
      dateApplied: d1.toISOString().split('T')[0],
      companyName: 'Stripe',
      jobTitle: 'Senior Frontend Engineer (React & TypeScript)',
      location: 'San Francisco, CA (Remote)',
      applicationMethod: 'Company Careers Web Portal',
      contactPerson: 'Sarah Jenkins (Technical Recruiter)',
      contactInfo: 's.jenkins@stripe-careers.com',
      confirmationNum: 'CONF-892104',
      status: 'Applied',
      weeklyBenefitPeriod: getWeekEndingDate(d1),
      notes: 'Applied online via company jobs board. Submitted tailored resume.'
    },
    {
      id: 'log-2',
      jobId: 'job-102',
      dateApplied: d2.toISOString().split('T')[0],
      companyName: 'Vercel',
      jobTitle: 'Full Stack Engineer (Node.js & React)',
      location: 'Remote',
      applicationMethod: 'LinkedIn Easy Apply',
      contactPerson: 'Michael Chang',
      contactInfo: 'm.chang@vercel.com',
      confirmationNum: 'CONF-452199',
      status: 'Interview Scheduled',
      weeklyBenefitPeriod: getWeekEndingDate(d2),
      notes: 'Screening interview scheduled with technical recruiter.'
    },
    {
      id: 'log-3',
      jobId: 'job-103',
      dateApplied: d3.toISOString().split('T')[0],
      companyName: 'Datadog',
      jobTitle: 'DevOps & Cloud Infrastructure Engineer',
      location: 'New York, NY',
      applicationMethod: 'Email Application',
      contactPerson: 'Emily Turner',
      contactInfo: 'eturner@datadoghq.com',
      confirmationNum: 'CONF-110293',
      status: 'Applied',
      weeklyBenefitPeriod: getWeekEndingDate(d3),
      notes: 'Sent direct email with tailored cover letter and resume PDF.'
    }
  ];
}
