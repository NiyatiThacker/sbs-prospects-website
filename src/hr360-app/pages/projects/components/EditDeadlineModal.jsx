import React, { useState, useEffect } from 'react';

export default function EditDeadlineModal({ isOpen, onClose, onSave, project }) {
  const [newDeadline, setNewDeadline] = useState('');
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    if (isOpen && project) {
      // pre-fill with existing deadline without time zone offset if needed, or leave blank to force selection
      setNewDeadline('');
      setReason('');
    }
  }, [isOpen, project]);
  
  if (!isOpen || !project) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDeadline) return;
    onSave(project.id, new Date(newDeadline).toISOString(), reason);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg)', padding: '24px', borderRadius: '12px',
        width: '100%', maxWidth: '500px', border: '1px solid var(--color-border)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Edit Deadline</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Project: <strong>{project.name}</strong>
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>New Deadline</label>
            <input 
              type="datetime-local" 
              value={newDeadline} 
              onChange={e => setNewDeadline(e.target.value)} 
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Reason for Extension</label>
            <textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              placeholder="e.g., Scope increased, Employee sick"
              required
              rows={3}
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)', resize: 'vertical', fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--color-border)',
                backgroundColor: 'transparent', color: 'var(--color-text)', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                padding: '10px 16px', borderRadius: '6px', border: 'none',
                backgroundColor: 'var(--color-brand)', color: 'white', cursor: 'pointer'
              }}
            >
              Extend Deadline
            </button>
          </div>
        </form>

        {project.extension_requests && project.extension_requests.length > 0 && (
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#D97706', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Pending Extension Requests
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {project.extension_requests.map((req, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: 'rgba(217, 119, 6, 0.05)', border: '1px solid rgba(217, 119, 6, 0.2)', borderRadius: '6px', fontSize: '13px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Requested Deadline:</strong> {new Date(req.requestedDeadline).toLocaleString()}
                  </div>
                  <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    <strong>Reason:</strong> {req.reason}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        // Pre-fill the form and submit immediately
                        const formattedDate = new Date(req.requestedDeadline).toISOString();
                        onSave(project.id, formattedDate, req.reason);
                        onClose();
                      }}
                      style={{
                        padding: '6px 12px', borderRadius: '4px', border: 'none',
                        backgroundColor: '#D97706', color: 'white', cursor: 'pointer', fontSize: '12px'
                      }}
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.extensions && project.extensions.length > 0 && (
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Extension History</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              paddingRight: '8px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: 'rgba(0,0,0,0.02)'
            }}>
              {project.extensions.map((ext, idx) => (
                <div key={idx} style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--color-bg)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px', 
                  fontSize: '13px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Old:</strong> {new Date(ext.previousDeadline).toLocaleString()}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>New:</strong> {new Date(ext.newDeadline).toLocaleString()}
                  </div>
                  <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    <strong>Reason:</strong> {ext.reason}
                  </div>
                  <div style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                    Extended on {new Date(ext.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
