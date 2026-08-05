import React from 'react';
import { 
  UserCheck, 
  Plus, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Briefcase, 
  Trash2,
  FileUp
} from 'lucide-react';
import { getAllProfiles, deleteProfile } from '../services/profileManager.js';

export default function ProfileSelectorModal({ activeProfile, onSelectProfile, onCreateNewProfile, onClose }) {
  const profiles = getAllProfiles();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={20} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Select Candidate Profile</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
              Choose a saved profile to automatically tailor job discovery results, skill match scores, and cover letters.
            </p>
          </div>

          {onClose && (
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Profile Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {profiles.map(profile => {
            const isActive = profile.id === activeProfile?.id;
            return (
              <div
                key={profile.id}
                style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: isActive ? '2px solid var(--accent-indigo)' : '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
                onClick={() => onSelectProfile(profile)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {profile.fullName}
                    </h3>
                    {isActive && (
                      <span className="badge badge-indigo">
                        <CheckCircle2 size={12} /> Active Profile
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
                    {profile.title}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {profile.yearsOfExperience || 3}+ Years Experience • {profile.location}
                  </div>

                  {/* Skills Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {(profile.skills || []).slice(0, 5).map((skill, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {skill}
                      </span>
                    ))}
                    {(profile.skills || []).length > 5 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '2px 4px' }}>
                        +{(profile.skills || []).length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button 
                    className={isActive ? 'btn-primary' : 'btn-secondary'} 
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    onClick={(e) => { e.stopPropagation(); onSelectProfile(profile); }}
                  >
                    {isActive ? 'Current Profile' : 'Select Profile'}
                  </button>

                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete profile for ${profile.fullName}?`)) {
                          const updated = deleteProfile(profile.id);
                          onSelectProfile(updated.active);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Delete profile"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Card to Add / Upload New Profile */}
          <div
            style={{
              border: '2px dashed var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onClick={onCreateNewProfile}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '12px'
            }}>
              <Plus size={22} color="var(--accent-indigo)" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create / Upload New Profile</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Upload PDF/TXT resume or enter skills manually
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
