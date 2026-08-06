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
  FileText,
  Star
} from 'lucide-react';
import mammoth from 'mammoth';
import { parseResumeText, createSampleProfile, KNOWN_SKILLS } from '../services/resumeParser.js';

export default function ResumeUploader({ userProfile, setUserProfile }) {
  const [pasteText, setPasteText] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [notification, setNotification] = useState(null);

  const coreSkills = userProfile.coreSkills || [];
  const allSkills = userProfile.skills || [];

  const handleTextParse = () => {
    if (!pasteText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      const parsed = parseResumeText(pasteText);
      setUserProfile(parsed);
      setIsParsing(false);
      showNotification(`Parsed text successfully! ${parsed.skills.length} skills extracted.`);
    }, 400);
  };

  const handleLoadSample = () => {
    const sample = createSampleProfile();
    setUserProfile(sample);
    showNotification(`Loaded Sample Resume (${sample.fullName} - ${sample.title})`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value || '';
          const parsed = parseResumeText(text);
          setUserProfile(parsed);
          setIsParsing(false);
          showNotification(`Uploaded ${file.name}! ${parsed.skills.length} skills extracted.`);
        } catch (err) {
          console.error('Error parsing DOCX file', err);
          setIsParsing(false);
          alert('Could not parse DOCX binary. Please paste the resume text directly.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const parsed = parseResumeText(content);
        setUserProfile(parsed);
        setIsParsing(false);
        showNotification(`Uploaded ${file.name}! ${parsed.skills.length} skills extracted.`);
      };
      reader.readAsText(file);
    }
  };

  const handleToggleCoreSkill = (skill) => {
    const isCore = coreSkills.includes(skill);
    if (isCore) {
      // Remove from core skills
      setUserProfile({
        ...userProfile,
        coreSkills: coreSkills.filter(s => s !== skill)
      });
    } else {
      // Add to core skills if under max 10
      if (coreSkills.length >= 10) {
        alert('You can select a maximum of 10 Core Skills. Unstar another skill first.');
        return;
      }
      setUserProfile({
        ...userProfile,
        coreSkills: [...coreSkills, skill]
      });
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const sName = newSkillInput.trim();
    if (!allSkills.includes(sName)) {
      const updatedSkills = [...allSkills, sName].sort();
      let updatedCore = coreSkills;
      if (coreSkills.length < 10) {
        updatedCore = [...coreSkills, sName];
      }
      setUserProfile({
        ...userProfile,
        skills: updatedSkills,
        coreSkills: updatedCore
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserProfile({
      ...userProfile,
      skills: allSkills.filter(s => s !== skillToRemove),
      coreSkills: coreSkills.filter(s => s !== skillToRemove)
    });
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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
            <Sparkles size={14} /> Load Tim Forste Resume
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
            justify: 'center',
            margin: '0 auto 12px'
          }}>
            <FileUp size={24} color="var(--accent-indigo)" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Click to upload your resume file (.docx, .pdf, .txt)
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supports Word DOCX, PDF, TXT, Markdown
          </p>
        </div>

        {/* Or Paste Raw Text */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Or Paste Resume Content Directly:
          </label>
          <textarea
            className="input-field"
            rows={8}
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

      {/* Right Column: Parsed Master Profile & Core Skill Selector */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Master Candidate Profile</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Refine skills & mark up to 10 Core Skills</p>
          </div>
          <div className="badge badge-amber" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
            <Star size={14} fill="currentColor" /> Core Skills: {coreSkills.length} / 10
          </div>
        </div>

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
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Skill Taxonomy ({allSkills.length} Total Skills)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click ⭐ on a skill to mark it as a Core Skill (2.0x match weight)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Add new skill (e.g. C#, .NET Core, Azure)..." 
              value={newSkillInput} 
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button className="btn-secondary" onClick={handleAddSkill}>
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Skill Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '240px', overflowY: 'auto', padding: '4px' }}>
            {allSkills.map((skill, idx) => {
              const isCore = coreSkills.includes(skill);
              return (
                <span key={idx} style={{
                  background: isCore ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                  color: isCore ? '#fcd34d' : '#a5b4fc',
                  border: isCore ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isCore ? 600 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}>
                  <Star 
                    size={13} 
                    fill={isCore ? '#fcd34d' : 'transparent'} 
                    color={isCore ? '#fcd34d' : 'var(--text-muted)'} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleCoreSkill(skill)}
                    title={isCore ? 'Unmark as Core Skill' : 'Mark as Core Skill (up to 10 max)'}
                  />
                  {skill}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} />
                </span>
              );
            })}
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
