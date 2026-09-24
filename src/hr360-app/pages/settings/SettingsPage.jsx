import { useState, useEffect } from 'react';
import { Save, Clock, AppWindow, Bell, Shield, UserMinus, Trash } from 'lucide-react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import Button from '@/hr360-app/components/shared/ui/Button';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import { SkeletonCard } from '@/hr360-app/components/shared/ui/Skeleton';
import { DEPARTMENTS } from '@/hr360-app/utils/constants';
import { getSettings, updateSettings } from '@/hr360-app/services/settingsService';
import { getAdmins, updateEmployee, deleteEmployee } from '@/hr360-app/services/employeeService';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hours');
  const [searchCategory, setSearchCategory] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setSettings(data);
      setIsLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (activeSection === 'admins') {
      loadAdmins();
    }
  }, [activeSection]);

  const loadAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (e) {
      toast.error('Failed to load admins');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const handleDemoteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to demote this Admin to a regular Employee?")) return;
    setIsSubmitting(true);
    try {
      await updateEmployee(id, { role: 'Employee' });
      toast.success("Admin demoted successfully");
      loadAdmins();
    } catch (e) {
      toast.error(e.message || "Failed to demote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this Administrator account? This cannot be undone.")) return;
    setIsSubmitting(true);
    try {
      await deleteEmployee(id);
      toast.success("Admin deleted permanently");
      loadAdmins();
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) return <PageContainer><div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></PageContainer>;

  const sections = [
    { id: 'hours', label: 'Allotted Hours', icon: <Clock size={18} /> },
    { id: 'categories', label: 'App Categories', icon: <AppWindow size={18} /> },
    { id: 'alerts', label: 'Alert Thresholds', icon: <Bell size={18} /> },
    { id: 'admins', label: 'Admin Accounts', icon: <Shield size={18} /> },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Settings nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '40px', width: '180px',
                  background: activeSection === s.id ? 'var(--color-brand)' : 'var(--color-surface)',
                  color: activeSection === s.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: activeSection === s.id ? '1px solid var(--color-brand)' : '1px solid var(--color-border)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  fontSize: '14px', fontWeight: 500,
                  transition: 'all 0.2s',
                  boxShadow: activeSection === s.id ? '0 4px 14px rgba(0,180,216,0.3)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
        </div>

        {/* Settings content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeSection === 'hours' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Allotted Hours Configuration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Default Daily Hours</label>
                  <input
                    type="number"
                    value={settings.allottedHours.default}
                    onChange={(e) => setSettings({
                      ...settings,
                      allottedHours: { ...settings.allottedHours, default: Number(e.target.value) },
                    })}
                    style={inputStyle}
                    min={1} max={24}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Department Overrides</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {settings.allottedHours.overrides.map((override, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                          value={override.department}
                          onChange={(e) => {
                            const updated = [...settings.allottedHours.overrides];
                            updated[i] = { ...override, department: e.target.value };
                            setSettings({ ...settings, allottedHours: { ...settings.allottedHours, overrides: updated } });
                          }}
                          style={{ ...inputStyle, flex: 1 }}
                        >
                          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <input
                          type="number"
                          value={override.hours}
                          onChange={(e) => {
                            const updated = [...settings.allottedHours.overrides];
                            updated[i] = { ...override, hours: Number(e.target.value) };
                            setSettings({ ...settings, allottedHours: { ...settings.allottedHours, overrides: updated } });
                          }}
                          style={{ ...inputStyle, width: '80px' }}
                          min={1} max={24}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginRight: '8px' }}>hrs</span>
                        <button
                          onClick={() => {
                            const updated = settings.allottedHours.overrides.filter((_, idx) => idx !== i);
                            setSettings({ ...settings, allottedHours: { ...settings.allottedHours, overrides: updated } });
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                    {settings.allottedHours.overrides.length < DEPARTMENTS.length && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          // Find a department not currently in the overrides list
                          const usedDepts = settings.allottedHours.overrides.map(o => o.department);
                          const availableDept = DEPARTMENTS.find(d => !usedDepts.includes(d)) || DEPARTMENTS[0];
                          
                          setSettings({
                            ...settings,
                            allottedHours: {
                              ...settings.allottedHours,
                              overrides: [...settings.allottedHours.overrides, { department: availableDept, hours: 8 }]
                            }
                          });
                        }}
                        style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                      >
                        + Add Department
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'categories' && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>App Category Mapping</h3>
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  style={{ ...inputStyle, width: '250px', padding: '8px 12px' }}
                />
              </div>
              <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                {settings.appCategories
                  .filter(item => item.app.toLowerCase().includes(searchCategory.toLowerCase()))
                  .map((item, i) => (
                  <div key={item.app + '-' + i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{item.app}</span>
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const updated = settings.appCategories.map(cat => 
                          cat.app === item.app ? { ...cat, category: e.target.value } : cat
                        );
                        setSettings({ ...settings, appCategories: updated });
                      }}
                      style={{
                        padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)', fontSize: '13px',
                        fontFamily: 'var(--font-sans)', background: 'var(--color-surface)',
                        width: '130px', flexShrink: 0
                      }}
                    >
                      <option value="productive">Productive</option>
                      <option value="neutral">Neutral</option>
                      <option value="distracting">Distracting</option>
                    </select>
                    <StatusBadge 
                      status={item.category} 
                      size="sm" 
                      style={{ width: '100px', justifyContent: 'center', flexShrink: 0 }} 
                    />
                  </div>
                ))}
                
                {settings.appCategories.filter(item => item.app.toLowerCase().includes(searchCategory.toLowerCase())).length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    No applications match your search.
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeSection === 'alerts' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Alert Thresholds</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Low Productivity Warning Threshold (%)</label>
                  <input
                    type="number"
                    value={settings.alertThresholds.lowUtilization}
                    onChange={(e) => setSettings({
                      ...settings,
                      alertThresholds: { ...settings.alertThresholds, lowUtilization: Number(e.target.value) },
                    })}
                    style={inputStyle}
                    min={0} max={100}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Critical Productivity Alert Threshold (%)</label>
                  <input
                    type="number"
                    value={settings.alertThresholds.criticalUtilization}
                    onChange={(e) => setSettings({
                      ...settings,
                      alertThresholds: { ...settings.alertThresholds, criticalUtilization: Number(e.target.value) },
                    })}
                    style={inputStyle}
                    min={0} max={100}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Consecutive Days of Low Productivity Before Alert</label>
                  <input
                    type="number"
                    value={settings.alertThresholds.consecutiveDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      alertThresholds: { ...settings.alertThresholds, consecutiveDays: Number(e.target.value) },
                    })}
                    style={inputStyle}
                    min={1} max={30}
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'admins' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Administrator Accounts</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Admins are excluded from all productivity tracking. You can demote them to standard employees if you want them tracked in the main directory.
              </p>
              
              {isLoadingAdmins ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>
              ) : admins.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  No administrators found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {admins.map(admin => (
                    <div key={admin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-primary)' }}>{admin.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{admin.email} • {admin.department}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          disabled={isSubmitting} 
                          onClick={() => handleDemoteAdmin(admin.id)}
                          style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 10px' }}
                        >
                          <UserMinus size={14} /> Demote
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          disabled={isSubmitting} 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 10px' }}
                        >
                          <Trash size={14} /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSave} icon={<Save size={16} />}>Save Settings</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

const labelStyle = {
  fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)',
  display: 'block', marginBottom: '6px',
};

const inputStyle = {
  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)', background: 'var(--color-surface)',
  fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
  width: '100%',
};
