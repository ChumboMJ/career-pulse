import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ResumeUploader from './components/ResumeUploader';
import TailorStudio from './components/TailorStudio';
import UnemploymentLog from './components/UnemploymentLog';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TopJobBoardsBar from './components/TopJobBoardsBar';
import EmployerFeedManager from './components/EmployerFeedManager';
import ProfileSelectorModal from './components/ProfileSelectorModal';
import { searchJobs } from './services/jobApi';
import { getActiveProfile, saveProfile, setActiveProfileId } from './services/profileManager';
import { getWorkSearchLogs, saveWorkSearchLog } from './services/unemploymentLogger';
import { calculateJobMatch } from './services/jobMatcher';
import { Search, Sparkles, RefreshCw, UserCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [userProfile, setUserProfile] = useState(() => getActiveProfile());
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showEmployerFeedsToggle, setShowEmployerFeedsToggle] = useState(true);
  const [minMatchScore, setMinMatchScore] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [tailorJobTarget, setTailorJobTarget] = useState(null);

  const [loggedApplications, setLoggedApplications] = useState([]);

  // Save current profile whenever edited
  const handleUpdateProfile = (updatedProfile) => {
    const result = saveProfile(updatedProfile);
    setUserProfile(result.active);
  };

  // Switch profile handler
  const handleSelectProfile = (profile) => {
    setActiveProfileId(profile.id);
    setUserProfile(profile);
    setShowProfileModal(false);
  };

  // Load initial jobs & unemployment logs
  useEffect(() => {
    fetchJobs();
    setLoggedApplications(getWorkSearchLogs());
  }, [userProfile]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    const results = await searchJobs({ 
      query: searchQuery, 
      remoteOnly, 
      includeEmployerFeeds: showEmployerFeedsToggle,
      userSkills: userProfile?.skills || []
    });

    // Sort jobs by Match Score descending for the active profile
    const sorted = results.map(job => ({
      ...job,
      computedMatch: calculateJobMatch(job, userProfile)
    })).sort((a, b) => b.computedMatch.matchScore - a.computedMatch.matchScore);

    setJobs(sorted);
    if (!tailorJobTarget && sorted.length > 0) {
      setTailorJobTarget(sorted[0]);
    }
    setLoadingJobs(false);
  };

  const handleAutoMatchProfile = () => {
    const topSkills = (userProfile?.skills || []).slice(0, 2).join(' ');
    const targetTitle = userProfile?.title || 'Software Engineer';
    setSearchQuery(`${targetTitle} ${topSkills}`.trim());
    setTimeout(() => fetchJobs(), 100);
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
      notes: `Applied for ${job.title}. Tailored resume generated for ${userProfile.fullName}.`
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

  const filteredJobs = minMatchScore > 0 
    ? jobs.filter(j => j.computedMatch.matchScore >= minMatchScore)
    : jobs;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile} 
        loggedApplicationsCount={loggedApplications.length}
        onOpenProfileSelector={() => setShowProfileModal(true)}
      />

      <main style={{ flex: 1, maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {/* Profile Onboarding / Active Context Banner */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={18} color="var(--accent-indigo)" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Profile Context
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {userProfile.fullName} — <span style={{ color: 'var(--accent-cyan)' }}>{userProfile.title}</span> ({userProfile.skills?.length || 0} Skills)
              </div>
            </div>
          </div>

          <button className="btn-secondary" onClick={() => setShowProfileModal(true)} style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            Switch or Add Profile
          </button>
        </div>

        {/* Tab 1: Job Search & Skill Matcher */}
        {activeTab === 'jobs' && (
          <div>
            {/* Top 5 Job Boards Bar */}
            <TopJobBoardsBar userProfile={userProfile} searchQuery={searchQuery} />

            {/* Custom Employer Feed Manager */}
            <EmployerFeedManager onFeedsUpdated={fetchJobs} />

            {/* Search & Filter Bar */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Search roles, target skills (e.g. React, Python, Remote)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleAutoMatchProfile}
                  title="Auto-fill query with your top profile skills"
                  style={{ fontSize: '0.85rem' }}
                >
                  <Sparkles size={16} color="var(--accent-indigo)" /> Auto-Match Profile
                </button>

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

                  <select 
                    className="input-field" 
                    style={{ width: 'auto', fontSize: '0.85rem' }}
                    value={minMatchScore}
                    onChange={(e) => setMinMatchScore(parseInt(e.target.value, 10))}
                  >
                    <option value={0}>All Match Scores</option>
                    <option value={80}>High Match (80%+)</option>
                    <option value={60}>Moderate Match (60%+)</option>
                  </select>

                  <button type="submit" className="btn-primary">
                    {loadingJobs ? <RefreshCw size={16} className="spin" /> : <Search size={16} />} Search Openings
                  </button>
                </div>
              </form>
            </div>

            {/* Results Counter Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Matched Openings for {userProfile.fullName} ({filteredJobs.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sorted by Skill Alignment with {userProfile.title}
              </span>
            </div>

            {/* Job Grid */}
            {loadingJobs ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <RefreshCw size={32} color="var(--accent-indigo)" className="spin" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Matching openings against {userProfile.fullName}'s profile...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {filteredJobs.map(job => (
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
          <ResumeUploader userProfile={userProfile} setUserProfile={handleUpdateProfile} />
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

      {/* Profile Selector Modal */}
      {showProfileModal && (
        <ProfileSelectorModal
          activeProfile={userProfile}
          onSelectProfile={handleSelectProfile}
          onCreateNewProfile={() => {
            setShowProfileModal(false);
            setActiveTab('resume');
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
