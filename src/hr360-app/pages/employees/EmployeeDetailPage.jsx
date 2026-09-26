import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Calendar, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import Avatar from '@/hr360-app/components/shared/ui/Avatar';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import ProgressBar from '@/hr360-app/components/shared/ui/ProgressBar';
import Button from '@/hr360-app/components/shared/ui/Button';
import EmptyState from '@/hr360-app/components/shared/ui/EmptyState';
import DataTable from '@/hr360-app/components/shared/ui/DataTable';
import { SkeletonDashboard } from '@/hr360-app/components/shared/ui/Skeleton';
import { formatHours, formatDuration, formatTimeAgo } from '@/hr360-app/utils/formatters';
import { getScoreLabel, getScoreStatus } from '@/hr360-app/utils/productivityScore';
import { APP_CATEGORY_COLORS } from '@/hr360-app/utils/constants';
import { getEmployeeById, uploadEmployeeDocument, updateEmployee } from '@/hr360-app/services/employeeService';
import { getProjects } from '@/hr360-app/services/projectsService';
import { getNotifications, markAsRead } from '@/hr360-app/services/notificationsService';
import { getLeaveRequests } from '@/hr360-app/services/leaveService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartTooltip from '@/hr360-app/components/shared/charts/ChartTooltip';
import { AXIS_STYLE, GRID_STYLE, CHART_COLORS } from '@/hr360-app/components/shared/charts/chartTheme';
import toast from 'react-hot-toast';

