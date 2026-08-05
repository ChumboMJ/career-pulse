import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { 
  getWorkSearchLogs, 
  saveWorkSearchLog, 
  deleteWorkSearchLog, 
  getLogsGroupedByWeek, 
  exportLogsToCSV 
} from '../services/unemploymentLogger.js';

export default function UnemploymentLog() {
  const [logs, setLogs] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New manual entry state
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    dateApplied: new Date().toISOString().split('T')[0],
    location: 'Remote',
    applicationMethod: 'Online Job Board',
    contactPerson: 'Hiring Manager',
    contactInfo: 'Careers Page / Email',
    confirmationNum: `CONF-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Applied',
    notes: 'Submitted resume and application.'
  });

  useEffect(() => {
    setLogs(getWorkSearchLogs());
  }, []);

  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle) return;
    const updated = saveWorkSearchLog(formData);
    setLogs(updated);
    setShowAddForm(false);
    setFormData({
      companyName: '',
      jobTitle: '',
      dateApplied: new Date().toISOString().split('T')[0],
      location: 'Remote',
      applicationMethod: 'Online Job Board',
      contactPerson: 'Hiring Manager',
      contactInfo: 'Careers Page / Email',
      confirmationNum: `CONF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Applied',
      notes: 'Submitted resume and application.'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this work search record from your audit log?')) {
      const updated = deleteWorkSearchLog(id);
      setLogs(updated);
    }
  };

  const grouped = getLogsGroupedByWeek(logs);
  const weekOptions = Object.keys(grouped).sort().reverse();

  const filteredLogs = selectedWeek === 'ALL' 
    ? logs 
    : logs.filter(l => l.weeklyBenefitPeriod === selectedWeek);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {/* Top Header Card */}
      <div className="glass-panel printable-area" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={22} color="var(--accent-emerald)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Unemployment Work Search Audit Log</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
              Official record of job contacts, applications, and verification details for weekly benefit claims.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }} className="no-print">
            <button className="btn-secondary" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> Log Manual Job Search
            </button>
            <button className="btn-secondary" onClick={() => exportLogsToCSV(filteredLogs)}>
              <FileSpreadsheet size={16} color="#6ee7b7" /> Export CSV Spreadsheet
            </button>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Print Official Audit Report
            </button>
          </div>
        </div>

        {/* Benefit Week Filter & Summary Banner */}
        <div style={{ 
          marginTop: '20px', 
          padding: '14px 18px', 
          background: 'rgba(15, 23, 42, 0.6)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={18} color="var(--accent-indigo)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Benefit Claim Period:</span>
            <select 
              className="input-field no-print" 
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option value="ALL">All Benefit Periods ({logs.length} Total Contacts)</option>
              {weekOptions.map(w => (
                <option key={w} value={w}>Week Ending {w} ({grouped[w].length} Activities)</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Logged Activities: <span style={{ color: 'var(--accent-emerald)' }}>{filteredLogs.length} Applications</span>
          </div>
        </div>
      </div>

      {/* Manual Entry Form Modal / Slide down */}
      {showAddForm && (
        <div className="glass-panel no-print" style={{ padding: '24px', border: '1px solid var(--accent-indigo)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add Manual Work Search Contact</h3>
          <form onSubmit={handleSaveManual} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company Name *</label>
              <input required type="text" className="input-field" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Job Title *</label>
              <input required type="text" className="input-field" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date Applied</label>
              <input type="date" className="input-field" value={formData.dateApplied} onChange={e => setFormData({...formData, dateApplied: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Application Method</label>
              <input type="text" className="input-field" value={formData.applicationMethod} onChange={e => setFormData({...formData, applicationMethod: e.target.value})} placeholder="e.g. LinkedIn / Company Portal" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Person / Email</label>
              <input type="text" className="input-field" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmation # / URL</label>
              <input type="text" className="input-field" value={formData.confirmationNum} onChange={e => setFormData({...formData, confirmationNum: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary"><CheckCircle2 size={16} /> Save Record</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Main Audit Log Table */}
      <div className="glass-panel printable-area" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className="audit-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Employer / Company</th>
              <th style={{ padding: '12px' }}>Job Position</th>
              <th style={{ padding: '12px' }}>Method of Contact</th>
              <th style={{ padding: '12px' }}>Confirmation / Contact Info</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }} className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No work search activities logged for this period yet.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{log.dateApplied}</td>
                  <td style={{ padding: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{log.companyName}</td>
                  <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{log.jobTitle}</td>
                  <td style={{ padding: '12px' }}>{log.applicationMethod}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    <div>{log.contactPerson}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.confirmationNum}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-emerald">{log.status}</span>
                  </td>
                  <td style={{ padding: '12px' }} className="no-print">
                    <button 
                      onClick={() => handleDelete(log.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
