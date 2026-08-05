import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Copy, 
  Download, 
  Check, 
  FileText, 
  Sparkles, 
  Briefcase, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { generateTailoredResume, generateCoverLetter } from '../services/aiTailor.js';

export default function TailorStudio({ userProfile, selectedJob, availableJobs, onSelectJob }) {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'coverletter'
  const [tone, setTone] = useState('Professional');
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const [currentJob, setCurrentJob] = useState(selectedJob || (availableJobs && availableJobs[0]) || null);

  useEffect(() => {
    if (selectedJob) {
      setCurrentJob(selectedJob);
    }
  }, [selectedJob]);

  const tailoredResume = currentJob ? generateTailoredResume(userProfile, currentJob) : null;
  const [coverLetterText, setCoverLetterText] = useState('');

  useEffect(() => {
    if (currentJob && userProfile) {
      setCoverLetterText(generateCoverLetter(userProfile, currentJob, tone));
    }
  }, [currentJob, userProfile, tone]);

  const handleCopyResume = () => {
    if (!tailoredResume) return;
    navigator.clipboard.writeText(tailoredResume.formattedMarkdown);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleDownloadText = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!currentJob) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <Wand2 size={40} color="var(--accent-indigo)" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Select a Job to Tailor Your Application</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '500px', margin: '8px auto 20px' }}>
          Choose a job posting from your search results to generate a job-specific resume variant and personalized cover letter.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {/* Top Selector Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={currentJob.logo} alt={currentJob.company} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Job Posting
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentJob.title} — <span style={{ color: 'var(--accent-cyan)' }}>{currentJob.company}</span>
            </h2>
          </div>
        </div>

        {/* Change Target Job Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Switch Job:</label>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '220px' }}
            value={currentJob.id}
            onChange={(e) => {
              const found = availableJobs.find(j => j.id === e.target.value);
              if (found) {
                setCurrentJob(found);
                onSelectJob(found);
              }
            }}
          >
            {availableJobs && availableJobs.map(j => (
              <option key={j.id} value={j.id}>{j.company} - {j.title.slice(0, 30)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Studio Subtabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('resume')}
            >
              <FileText size={16} /> Tailored Resume Variant
            </button>
            <button
              className={activeTab === 'coverletter' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('coverletter')}
            >
              <Wand2 size={16} /> Targeted Cover Letter
            </button>
          </div>

          {activeTab === 'resume' ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={handleCopyResume}>
                {copiedResume ? <Check size={16} color="#6ee7b7" /> : <Copy size={16} />}
                {copiedResume ? 'Copied Markdown!' : 'Copy Resume'}
              </button>
              <button className="btn-primary" onClick={() => handleDownloadText(tailoredResume.formattedMarkdown, `${currentJob.company}_Tailored_Resume.md`)}>
                <Download size={16} /> Download Resume (.md)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tone:</span>
              <select className="input-field" style={{ width: 'auto' }} value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="Professional">Professional & Balanced</option>
                <option value="Enthusiastic">Enthusiastic & High Energy</option>
                <option value="Executive">Executive & Leadership</option>
              </select>
              <button className="btn-secondary" onClick={handleCopyLetter}>
                {copiedLetter ? <Check size={16} color="#6ee7b7" /> : <Copy size={16} />}
                {copiedLetter ? 'Copied!' : 'Copy Letter'}
              </button>
              <button className="btn-primary" onClick={() => handleDownloadText(coverLetterText, `${currentJob.company}_Cover_Letter.txt`)}>
                <Download size={16} /> Download (.txt)
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Tailored Resume View */}
        {activeTab === 'resume' && (
          <div>
            {/* Optimization Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Role ATS Alignment</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>{tailoredResume.atsMatchScore}% Match</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keywords Inserted</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{tailoredResume.matchedKeywordsCount} Skills</div>
              </div>
            </div>

            {/* Resume Preview Box */}
            <div style={{
              background: '#0f172a',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              color: '#e2e8f0',
              maxHeight: '550px',
              overflowY: 'auto'
            }}>
              {tailoredResume.formattedMarkdown}
            </div>
          </div>
        )}

        {/* Tab 2: Targeted Cover Letter View */}
        {activeTab === 'coverletter' && (
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Editable Cover Letter Draft:
            </label>
            <textarea
              className="input-field"
              rows={16}
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', lineHeight: '1.7', resize: 'vertical' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
