import { useState, useEffect } from 'react';
import { Save, Clock, AppWindow, Bell, Shield, UserMinus, Trash, Database, Download, AlertTriangle, } from 'lucide-react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import Button from '@/hr360-app/components/shared/ui/Button';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import { SkeletonCard } from '@/hr360-app/components/shared/ui/Skeleton';
import { DEPARTMENTS } from '@/hr360-app/utils/constants';
import { getSettings, updateSettings, getDepartmentSettings, updateDepartmentSetting } from '@/hr360-app/services/settingsService';
import { getAdmins, updateEmployee, deleteEmployee } from '@/hr360-app/services/employeeService';
import toast from 'react-hot-toast';
import { supabase } from '@/hr360-app/services/supabaseClient';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [departmentSettings, setDepartmentSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hours');
  const [searchCategory, setSearchCategory] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exportDepartment, setExportDepartment] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('productive');

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

  
  const handleExport7DaySummary = async () => {
    setIsSubmitting(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const dateStr = sevenDaysAgo.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

      // 1. Fetch all matching employees
      let empQuery = supabase.from('employees').select('id, name, department').neq('role', 'Admin');
      if (exportDepartment) {
        empQuery = empQuery.eq('department', exportDepartment);
      }
      const { data: employees, error: empError } = await empQuery;
      if (empError) throw empError;

      if (!employees || employees.length === 0) {
        toast.error("No employees found for this department.");
        setIsSubmitting(false);
        return;
      }

      // 2. Fetch attendance records for the last 7 days
      const { data: records, error: recError } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('date', dateStr);
      
      if (recError) throw recError;

      // 3. Format as CSV
      let csvContent = "Employee,Department,Days Present,Days Late,Days Absent,Total Hours\n";

      const computeMins = (checkIn, checkOut, dateStr) => {
         if (!checkIn || !checkOut) return 0;
         try {
           const t1 = new Date(`${dateStr}T${checkIn}Z`).getTime();
           const t2 = new Date(`${dateStr}T${checkOut}Z`).getTime();
           const diffMins = (t2 - t1) / 60000;
           return diffMins > 0 ? diffMins : 0;
         } catch(e) { return 0; }
      };

      const summaryMap = {};
      
      // Initialize map with ALL valid employees so nobody is missing
      employees.forEach(emp => {
         summaryMap[emp.id] = { name: emp.name, dept: emp.department, present: 0, late: 0, absent: 0, totalMins: 0, recordsFound: 0 };
      });

      if (records) {
        records.forEach(r => {
          const empStat = summaryMap[r.employee_id];
          if (!empStat) return; // Ignore if they don't match the department filter
          
          empStat.recordsFound += 1;
          const mins = computeMins(r.check_in, r.check_out, r.date);
          empStat.totalMins += mins;
          
          if (r.status === 'present' || r.status === 'wfh' || r.status === 'half_day') {
            empStat.present += 1;
          } else if (r.status === 'late') {
            empStat.late += 1;
          } else if (r.status === 'absent') {
            empStat.absent += 1;
          }
        });
      }

      let workingDaysCount = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const day = d.getDay();
        if (day !== 0 && day !== 6) workingDaysCount++;
      }

      Object.values(summaryMap).sort((a,b) => a.name.localeCompare(b.name)).forEach(s => {
        const missingDays = workingDaysCount - s.recordsFound;
        if (missingDays > 0) {
           s.absent += missingDays;
        }
        const h = Math.floor(s.totalMins / 60);
        const m = Math.round(s.totalMins % 60);
        const hoursStr = `${h}h ${m}m`;
        csvContent += `${s.name},${s.dept},${s.present},${s.late},${s.absent},${hoursStr}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "7_Day_Attendance_Summary.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Summary exported successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export summary: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurgeLogs = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete all raw screen time logs older than 7 days? This action CANNOT be undone.")) return;
    
    setIsSubmitting(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const isoString = sevenDaysAgo.toISOString();

      const { error } = await supabase
        .from('screentime_raw_logs')
        .delete()
        .lt('timestamp', isoString);

      if (error) throw error;
      toast.success("Old raw logs purged successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to purge logs: " + e.message);
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
    { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
    { id: 'tracking', label: 'Tracking Config', icon: <AppWindow size={18} /> },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        {/* Settings nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '10px 16px', borderRadius: '40px', width: 'auto', minWidth: '150px',
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
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', padding: '16px', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>App or Window Title Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Figma, GitHub, Netflix..."
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Category</label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  >
                    <option value="productive">Productive</option>
                    <option value="neutral">Neutral</option>
                    <option value="distracting">Distracting</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button
                    variant="primary"
                    onClick={async () => {
                      if (!newAppName.trim()) return;
                      const { error } = await supabase.from('app_classifications').insert({
                        process_name: newAppName.trim(),
                        display_name: newAppName.trim(),
                        category: newAppCategory
                      });
                      if (error) {
                        toast.error("Failed to add application");
                      } else {
                        toast.success("Application added successfully");
                        setNewAppName('');
                        // Reload settings to show the new app
                        const fresh = await getSettings();
                        setSettings(fresh);
                      }
                    }}
                  >
                    + Add App
                  </Button>
                </div>
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

          {activeSection === 'tracking' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Desktop Tracking Policy</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Select which departments should have their active windows and screen time tracked by the Desktop Agent. 
                Departments not selected will only have their Check-In and Check-Out times logged.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DEPARTMENTS.map(dept => {
                  const isTracked = settings?.trackedDepartments?.includes(dept);
                  return (
                    <label key={dept} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={!!isTracked}
                        onChange={(e) => {
                          const newTracked = e.target.checked 
                            ? [...(settings.trackedDepartments || []), dept] 
                            : (settings.trackedDepartments || []).filter(d => d !== dept);
                          setSettings({ ...settings, trackedDepartments: newTracked });
                        }}
                      />
                      <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{dept}</span>
                    </label>
                  );
                })}
              </div>
            </Card>
          )}
          
          
          {activeSection === 'tracking' && (
            <Card title="Department Tracking Config">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Configure which departments are actively monitored by the Desktop Agent.
                  If tracking is disabled for a department, the agent will gracefully skip starting the monitoring loop for those employees upon login.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {DEPARTMENTS.map(dept => {
                    const ds = departmentSettings.find(d => d.department_name === dept);
                    const isEnabled = ds ? ds.is_tracking_enabled : true;

                    return (
                      <div key={dept} style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)'
                      }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{dept}</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            {isEnabled ? 'Tracking is currently active for this department.' : 'Tracking is disabled. Employees will not be monitored.'}
                          </p>
                        </div>
                        
                        <Button 
                          variant={isEnabled ? 'danger' : 'primary'}
                          onClick={async () => {
                            const newStatus = !isEnabled;
                            const success = await updateDepartmentSetting(dept, newStatus);
                            if (success) {
                              setDepartmentSettings(prev => {
                                const exists = prev.find(p => p.department_name === dept);
                                if (exists) {
                                  return prev.map(p => p.department_name === dept ? { ...p, is_tracking_enabled: newStatus } : p);
                                } else {
                                  return [...prev, { department_name: dept, is_tracking_enabled: newStatus }];
                                }
                              });
                              toast.success(`Tracking ${newStatus ? 'enabled' : 'disabled'} for ${dept}`);
                            } else {
                              toast.error('Failed to update tracking setting');
                            }
                          }}
                        >
                          {isEnabled ? <>Disable Tracking</> : <>Enable Tracking</>}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'data' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} color="var(--color-brand)" /> Data Management
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Manage your database storage. It is highly recommended to purge raw screen time logs older than 7 days to prevent database bloat and keep the system lightning fast.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text-primary)' }}>1. Export 7-Day Summary</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Download a CSV summary of all attendance and hours worked in the last 7 days. Do this before purging.</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                      value={exportDepartment}
                      onChange={(e) => setExportDepartment(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        fontSize: '13px',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <Button 
                      variant="secondary" 
                      disabled={isSubmitting} 
                      onClick={handleExport7DaySummary}
                      style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                    >
                      <Download size={16} /> Export CSV
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.02)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> 2. Purge Old Raw Logs
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Permanently delete all raw window tracking data older than 7 days. This will NOT delete attendance summaries.</div>
                  </div>
                  <Button 
                    variant="danger" 
                    disabled={isSubmitting} 
                    onClick={handlePurgeLogs}
                    style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <Trash size={16} /> Purge Now
                  </Button>
                </div>

              </div>
            </Card>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
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
