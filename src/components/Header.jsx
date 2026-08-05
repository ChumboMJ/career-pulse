import React from 'react';
import { 
  Briefcase, 
  FileText, 
  Wand2, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, userProfile, loggedApplicationsCount }) {
  const tabs = [
    { id: 'jobs', label: 'Job Search & Match', icon: Briefcase },
    { id: 'resume', label: 'Master Resume', icon: FileText },
    { id: 'tailor', label: 'Tailor & Cover Letter', icon: Wand2 },
    { id: 'unemployment', label: 'Unemployment Log', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const skillCount = userProfile?.skills?.length || 0;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('jobs')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">
                CareerPulse
              </h1>
              <span className="badge badge-emerald">AI Assistant</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Resume Skill Matcher & Unemployment Compliance Tracker
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border)'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--gradient-brand)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
                {tab.id === 'unemployment' && loggedApplicationsCount > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--accent-indigo)',
                    color: '#fff',
                    borderRadius: '9999px',
                    padding: '2px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {loggedApplicationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Mini Profile Quick Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <UserCheck size={18} color="var(--accent-emerald)" />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {userProfile?.fullName || 'User Profile'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                {skillCount} Skills Loaded
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
