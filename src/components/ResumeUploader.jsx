import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  Plus, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  FileText
} from 'lucide-react';
import { parseResumeText, createSampleProfile, KNOWN_SKILLS } from '../services/resumeParser.js';

export default function ResumeUploader({ userProfile, setUserProfile }) {
  const [pasteText, setPasteText] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleTextParse = () => {
    if (!pasteText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      const parsed = parseResumeText(pasteText);
      setUserProfile(parsed);
      setIsParsing(false);
      showNotification('Resume parsed successfully! Skills extracted.');
    }, 400);
  };

  const handleLoadSample = () => {
    const sample = createSampleProfile();
    setUserProfile(sample);
    showNotification('Loaded Sample Resume (Alex Johnson - Senior Software Engineer)');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsed = parseResumeText(content);
      setUserProfile(parsed);
      setIsParsing(false);
      showNotification(`Uploaded ${file.name}! Skills extracted.`);
    };
    reader.readAsText(file);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const current = userProfile.skills || [];
    if (!current.includes(newSkillInput.trim())) {
      setUserProfile({
        ...userProfile,
        skills: [...current, newSkillInput.trim()].sort()
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserProfile({
      ...userProfile,
      skills: (userProfile.skills || []).filter(s => s !== skillToRemove)
    });
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          gridColumn: '1 / -1',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#6ee7b7',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 500
        }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Left Column: File Upload & Raw Text Input */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upload Resume</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Extract skills & experience automatically</p>
          </div>
          <button className="btn-secondary" onClick={handleLoadSample} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Sparkles size={14} /> Load Demo Resume
          </button>
        </div>

        {/* Drag & Drop File Upload Box */}
        <div style={{
          border: '2px dashed var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 20px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '20px'
        }}
        onClick={() => document.getElementById('file-upload-input').click()}
        >
          <input 
            type="file" 
            id="file-upload-input" 
            accept=".txt,.md,.pdf,.doc,.docx" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
          />
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <FileUp size={24} color="var(--accent-indigo)" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Click to upload your resume file
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supports PDF, TXT, DOCX, Markdown
          </p>
        </div>

        {/* Or Paste Raw Text */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Or Paste Resume Content Directly:
          </label>
          <textarea
            className="input-field"
            rows={7}
            placeholder="Paste your raw resume summary, work history, and skills list here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
            onClick={handleTextParse}
            disabled={isParsing || !pasteText.trim()}
          >
            {isParsing ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
            {isParsing ? 'Parsing Skills...' : 'Parse Resume Text'}
          </button>
        </div>
      </div>

      {/* Right Column: Parsed Master Profile & Skill Tag Editor */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Master Candidate Profile</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Refine your extracted skills and personal details
        </p>

        {/* Profile Info Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={userProfile.fullName || ''} 
              onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Title</label>
            <input 
              type="text" 
              className="input-field" 
              value={userProfile.title || ''} 
              onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={userProfile.email || ''} 
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Years Experience</label>
            <input 
              type="number" 
              className="input-field" 
              value={userProfile.yearsOfExperience || 0} 
              onChange={(e) => setUserProfile({ ...userProfile, yearsOfExperience: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
        </div>

        {/* Skill Tag Manager */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Extracted Skill Taxonomy ({userProfile.skills?.length || 0})</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Add skill (e.g. React, Python, AWS)..." 
              value={newSkillInput} 
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button className="btn-secondary" onClick={handleAddSkill}>
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Skill Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '220px', overflowY: 'auto', padding: '4px' }}>
            {(userProfile.skills || []).map((skill, idx) => (
              <span key={idx} style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {skill}
                <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} />
              </span>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Master Profile Summary
          </label>
          <textarea
            className="input-field"
            rows={3}
            value={userProfile.summary || ''}
            onChange={(e) => setUserProfile({ ...userProfile, summary: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
