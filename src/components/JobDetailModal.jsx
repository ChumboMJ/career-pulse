import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Wand2, 
  ShieldCheck, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { calculateJobMatch } from '../services/jobMatcher.js';
import { generateExternalSearchUrls } from '../services/jobApi.js';

export default function JobDetailModal({ job, userProfile, onClose, onTailorJob, onLogUnemployment, isLogged }) {
  if (!job) return null;

  const match = calculateJobMatch(job, userProfile);
  const extUrls = generateExternalSearchUrls(job.title, job.location);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img 
              src={job.logo} 
              alt={job.company} 
              style={{ width: '60px', height: '60px', borderRadius: '16px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
            />
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.95rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{job.company}</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPin size={15} /> {job.location}</span>
                {job.salary && (
                  <>
                    <span>•</span>
                    <span style={{ color: '#6ee7b7' }}>{job.salary}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Match Breakdown Section */}
        <div style={{ 
          background: 'var(--gradient-card)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '20px', 
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--accent-indigo)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Candidate Match Score</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">{match.matchScore}%</span>
              <span className={`badge badge-${match.grade === 'S' ? 'emerald' : match.grade === 'A' ? 'indigo' : 'amber'}`}>
                Grade {match.grade} Match
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {match.recommendation}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Required Skills Analysis
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {match.matchedSkills.map((skill, i) => (
                <span key={i} className="badge badge-emerald"><CheckCircle2 size={12} /> {skill}</span>
              ))}
              {match.missingSkills.map((skill, i) => (
                <span key={i} className="badge badge-rose"><XCircle size={12} /> Missing: {skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
          <button className="btn-primary" onClick={() => { onClose(); onTailorJob(job); }}>
            <Wand2 size={18} /> Generate Tailored Resume & Cover Letter
          </button>
          <button className="btn-secondary" onClick={() => { onLogUnemployment(job); }} style={{ background: isLogged ? 'rgba(16, 185, 129, 0.2)' : undefined }}>
            <ShieldCheck size={18} color={isLogged ? '#6ee7b7' : undefined} /> 
            {isLogged ? 'Logged in Unemployment Activity File' : 'Log for Unemployment Benefits'}
          </button>
          
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <a href={extUrls.linkedIn} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              LinkedIn Jobs <ExternalLink size={14} />
            </a>
            <a href={extUrls.googleJobs} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              Google Jobs <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Description Body */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Job Description</h3>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', whitespace: 'pre-line', lineHeight: 1.6 }}>
            {job.description}
          </div>
        </div>

        {job.contactPerson && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Hiring Contact Information</h4>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {job.contactPerson} — <a href={`mailto:${job.contactEmail}`} style={{ color: 'var(--accent-cyan)' }}>{job.contactEmail}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
