import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
import { useState } from 'react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import KpiCard from '@/hr360-app/components/shared/ui/KpiCard';
import DataTable from '@/hr360-app/components/shared/ui/DataTable';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import Avatar from '@/hr360-app/components/shared/ui/Avatar';
import EmptyState from '@/hr360-app/components/shared/ui/EmptyState';
import { SkeletonDashboard } from '@/hr360-app/components/shared/ui/Skeleton';
import Button from '@/hr360-app/components/shared/ui/Button';
import { CalendarCheck, UserX, UserCheck, Clock, Home, Edit2 } from 'lucide-react';
import { DEPARTMENTS } from '@/hr360-app/utils/constants';
import useAttendanceData from './hooks/useAttendanceData';
import { updateAttendanceStatus } from '@/hr360-app/services/attendanceService';
import { updateEmployee } from '@/hr360-app/services/employeeService';
import toast from 'react-hot-toast';

const ATTENDANCE_COLUMNS = [
  {
    key: 'employeeName',
    label: 'Employee',
    render: (val) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Avatar name={val} size={32} />
        <span style={{ fontWeight: 500 }}>{val}</span>
      </div>
    ),
  },
  { key: 'department', label: 'Department' },
  { key: 'date', label: 'Date', nowrap: true },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'checkIn',
    label: 'Check In',
    render: (val) => val || '—',
  },
  {
    key: 'checkOut',
    label: 'Check Out',
    render: (val) => val || '—',
  },
];

const CustomAttendanceIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="7" x2="11" y2="7" />
    <line x1="3" y1="17" x2="11" y2="17" />
    <path d="M15 4 l6 6" />
    <path d="M21 4 l-6 6" />
    <path d="M14 17 l3 3 l5 -7" />
  </svg>
);

export default function AttendancePage() {
  const { records, summary, isLoading, error, filters, setFilters, refresh } = useAttendanceData();
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE }));

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [newExpectedStart, setNewExpectedStart] = useState('');
  const [newExpectedEnd, setNewExpectedEnd] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return <PageContainer><SkeletonDashboard /></PageContainer>;
  if (error) return <PageContainer><EmptyState title="Failed to load attendance" description={error} /></PageContainer>;

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setNewCheckIn(record.checkIn && record.checkIn !== '—' && !record.isAutoRecoveredCheckIn ? record.checkIn : '');
    setNewCheckOut(record.checkOut && record.checkOut !== '—' && !record.isAutoRecoveredCheckOut ? record.checkOut : '');
    setNewExpectedStart(record.expectedShiftStart || '');
    setNewExpectedEnd(record.expectedShiftEnd || '');
    setEditModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!editingRecord) return;
    setIsSaving(true);
    try {
      await updateAttendanceStatus(editingRecord.employeeId, editingRecord.date, newStatus, newCheckIn, newCheckOut);
      
      // Check if generic timing was modified
      if (newExpectedStart !== editingRecord.expectedShiftStart || newExpectedEnd !== editingRecord.expectedShiftEnd) {
        const hStart = newExpectedStart || null;
        const hEnd = newExpectedEnd || null;
        await updateEmployee(editingRecord.employeeId, {
          expected_shift_start: hStart ? (hStart.length === 5 ? hStart + ':00' : hStart) : null,
          expected_shift_end: hEnd ? (hEnd.length === 5 ? hEnd + ':00' : hEnd) : null
        });
      }

      toast.success('Attendance record updated successfully');
      setEditModalOpen(false);
      refresh(); // Refresh the attendance data
    } catch (e) {
      toast.error('Failed to update record');
    } finally {
      setIsSaving(false);
    }
  };

  const tableColumns = [
    ...ATTENDANCE_COLUMNS,
    {
      key: 'actions',
      label: 'Actions',
      render: (_, record) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleEdit(record)}
          icon={<Edit2 size={14} />}
        >
          Edit
        </Button>
      ),
    }
  ];

  const handleFilter = () => {
    setFilters({ department: department || undefined, status: status || undefined, date: date || undefined });
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <KpiCard
              label="Attendance Rate"
              value={summary.attendanceRate}
              suffix="%"
              icon={<CustomAttendanceIcon size={24} color="#8B5CF6" />}
              color="#8B5CF6"
              colorSoft="#F5F3FF"
            />
            <KpiCard
              label="Present"
              value={summary.presentCount}
              icon={<UserCheck size={24} strokeWidth={2.5} color="#10B981" />}
              color="var(--color-brand)"
              colorSoft="var(--color-brand-soft)"
            />
            <KpiCard
              label="Absent"
              value={summary.absentCount}
              icon={<UserX size={24} strokeWidth={2.5} color="#EF4444" />}
              color="var(--color-danger)"
              colorSoft="var(--color-danger-soft)"
            />
            <KpiCard
              label="Late"
              value={summary.lateCount}
              icon={<Clock size={22} />}
              color="var(--color-warning)"
              colorSoft="var(--color-warning-soft)"
            />
          </div>
        )}

        {/* Filters */}
        <Card padding="16px">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-primary)',
              }}
            />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="wfh">WFH</option>
              <option value="on_leave">On Leave</option>
              <option value="half_day">Half-day</option>
            </select>
            <Button size="sm" onClick={handleFilter}>Apply Filters</Button>
            <Button size="sm" variant="ghost" onClick={() => { 
              setDepartment(''); 
              setStatus(''); 
              const defaultDate = new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
              setDate(defaultDate);
              setFilters({ date: defaultDate }); 
            }}>Clear</Button>
          </div>
        </Card>

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={records.slice(0, 50)}
          emptyMessage="No attendance records match the selected filters."
        />
      </div>

      {editModalOpen && editingRecord && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg)', padding: '24px', borderRadius: 'var(--radius-md)',
            width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Edit Attendance Status</h3>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              <strong>Employee:</strong> {editingRecord.employeeName} <br/>
              <strong>Date:</strong> {editingRecord.date}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                  fontSize: '14px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)'
                }}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="wfh">WFH</option>
                <option value="on_leave">On Leave</option>
                <option value="half_day">Half-day</option>
              </select>
            </div>
            
            <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Today's Timing</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Check In</label>
                <input
                  type="time"
                  value={newCheckIn}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                    fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Check Out</label>
                <input
                  type="time"
                  value={newCheckOut}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                    fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)'
                  }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: 'var(--color-text-primary)' }}>Generic Shift (All Days)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Shift Start</label>
                <input
                  type="time"
                  value={newExpectedStart}
                  onChange={(e) => setNewExpectedStart(e.target.value)}
                  style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                    fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Shift End</label>
                <input
                  type="time"
                  value={newExpectedEnd}
                  onChange={(e) => setNewExpectedEnd(e.target.value)}
                  style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                    fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setEditModalOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSaveStatus} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
