import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Wand2, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Star,
  Bookmark
} from 'lucide-react';
import { calculateJobMatch } from '../services/jobMatcher.js';

export default function JobCard({ job, userProfile, onSelectJob, onTailorJob, onQuickLogUnemployment, isLogged, onSaveToVault, isSavedInVault }) {
  const match = calculateJobMatch(job, userProfile);
  const score = match.matchScore;

  let badgeClass = 'badge-emerald';
  if (score < 60) badgeClass = 'badge-rose';
  else if (score < 75) badgeClass = 'badge-amber';
  else if (score < 88) badgeClass = 'badge-indigo';

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
      }}
    >
      {/* Top Card Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <img 
              src={job.logo} 
              alt={job.company} 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid var(--glass-border)',
                background: '#0f172a'
              }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                {job.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{job.company}</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Badge & Bookmark */}
          <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div className={`badge ${badgeClass}`} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
              <Sparkles size={14} />
              {score}% Match
            </div>
            
            <button
              onClick={() => onSaveToVault(job)}
              style={{
                background: isSavedInVault ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                border: isSavedInVault ? '1px solid var(--accent-purple)' : '1px solid var(--glass-border)',
                color: isSavedInVault ? '#c084fc' : 'var(--text-muted)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
              title="Save to Curated Match Vault CRM"
            >
              <Bookmark size={12} fill={isSavedInVault ? '#c084fc' : 'none'} />
              {isSavedInVault ? 'In Vault' : 'Save Match'}
            </button>
          </div>
        </div>

        {/* Meta details */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '14px 0', fontSize: '0.82rem' }}>
          {job.salary && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', padding: '4px 10px', borderRadius: '6px' }}>
              <DollarSign size={13} /> {job.salary}
            </span>
          )}
          {job.remote && (
            <span className="badge badge-indigo">
              Remote Friendly
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', padding: '4px 0' }}>
            Posted {job.postedDate}
          </span>
        </div>

        {/* Skill Match Breakdown */}
        <div style={{ margin: '16px 0', background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skill Gap Breakdown ({match.matchedSkills.length}/{match.totalRequiredCount} Matched)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(match.matchedCoreSkills || []).map((skill, idx) => (
              <span key={`core-${idx}`} style={{
                fontSize: '0.75rem',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fcd34d',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}>
                <Star size={11} fill="#fcd34d" /> Core: {skill}
              </span>
            ))}
            {(match.matchedSecondarySkills || []).map((skill, idx) => (
              <span key={`sec-${idx}`} style={{
                fontSize: '0.75rem',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={11} /> {skill}
              </span>
            ))}
            {match.missingSkills.slice(0, 3).map((skill, idx) => (
              <span key={`miss-${idx}`} style={{
                fontSize: '0.75rem',
                background: 'rgba(244, 63, 94, 0.12)',
                color: '#fda4af',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <XCircle size={11} /> Missing: {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-primary" 
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            onClick={() => onTailorJob(job)}
          >
            <Wand2 size={15} /> Tailor Resume & Cover Letter
          </button>
          <button 
            className="btn-secondary" 
            style={{ 
              fontSize: '0.82rem', 
              padding: '8px 12px',
              background: isLogged ? 'rgba(16, 185, 129, 0.2)' : undefined,
              borderColor: isLogged ? 'rgba(16, 185, 129, 0.4)' : undefined,
              color: isLogged ? '#6ee7b7' : undefined
            }}
            onClick={() => onQuickLogUnemployment(job)}
            title="Log this application for state/federal unemployment work search audit history"
          >
            <ShieldCheck size={15} /> {isLogged ? 'Logged for Benefits' : 'Log Application'}
          </button>
        </div>

        <button 
          onClick={() => onSelectJob(job)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-indigo)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
