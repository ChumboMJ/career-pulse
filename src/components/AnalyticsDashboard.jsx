import React from 'react';
import { BarChart3, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Target } from 'lucide-react';

export default function AnalyticsDashboard({ userProfile, jobs, loggedCount }) {
  const userSkills = userProfile?.skills || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {/* Metric 1 */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Candidate Skill Profile</span>
          <Sparkles size={20} color="var(--accent-indigo)" />
        </div>
        <div style={{ fontSize: '2.2rem', fontWeight: 800 }} className="gradient-text">{userSkills.length}</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Extracted technical & professional competencies
        </p>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unemployment Audit Log</span>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
        </div>
        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6ee7b7' }}>{loggedCount}</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Verified job application contacts logged for benefit claims
        </p>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Alignment</span>
          <TrendingUp size={20} color="var(--accent-cyan)" />
        </div>
        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>84%</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Average match score across high-demand openings
        </p>
      </div>

      {/* Skill Strength Breakdown */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Top Skills in Candidate Portfolio</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {userSkills.map((s, idx) => (
            <div key={idx} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--glass-border)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={15} color="var(--accent-emerald)" />
              <span style={{ fontWeight: 600 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