const HISTORY_COLUMNS = [
  {
    key: 'date',
    label: 'Date',
    render: (val) => {
      if (!val) return '—';
      try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return <span style={{ fontWeight: 500, fontFeatureSettings: '"tnum"' }}>{d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })}</span>;
      } catch {
        return val;
      }
    }
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'checkIn',
    label: 'Check In',
    render: (val) => <span style={{ fontFeatureSettings: '"tnum"' }}>{val || '—'}</span>,
  },
  {
    key: 'checkOut',
    label: 'Check Out',
    render: (val) => <span style={{ fontFeatureSettings: '"tnum"' }}>{val || '—'}</span>,
  },
  {
    key: 'hours',
    label: 'Screentime Hours',
    render: (val, record) => {
      if (record?.status === 'on_leave' || record?.status === 'half_day') {
        return <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Paused</span>;
      }
      return <span style={{ fontWeight: 600, color: (val || 0) > 0 ? 'var(--color-brand)' : 'var(--color-text-secondary)' }}>{val || 0} hrs</span>;
    },
  },
  {
    key: 'prodRatio',
    label: 'Productivity Ratio',
    render: (val, record) => {
      if (record?.status === 'on_leave' || record?.status === 'half_day' || record?.status === 'absent' || record?.status === 'holiday') {
        return <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Paused</span>;
      }
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={val || 0} max={100} height={6} status={(val || 0) >= 70 ? 'success' : (val || 0) >= 50 ? 'info' : 'warning'} animated={false} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 500, fontFeatureSettings: '"tnum"' }}>{val || 0}%</span>
        </div>
      );
    },
  },
];

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [employeeIssues, setEmployeeIssues] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [customDocs, setCustomDocs] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docCategory, setDocCategory] = useState('onboarding');
  const [docTitleInput, setDocTitleInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const [isEditingShift, setIsEditingShift] = useState(false);
  const [shiftStartInput, setShiftStartInput] = useState('');
  const [shiftEndInput, setShiftEndInput] = useState('');
  const [isSavingShift, setIsSavingShift] = useState(false);

  const handleSaveShift = async () => {
    setIsSavingShift(true);
    try {
      await updateEmployee(employee.id, { 
        expected_shift_start: shiftStartInput + ':00',
        expected_shift_end: shiftEndInput + ':00' 
      });
      setEmployee(prev => ({ 
        ...prev, 
        expected_shift_start: shiftStartInput + ':00',
        expected_shift_end: shiftEndInput + ':00' 
      }));
      setIsEditingShift(false);
      toast.success('Shift timings updated successfully');
    } catch (e) {
      toast.error('Failed to update shift timings');
    } finally {
      setIsSavingShift(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const base64Content = event.target.result;
      const cleanTitle = docTitleInput.trim() || selectedFile.name.replace(/\.[^/.]+$/, "");
      const ext = (selectedFile.name.split('.').pop() || 'FILE').toUpperCase();
      const newDateStr = `Uploaded on ${new Date().toLocaleDateString('en-IN', { timeZone: COMPANY_TIMEZONE, year: 'numeric', month: 'short', day: 'numeric' })}`;

      let dbSuccess = true;
      try {
        await uploadEmployeeDocument({
          employeeId: employee.id,
          title: cleanTitle,
          category: docCategory,
          fileName: selectedFile.name,
          fileType: ext,
          content: base64Content
        });
      } catch (err) {
        console.warn('Error syncing upload with database:', err);
        dbSuccess = false;
      }

      const newDoc = {
        id: Date.now().toString(),
        title: cleanTitle,
        category: docCategory,
        fileName: selectedFile.name,
        date: newDateStr,
        url: base64Content || URL.createObjectURL(selectedFile),
        type: ext,
      };

      setCustomDocs(prev => [newDoc, ...prev]);
      if (dbSuccess) {
        setUploadMessage('✓ Document successfully uploaded & synced to Supabase! The employee can now view and download this file directly in their HR360 Desktop Agent.');
      } else {
        setUploadMessage('⚠️ Saved locally in preview, but database sync failed: Please verify that you have run the employee_documents.sql script in your Supabase SQL Editor.');
      }
      setDocTitleInput('');
      setSelectedFile(null);
      setShowUploadModal(false);
      setTimeout(() => setUploadMessage(''), 10000);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleDownload = (docTitle, defaultContent = null, fileUrl = null) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = docTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const content = defaultContent || `=====================================================
HR360 ENTERPRISE PORTAL - OFFICIAL RECORD
=====================================================
Document Type  : ${docTitle}
Employee Name  : ${employee?.name || 'Valued Employee'}
Employee ID    : ${employee?.id || 'ID-0000'}
Designation    : Software Specialist & Team Contributor
Department     : Engineering & Technology
Generated Date : ${new Date().toLocaleDateString('en-IN', { timeZone: COMPANY_TIMEZONE, dateStyle: 'full' })}
=====================================================

CONFIDENTIALITY & OFFICIAL VERIFICATION:
This digital record certifies that ${employee?.name || 'the employee'} is registered and actively verified in the HR360 system.
All attendance tracking, productivity utilization ratios, salary computations, and organizational compliance records are securely maintained under enterprise HR360 management policies.

[Electronically Verified - HR360 Portal Authorization]`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/\s+/g, '_')}_${employee?.name?.replace(/\s+/g, '_') || 'Employee'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getEmployeeById(id);
        const projectsData = await getProjects(id);
        const notificationsData = await getNotifications();
        const leavesData = await getLeaveRequests();
        
        if (!cancelled) {
          setEmployee(data);
          setShiftStartInput(data.expected_shift_start ? data.expected_shift_start.substring(0, 5) : '09:00');
          setShiftEndInput(data.expected_shift_end ? data.expected_shift_end.substring(0, 5) : '18:00');
          setEmployeeProjects(projectsData || []);
          
          if (leavesData) {
            setEmployeeLeaves(leavesData.filter(l => String(l.employee_id) === String(id)));
          }
          
          if (data) {
            const issues = notificationsData.filter(n => 
              (n.title.includes('Issue Reported') || n.type === 'warning') && 
              (n.message.includes(`Employee ${data.name}`) || n.message.includes(`Employee ${data.id}`))
            );
            setEmployeeIssues(issues);
          }
          if (data && data.dbDocuments && data.dbDocuments.length > 0) {
            const mappedDocs = data.dbDocuments.map(d => ({
              id: d.id,
              title: d.title || d.file_name,
              category: d.category || 'onboarding',
              fileName: d.file_name,
              date: `Uploaded on ${new Date(d.created_at || Date.now()).toLocaleDateString('en-IN', { timeZone: COMPANY_TIMEZONE, year: 'numeric', month: 'short', day: 'numeric' })}`,
              url: d.content || null,
              type: (d.file_type || 'PDF').toUpperCase(),
            }));
            setCustomDocs(mappedDocs);
          }
        }
      } catch { /* handled by service */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) return <PageContainer><SkeletonDashboard /></PageContainer>;
  if (!employee) return <PageContainer><EmptyState title="Employee not found" actionLabel="Back to directory" onAction={() => navigate('/employees')} /></PageContainer>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'apps', label: 'App Usage' },
    { id: 'documents', label: 'Documents' },
    { id: 'history', label: 'History' },
    { id: 'leaves', label: 'Leave History' },
    { id: 'projects', label: 'Projects & Tasks' },
    { id: 'issues', label: 'Reported Issues' },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/employees')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: 'var(--color-text-secondary)',
            cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to directory
        </button>

        {/* Profile header */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Avatar name={employee.name} size={64} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: 600 }}>{employee.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '2px' }}>
                {employee.role} · {employee.department}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <StatusBadge status={employee.status} />
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>
                  Shift Timings:
                </span>
                {isEditingShift ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input 
                      type="time" 
                      value={shiftStartInput} 
                      onChange={e => setShiftStartInput(e.target.value)} 
                      style={{ padding: '2px 6px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>to</span>
                    <input 
                      type="time" 
                      value={shiftEndInput} 
                      onChange={e => setShiftEndInput(e.target.value)} 
                      style={{ padding: '2px 6px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                    />
                    <Button size="sm" onClick={handleSaveShift} disabled={isSavingShift} style={{ padding: '2px 8px', height: '24px' }}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingShift(false)} style={{ padding: '2px 8px', height: '24px' }}>Cancel</Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>
                      {employee.expected_shift_start ? employee.expected_shift_start.substring(0, 5) : '09:00'} - {employee.expected_shift_end ? employee.expected_shift_end.substring(0, 5) : '18:00'}
                    </span>
                    <button onClick={() => setIsEditingShift(true)} style={{ background: 'none', border: 'none', color: 'var(--color-brand)', cursor: 'pointer', fontSize: '12px' }}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Productivity Score</div>
              <div style={{
                fontSize: '32px', fontWeight: 700, fontFeatureSettings: '"tnum"',
                color: `var(--color-${getScoreStatus(employee.score)})`,
              }}>
                {employee.score}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{getScoreLabel(employee.score)}</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--color-border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-brand)' : '2px solid transparent',
                marginBottom: '-2px',
                color: activeTab === tab.id ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '14px', fontFamily: 'var(--font-sans)',
                cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Hours this week */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Hours This Week</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {formatHours(employee.hoursWorked)} / {formatHours(employee.hoursAllotted)}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {((employee.hoursWorked / employee.hoursAllotted) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={employee.hoursWorked} max={employee.hoursAllotted} height={10} />
              <ResponsiveContainer width="100%" height={180} style={{ marginTop: '20px' }}>
                <BarChart data={employee.weeklyHours} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis dataKey="day" {...AXIS_STYLE} />
                  <YAxis domain={[0, 10]} {...AXIS_STYLE} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="hours" name="Hours" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Attendance summary */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Attendance (This Month)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Present', value: employee.attendanceSummary.present, color: 'var(--color-success)' },
                  { label: 'Late', value: employee.attendanceSummary.late, color: 'var(--color-warning)' },
                  { label: 'Absent', value: employee.attendanceSummary.absent, color: 'var(--color-danger)' },
                  { label: 'WFH', value: employee.attendanceSummary.wfh, color: 'var(--color-info)' },
                  { label: 'On Leave', value: employee.attendanceSummary.onLeave, color: 'var(--color-neutral)' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                      {item.value} day{item.value !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Daily Application Usage */}
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Daily Application Usage</h3>
              {(!employee.dailyApps || employee.dailyApps.length === 0) ? (
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', padding: '16px 0', textAlign: 'center' }}>
                  No application activity logged today
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {employee.dailyApps.map(item => (
                    <div key={item.app}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
                          {item.app}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFeatureSettings: '"tnum"' }}>
                          {formatDuration(item.minutes)} ({item.percentage}%)
                        </span>
                      </div>
                      <ProgressBar 
                        value={item.percentage} 
                        max={100} 
                        height={6} 
                        status={item.category === 'productive' ? 'success' : item.category === 'neutral' ? 'info' : 'warning'} 
                        animated={false} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'apps' && (
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>All Tracked Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
              {employee.topApps.map(app => (
                <div key={app.app} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '100px', fontSize: '13px', fontWeight: 500 }}>{app.app}</span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={app.minutes}
                      max={employee.topApps[0].minutes}
                      status={app.category === 'productive' ? 'success' : app.category === 'neutral' ? 'info' : 'warning'}
                      height={8}
                      animated={false}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '50px', textAlign: 'right' }}>
                    {formatDuration(app.minutes)}
                  </span>
                  <StatusBadge status={app.category} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {uploadMessage && (
              <div style={{ padding: '12px 16px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 500 }}>
                {uploadMessage}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Manage and download employee files securely. Uploaded files sync directly with the employee's HR360 Desktop Agent.</p>
              <Button size="sm" onClick={() => setShowUploadModal(!showUploadModal)}>
                <Upload size={16} style={{ marginRight: '6px' }} /> {showUploadModal ? 'Cancel Upload' : 'Upload Document'}
              </Button>
            </div>
            
            {showUploadModal && (
              <Card style={{ background: 'var(--color-bg)', border: '1px dashed var(--color-brand)', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text)' }}>Upload New Employee Document</h3>
                <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Document Category</label>
                      <select 
                        value={docCategory} 
                        onChange={(e) => setDocCategory(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '13px' }}
                      >
                        <option value="onboarding">Onboarding / Offer Letter</option>
                        <option value="payroll">Payroll / Salary Slip</option>
                        <option value="other">Other HR Document</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Document Title (e.g. Revised Offer Letter, June 2026 Salary Slip)</label>
                      <input 
                        type="text"
                        placeholder="Enter title or leave blank for filename"
                        value={docTitleInput}
                        onChange={(e) => setDocTitleInput(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Select File</label>
                    <input 
                      type="file" 
                      required
                      accept=".pdf,.doc,.docx,.png,.jpg,.txt"
                      onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                      style={{ fontSize: '13px', color: 'var(--color-text)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                    <Button type="button" size="sm" variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={!selectedFile}>Upload & Publish to Agent</Button>
                  </div>
                </form>
              </Card>
            )}

            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Onboarding Documents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {customDocs.filter(d => !d.category || d.category === 'onboarding').map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-brand)' }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc.title}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{doc.date} • {doc.type}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc.fileName, null, doc.url)}>
                      <Download size={16} style={{ marginRight: '6px' }} /> Download
                    </Button>
                  </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-brand)' }}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Offer Letter</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Signed on joining date • PDF</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownload('Offer Letter')}>
                    <Download size={16} style={{ marginRight: '6px' }} /> Download
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Payroll & Salary Slips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {customDocs.filter(d => d.category === 'payroll').map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)' }}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc.title}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{doc.date} • {doc.type}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc.fileName, null, doc.url)}>
                      <Download size={16} style={{ marginRight: '6px' }} /> Download
                    </Button>
                  </div>
                ))}

                {['May 2026', 'April 2026', 'March 2026'].map((month, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)' }}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Salary Slip - {month}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Generated on 1st of next month • PDF</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(`Salary Slip - ${month}`)}>
                      <Download size={16} style={{ marginRight: '6px' }} /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {customDocs.filter(d => d.category === 'other').length > 0 && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Other Company Documents</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {customDocs.filter(d => d.category === 'other').map(doc => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-brand)' }}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc.title}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{doc.date} • {doc.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc.fileName, null, doc.url)}>
                        <Download size={16} style={{ marginRight: '6px' }} /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Complete history of daily check-ins, attendance status, and productive hours tracked.
            </p>
            <DataTable
              columns={HISTORY_COLUMNS}
              data={employee.history || []}
              emptyMessage="No historical activity records found for this employee yet."
            />
          </div>
        )}

        {activeTab === 'leaves' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Past and current leave requests for {employee.name}.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {employeeLeaves.map(leave => (
                <Card key={leave.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '15px', textTransform: 'capitalize' }}>{leave.leave_type?.replace('_', ' ')} Leave</h4>
                    <StatusBadge 
                      status={leave.status === 'approved' ? 'success' : (leave.status === 'rejected' ? 'danger' : 'warning')} 
                      label={leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)} 
                    />
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', gap: '16px', marginTop: '4px' }}>
                    <span><strong>From:</strong> {new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span><strong>To:</strong> {new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {leave.reason && (
                    <div style={{ marginTop: '8px', padding: '8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--color-text)' }}>
                      <strong>Reason:</strong> {leave.reason}
                    </div>
                  )}
                </Card>
              ))}
              {employeeLeaves.length === 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState title="No Leave History" description="This employee has not submitted any leave requests." />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Past and present assigned projects and tasks for {employee.name}.
              </p>
              <Button size="sm" onClick={() => navigate('/projects')}>
                Manage Projects
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {employeeProjects.map(p => (
                <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '15px' }}>{p.name}</h4>
                    <StatusBadge 
                      status={p.status === 'done' ? 'success' : (p.status === 'failed' ? 'danger' : 'info')} 
                      label={p.status.toUpperCase()} 
                    />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {p.description || 'No description provided.'}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <strong>Deadline:</strong> {new Date(p.deadline).toLocaleString()}
                  </div>
                </Card>
              ))}
              {employeeProjects.length === 0 && (
                <EmptyState title="No Projects Assigned" description="This employee hasn't been assigned any projects yet." />
              )}
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Issues and problems reported by {employee.name}.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {employeeIssues.length === 0 ? (
                <EmptyState title="No Issues Reported" description="This employee has not reported any issues." />
              ) : (
                employeeIssues.map(n => {
                  const isResolved = n.read;
                  return (
                    <Card
                      key={n.id}
                      padding="16px 20px"
                      style={{
                        opacity: isResolved ? 0.65 : 1,
                        borderLeft: isResolved ? '4px solid var(--color-success)' : '4px solid var(--color-warning)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {n.title}
                            </h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                              {formatTimeAgo(n.timestamp)}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '20px', marginTop: '4px' }}>
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
