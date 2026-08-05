import React from 'react';
import { ExternalLink, Sparkles, Target } from 'lucide-react';
import { generateTop5BoardUrls } from '../services/jobApi.js';

export default function TopJobBoardsBar({ userProfile, searchQuery }) {
  const title = searchQuery || userProfile?.title || 'Software Engineer';
  const skills = userProfile?.skills || [];
  const boardUrls = generateTop5BoardUrls(title, skills, 'Remote');

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--accent-indigo)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Top 5 Job Boards (Pre-filled with Your Profile Skills)</h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Target Query: <strong style={{ color: 'var(--accent-cyan)' }}>"{title} {skills.slice(0, 2).join(' ')}"</strong>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        {boardUrls.map((board, idx) => (
          <a
            key={idx}
            href={board.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--glass-border)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = board.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div>{board.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>{board.badge}</div>
            </div>
            <ExternalLink size={14} color={board.color} />
          </a>
        ))}
      </div>
    </div>
  );
}
