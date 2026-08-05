import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ResumeUploader from './components/ResumeUploader';
import TailorStudio from './components/TailorStudio';
import UnemploymentLog from './components/UnemploymentLog';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { searchJobs } from './services/jobApi';
import { createSampleProfile } from './services/resumeParser';
import { getWorkSearchLogs, saveWorkSearchLog } from './services/unemploymentLogger';
import { Search, SlidersHorizontal, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('careerpulse_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return createSampleProfile();
  });

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minMatchFilter, setMinMatchFilter] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [tailorJobTarget, setTailorJobTarget] = useState(null);

  const [loggedApplications, setLoggedApplications] = useState([]);

  // Save profile state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('careerpulse_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  // Load initial jobs & unemployment logs
  useEffect(() => {
    fetchJobs();
    setLoggedApplications(getWorkSearchLogs());
  }, []);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    const results = await searchJobs({ query: searchQuery, remoteOnly });
    setJobs(results);
    if (!tailorJobTarget && results.length > 0) {
      setTailorJobTarget(results[0]);
    }
    setLoadingJobs(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleQuickLogUnemployment = (job) => {
    const newLogs = saveWorkSearchLog({
      jobId: job.id,
      companyName: job.company,
      jobTitle: job.title,
      location: job.location,
      applicationMethod: 'Online Careers Portal',
      contactPerson: job.contactPerson || 'Hiring Manager',
      contactInfo: job.contactEmail || job.applyUrl,
      notes: `Applied for ${job.title}. Tailored resume generated.`
    });
    setLoggedApplications(newLogs);
  };

  const handleTailorJob = (job) => {
    setTailorJobTarget(job);
    setActiveTab('tailor');
  };

  const isJobLogged = (jobId) => {
    return loggedApplications.some(l => l.jobId === jobId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile} 
        loggedApplicationsCount={loggedApplications.length}
      />

      <main style={{ flex: 1, maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {/* Tab 1: Job Search & Skill Matcher */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Search titles, skills (e.g. React, Python, Remote Engineer)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      style={{ accentColor: 'var(--accent-indigo)' }}
                    />
                    Remote Only
                  </label>

                  <button type="submit" className="btn-primary">
                    {loadingJobs ? <RefreshCw size={16} className="spin" /> : <Search size={16} />} Search Jobs
                  </button>
                </div>
              </form>
            </div>

            {/* Job Grid */}
            {loadingJobs ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <RefreshCw size={32} color="var(--accent-indigo)" className="spin" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Matching openings with your skills...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userProfile={userProfile}
                    onSelectJob={setSelectedJob}
                    onTailorJob={handleTailorJob}
                    onQuickLogUnemployment={handleQuickLogUnemployment}
                    isLogged={isJobLogged(job.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Master Resume */}
        {activeTab === 'resume' && (
          <ResumeUploader userProfile={userProfile} setUserProfile={setUserProfile} />
        )}

        {/* Tab 3: Tailor & Cover Letter Studio */}
        {activeTab === 'tailor' && (
          <TailorStudio 
            userProfile={userProfile} 
            selectedJob={tailorJobTarget} 
            availableJobs={jobs} 
            onSelectJob={setTailorJobTarget}
          />
        )}

        {/* Tab 4: Unemployment Log */}
        {activeTab === 'unemployment' && (
          <UnemploymentLog />
        )}

        {/* Tab 5: Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard userProfile={userProfile} jobs={jobs} loggedCount={loggedApplications.length} />
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          userProfile={userProfile}
          onClose={() => setSelectedJob(null)}
          onTailorJob={handleTailorJob}
          onLogUnemployment={handleQuickLogUnemployment}
          isLogged={isJobLogged(selectedJob.id)}
        />
      )}
    </div>
  );
}
