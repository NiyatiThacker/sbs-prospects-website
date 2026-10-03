import React, { useState, useEffect } from 'react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import Button from '@/hr360-app/components/shared/ui/Button';
import { Send, Users, User, LayoutGrid, Trash2, Clock, Globe } from 'lucide-react';
import { supabase } from '@/hr360-app/services/supabaseClient';
import { DEPARTMENTS } from '@/hr360-app/utils/constants';
import toast from 'react-hot-toast';
import { getEmployees } from '@/hr360-app/services/employeeService';

export default function BroadcastsPage() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [audienceType, setAudienceType] = useState('all'); // all, dept, individual
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [selectedEmps, setSelectedEmps] = useState([]); // array of employee IDs
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .like('title', '[broadcast:%')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch broadcast history", err);
    }
  };

  useEffect(() => {
    getEmployees().then(data => setEmployees(data));
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter a title and message');
      return;
    }

    if (audienceType === 'individual' && selectedEmps.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    setIsSending(true);
    let broadcastType = 'broadcast:all';
    
    if (audienceType === 'dept') {
      broadcastType = `broadcast:dept:\${selectedDept}`;
    } else if (audienceType === 'individual') {
      broadcastType = `broadcast:emp:\${selectedEmps.join(',')}`;
    }

    try {
      const { error } = await supabase.from('notifications').insert({
        type: 'info',
        title: `[${broadcastType}] ${title.trim()}`,
        message: message.trim()
      });

      if (error) throw error;
      toast.success('Broadcast sent successfully!');
      setTitle('');
      setMessage('');
      setSelectedEmps([]);
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const toggleEmp = (id) => {
    setSelectedEmps(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <PageContainer title="Send Broadcast">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Send Notification to Agent App</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Send an instant toast notification to employees' desktop agent applications.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Audience Type Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Target Audience</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setAudienceType('all')}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', background: audienceType === 'all' ? 'var(--color-brand-muted)' : 'transparent', color: audienceType === 'all' ? 'var(--color-brand)' : 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} /> Everyone
                </button>
                <button 
                  onClick={() => setAudienceType('dept')}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', background: audienceType === 'dept' ? 'var(--color-brand-muted)' : 'transparent', color: audienceType === 'dept' ? 'var(--color-brand)' : 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutGrid size={16} /> By Department
                </button>
                <button 
                  onClick={() => setAudienceType('individual')}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', background: audienceType === 'individual' ? 'var(--color-brand-muted)' : 'transparent', color: audienceType === 'individual' ? 'var(--color-brand)' : 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} /> Specific Employees
                </button>
              </div>
            </div>

            {/* Conditional Selections */}
            {audienceType === 'dept' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Select Department</label>
                <select 
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {audienceType === 'individual' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Select Employees ({selectedEmps.length} selected)</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px' }}>
                  {employees.map(emp => (
                    <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedEmps.includes(emp.id)}
                        onChange={() => toggleEmp(emp.id)}
                        style={{ accentColor: 'var(--color-brand)' }}
                      />
                      <span>{emp.name} ({emp.department})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <hr style={{ borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />

            {/* Message Details */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Notification Title</label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Urgent Update, Townhall Meeting"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Message</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button onClick={handleSend} disabled={isSending} icon={<Send size={16} />}>
                {isSending ? 'Sending...' : 'Send Broadcast'}
              </Button>
            </div>
          </div>
        </Card>

        {/* History Section */}
        <div style={{ marginTop: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Clock size={20} color="var(--color-brand)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Broadcast History</h2>
            </div>
            
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-secondary)' }}>
                No broadcasts sent yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map(item => {
                  const match = item.title.match(/^\[(broadcast:[^\]]+)\]\s*(.*)$/);
                  const typeStr = match ? match[1] : '';
                  const actualTitle = match ? match[2] : item.title;
                  
                  let badgeText = "Unknown";
                  let BadgeIcon = Globe;
                  
                  if (typeStr === 'broadcast:all') {
                    badgeText = "Everyone";
                    BadgeIcon = Users;
                  } else if (typeStr.startsWith('broadcast:dept:')) {
                    badgeText = `Dept: ${typeStr.split(':')[2]}`;
                    BadgeIcon = LayoutGrid;
                  } else if (typeStr.startsWith('broadcast:emp:')) {
                    const ids = typeStr.split(':')[2].split(',');
                    const names = ids.map(id => {
                      const emp = employees.find(e => e.id.toLowerCase() === id.trim().toLowerCase());
                      return emp ? emp.name.split(' ')[0] : 'Unknown';
                    }).join(', ');
                    badgeText = `Employees: ${names}`;
                    BadgeIcon = User;
                  }

                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: 'var(--color-brand-muted)', color: 'var(--color-brand)' }}>
                            <BadgeIcon size={12} /> {badgeText}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>{actualTitle}</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                          {item.message}
                        </p>
                      </div>
                      
                      <button 
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to delete this broadcast? It will be removed from all agent apps immediately.")) return;
                          try {
                            await supabase.from('notifications').delete().eq('id', item.id);
                            fetchHistory();
                            toast.success('Broadcast deleted');
                          } catch (err) {
                            toast.error('Failed to delete');
                          }
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '8px', opacity: 0.7, transition: 'opacity 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                        title="Delete Broadcast"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
