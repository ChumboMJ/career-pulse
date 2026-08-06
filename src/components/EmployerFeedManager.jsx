import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  Layers,
  Power
} from 'lucide-react';
import { 
  getSavedEmployerFeeds, 
  addCustomEmployerFeed, 
  toggleEmployerFeedActive, 
  deleteEmployerFeed 
} from '../services/employerFeeds.js';

export default function EmployerFeedManager({ onFeedsUpdated }) {
  const [feeds, setFeeds] = useState(getSavedEmployerFeeds());
  const [showAddModal, setShowAddModal] = useState(false);

  const [newFeed, setNewFeed] = useState({
    name: '',
    industry: 'Software / Technology',
    atsType: 'greenhouse',
    atsToken: '',
    url: ''
  });

  const handleToggle = (id) => {
    const updated = toggleEmployerFeedActive(id);
    setFeeds(updated);
    if (onFeedsUpdated) onFeedsUpdated();
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this employer feed from your tracking list?')) {
      const updated = deleteEmployerFeed(id);
      setFeeds(updated);
      if (onFeedsUpdated) onFeedsUpdated();
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newFeed.name) return;
    const updated = addCustomEmployerFeed(newFeed);
    setFeeds(updated);
    setShowAddModal(false);
    setNewFeed({ name: '', industry: 'Software / Technology', atsType: 'greenhouse', atsToken: '', url: '' });
    if (onFeedsUpdated) onFeedsUpdated();
  };

  const activeCount = feeds.filter(f => f.active).length;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} color="var(--accent-purple)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Custom Employer Feeds & Target ATS Trackers</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Monitoring openings directly from {activeCount} target companies (Greenhouse, Lever, Ashby, Workday)
            </p>
          </div>
        </div>

        <button className="btn-secondary" onClick={() => setShowAddModal(true)} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
          <Plus size={15} /> Track New Employer
        </button>
      </div>

      {/* Grid of Employer Feeds */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {feeds.map(feed => (
          <div 
            key={feed.id} 
            style={{
              background: feed.active ? 'rgba(15, 23, 42, 0.7)' : 'rgba(15, 23, 42, 0.3)',
              border: feed.active ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--glass-border)',
              opacity: feed.active ? 1 : 0.6,
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <img src={feed.logo} alt={feed.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {feed.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {feed.atsType.toUpperCase()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={() => handleToggle(feed.id)}
                style={{
                  background: feed.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  color: feed.active ? '#6ee7b7' : 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  cursor: 'pointer'
                }}
                title={feed.active ? 'Active' : 'Disabled'}
              >
                <Power size={14} />
              </button>
              {feed.id.startsWith('custom-') && (
                <button onClick={() => handleDelete(feed.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Employer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Track Custom Employer Feed</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company / Employer Name *</label>
                <input required type="text" className="input-field" placeholder="e.g. Anthropic, Cloudflare, Linear" value={newFeed.name} onChange={e => setNewFeed({...newFeed, name: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Industry Domain</label>
                <input type="text" className="input-field" placeholder="e.g. FinTech, Artificial Intelligence, E-Commerce" value={newFeed.industry} onChange={e => setNewFeed({...newFeed, industry: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS Platform Type</label>
                <select className="input-field" value={newFeed.atsType} onChange={e => setNewFeed({...newFeed, atsType: e.target.value})}>
                  <option value="greenhouse">Greenhouse (boards-api.greenhouse.io)</option>
                  <option value="lever">Lever (api.lever.co)</option>
                  <option value="ashby">Ashby ATS</option>
                  <option value="custom">Custom Careers Page URL</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS Board Token / Careers Page URL</label>
                <input type="text" className="input-field" placeholder="e.g. stripe or https://company.com/careers" value={newFeed.atsToken || newFeed.url} onChange={e => setNewFeed({...newFeed, atsToken: e.target.value, url: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Plus size={16} /> Save Employer Tracker
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
