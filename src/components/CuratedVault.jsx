import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Layers, 
  Wand2, 
  ShieldCheck, 
  MessageSquare, 
  ChevronRight,
  RefreshCw,
  Award,
  FileText
} from 'lucide-react';
import { 
  getCuratedVaultItems, 
  updateVaultStage, 
  removeFromCuratedVault, 
  checkListingHealthStatus, 
  PIPELINE_STAGES 
} from '../services/curatedVault.js';
import { generateStarInterviewStories } from '../services/starInterviewBuilder.js';

export default function CuratedVault({ userProfile, onTailorJob, onLogUnemployment }) {
  const [vaultItems, setVaultItems] = useState([]);
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'list'
  const [selectedVaultItem, setSelectedVaultItem] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('evaluation'); // 'evaluation' | 'star' | 'notes'

  useEffect(() => {
    const items = getCuratedVaultItems();
    setVaultItems(items);
    if (items.length > 0 && !selectedVaultItem) {
      setSelectedVaultItem(items[0]);
    }
  }, []);

  const handleStageChange = (itemId, newStage) => {
    const updated = updateVaultStage(itemId, newStage, userProfile);
    setVaultItems(updated);
    if (selectedVaultItem && (selectedVaultItem.id === itemId || selectedVaultItem.jobId === itemId)) {
      setSelectedVaultItem({ ...selectedVaultItem, pipelineStage: newStage });
    }
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Remove this saved opportunity from your Curated Vault?')) {
      const updated = removeFromCuratedVault(itemId);
      setVaultItems(updated);
      if (selectedVaultItem && (selectedVaultItem.id === itemId || selectedVaultItem.jobId === itemId)) {
        setSelectedVaultItem(updated[0] || null);
      }
    }
  };

  const handleRecheckStatus = (item) => {
    const health = checkListingHealthStatus(item);
    alert(`Status Check for ${item.company}: ${health.status.toUpperCase()} (${health.lastChecked}). Ghost Warning: ${health.ghostWarning ? 'YES' : 'NONE'}`);
  };

  const starStories = selectedVaultItem ? generateStarInterviewStories(userProfile, selectedVaultItem) : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Bookmark size={22} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Curated Match Vault & Application CRM</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
              Persistent job match repository, A-G multidimensional evaluation rating, ghost job detection, and STAR+R interview prep.
            </p>
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={activeView === 'kanban' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveView('kanban')}
              style={{ fontSize: '0.85rem' }}
            >
              <Layers size={16} /> Kanban Pipeline
            </button>
            <button
              className={activeView === 'list' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveView('list')}
              style={{ fontSize: '0.85rem' }}
            >
              <FileText size={16} /> Detailed Evaluation List
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {activeView === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'start'
        }}>
          {PIPELINE_STAGES.map(stage => {
            const stageItems = vaultItems.filter(item => item.pipelineStage === stage.id);
            return (
              <div
                key={stage.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderTop: `3px solid ${stage.color}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>{stage.icon}</span>
                    <span>{stage.label.split('/')[0]}</span>
                  </div>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {stageItems.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageItems.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No items in {stage.label.split('/')[0]}
                    </div>
                  ) : (
                    stageItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          background: selectedVaultItem?.id === item.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                          border: selectedVaultItem?.id === item.id ? '1px solid var(--accent-indigo)' : '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedVaultItem(item)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {item.title}
                          </div>
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={10} fill="#fcd34d" /> {item.overallRating || '4.5'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '8px' }}>
                          {item.company}
                        </div>

                        {item.ghostJobWarning && (
                          <div style={{ fontSize: '0.7rem', color: '#fda4af', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                            <AlertTriangle size={11} /> Stale / Ghost Job Warning
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <select
                            className="input-field"
                            style={{ padding: '2px 6px', fontSize: '0.72rem', width: 'auto' }}
                            value={item.pipelineStage}
                            onChange={(e) => handleStageChange(item.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {PIPELINE_STAGES.map(s => (
                              <option key={s.id} value={s.id}>{s.label.split('/')[0]}</option>
                            ))}
                          </select>

                          <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Item Detail & A-G Evaluation / STAR+R Panel */}
      {selectedVaultItem && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-emerald">Rating: {selectedVaultItem.overallRating} / 5.0</span>
                <span className="badge badge-indigo">{selectedVaultItem.matchScore}% Match Score</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status: {selectedVaultItem.listingStatus.toUpperCase()}</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedVaultItem.title}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedVaultItem.company} — {selectedVaultItem.location}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" onClick={() => onTailorJob(selectedVaultItem)} style={{ fontSize: '0.82rem' }}>
                <Wand2 size={15} /> Tailor Application
              </button>
              <button className="btn-secondary" onClick={() => handleRecheckStatus(selectedVaultItem)} style={{ fontSize: '0.82rem' }}>
                <RefreshCw size={15} /> Re-check Status
              </button>
            </div>
          </div>

          {/* Subtabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button className={activeSubTab === 'evaluation' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveSubTab('evaluation')} style={{ fontSize: '0.82rem' }}>
              <Award size={15} /> Block A-G Evaluation Report
            </button>
            <button className={activeSubTab === 'star' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveSubTab('star')} style={{ fontSize: '0.82rem' }}>
              <MessageSquare size={15} /> STAR+R Behavioral Interview Stories
            </button>
          </div>

          {/* Subtab 1: A-G Evaluation Report */}
          {activeSubTab === 'evaluation' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {selectedVaultItem.evaluationBlocks && Object.entries(selectedVaultItem.evaluationBlocks).map(([key, block]) => (
                <div key={key} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{key.toUpperCase()} • {block.name}</span>
                    <span style={{ fontWeight: 800, color: block.score >= 4.0 ? '#6ee7b7' : '#fda4af', fontSize: '0.95rem' }}>{block.score} / 5.0</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{block.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* Subtab 2: STAR+R Behavioral Interview Prep */}
          {activeSubTab === 'star' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {starStories.map(story => (
                <div key={story.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-purple">{story.category}</span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>{story.question}</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
                    <div><strong>Situation:</strong> {story.situation}</div>
                    <div><strong>Task:</strong> {story.task}</div>
                    <div><strong>Action:</strong> {story.action}</div>
                    <div><strong>Result:</strong> {story.result}</div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
                    💡 Reflection: {story.reflection}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
