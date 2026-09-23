import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import DataTable from '@/hr360-app/components/shared/ui/DataTable';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import Avatar from '@/hr360-app/components/shared/ui/Avatar';
import ProgressBar from '@/hr360-app/components/shared/ui/ProgressBar';
import EmptyState from '@/hr360-app/components/shared/ui/EmptyState';
import Button from '@/hr360-app/components/shared/ui/Button';
import { SkeletonTable } from '@/hr360-app/components/shared/ui/Skeleton';
import { Search, UserPlus, Trash, Edit, X } from 'lucide-react';
import { useDebounce } from '@/hr360-app/hooks/useDebounce';
import { DEPARTMENTS } from '@/hr360-app/utils/constants';
import { formatHours } from '@/hr360-app/utils/formatters';
import { getEmployees, createEmployee, deleteEmployee, updateEmployee } from '@/hr360-app/services/employeeService';

export default function EmployeeDirectoryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [department, setDepartment] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', department: 'Engineering', role: 'Employee' });
  const [addError, setAddError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', department: '', expected_shift_start: '' });
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setAddError('');
    setIsSubmitting(true);
    try {
      await createEmployee(addForm);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', department: 'Engineering', role: 'Employee' });
      const data = await getEmployees({ search: debouncedSearch, department: department || undefined });
      setEmployees(data);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateEmployee(editingEmployee.id, editForm);
      setEditingEmployee(null);
      const data = await getEmployees({ search: debouncedSearch, department: department || undefined });
      setEmployees(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    setIsSubmitting(true);
    try {
      await deleteEmployee(deletingEmployee.id);
      setDeletingEmployee(null);
      const data = await getEmployees({ search: debouncedSearch, department: department || undefined });
      setEmployees(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync internal state with URL changes (e.g., from Topbar search)
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('search', val);
    else newParams.delete('search');
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getEmployees({ search: debouncedSearch, department: department || undefined });
        if (!cancelled) setEmployees(data);
      } catch { /* handled by service */ }
      finally { if (!cancelled) setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedSearch, department]);

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={val} size={36} />
          <div>
            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{val}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.role}</div>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'hoursWorked',
      label: 'Hours (Weekly)',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
          <ProgressBar value={val} max={row.hoursAllotted} height={6} style={{ flex: 1 }} animated={false} />
          <span style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {formatHours(val)}
          </span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      align: 'right',
      render: (val) => (
        <span style={{
          fontWeight: 600,
          fontFeatureSettings: '"tnum"',
          color: val >= 80 ? 'var(--color-success)' : val >= 65 ? 'var(--color-warning)' : 'var(--color-danger)',
        }}>
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={(e) => { e.stopPropagation(); setEditingEmployee(row); setEditForm({ role: row.role, department: row.department, expected_shift_start: row.expected_shift_start || '09:00:00' }); }} style={actionBtnStyle} title="Edit Employee">
            <Edit size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeletingEmployee(row); }} style={{...actionBtnStyle, color: 'var(--color-danger)'}} title="Delete Employee">
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleNameChange = (e) => {
    const val = e.target.value;
    const firstName = val.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    setAddForm(prev => {
      // Only auto-generate if they haven't heavily modified the fields manually,
      // or just forcefully overwrite it for convenience as they requested.
      return {
        ...prev,
        name: val,
        email: firstName ? `${firstName}.360@sbs.com` : '',
        password: firstName ? `${firstName}@sbs` : ''
      };
    });
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {employees.length} employees
            </p>
          </div>
          <div>
            <Button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={16} /> Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card padding="12px 16px">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
              <Search size={16} style={{
                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)', pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search by name, email, department…"
                value={search}
                onChange={handleSearchChange}
                style={{
                  width: '100%', height: '36px', padding: '0 12px 0 34px',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)', fontSize: '13px', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-text-primary)', outline: 'none',
                }}
              />
            </div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </Card>

        {/* Table */}
        {isLoading ? (
          <SkeletonTable rows={8} cols={5} />
        ) : employees.length === 0 ? (
          <EmptyState title="No employees found" description="Try adjusting your search or filter criteria." />
        ) : (
          <DataTable
            columns={columns}
            data={employees}
            onRowClick={(row) => navigate(`/employees/${row.id}`)}
          />
        )}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-surface)', width: '100%', maxWidth: '400px',
            borderRadius: 'var(--radius-lg)', padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)'
              }}
            >
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--color-text-primary)' }}>Create New Employee</h2>
            <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Full Name</label>
                <input required type="text" value={addForm.name} onChange={handleNameChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Email Address (Username)</label>
                <input required type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Temporary Password</label>
                <input required type="text" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Department</label>
                  <select required value={addForm.department} onChange={e => setAddForm({...addForm, department: e.target.value})} style={inputStyle}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Role</label>
                  <select required value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} style={inputStyle}>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              {addError && <div style={{ color: 'var(--color-danger)', fontSize: '13px', background: 'var(--color-danger-soft)', padding: '10px', borderRadius: '4px' }}>{addError}</div>}
              <Button type="submit" disabled={isSubmitting} fullWidth style={{ marginTop: '8px' }}>
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-surface)', width: '100%', maxWidth: '400px',
            borderRadius: 'var(--radius-lg)', padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <button
              onClick={() => setEditingEmployee(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)'
              }}
            >
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--color-text-primary)' }}>Edit {editingEmployee.name}</h2>
            <form onSubmit={handleEditEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Department</label>
                <select required value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} style={inputStyle}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Role</label>
                <select required value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} style={inputStyle}>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Expected Shift Start</label>
                <input required type="time" value={editForm.expected_shift_start ? editForm.expected_shift_start.substring(0, 5) : '09:00'} onChange={e => setEditForm({...editForm, expected_shift_start: e.target.value + ':00'})} style={inputStyle} />
              </div>
              <Button type="submit" disabled={isSubmitting} fullWidth style={{ marginTop: '8px' }}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEmployee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--color-surface)', width: '100%', maxWidth: '400px',
            borderRadius: 'var(--radius-lg)', padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--color-text-primary)' }}>Delete Employee?</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to completely remove <strong>{deletingEmployee.name}</strong> from the system? This will delete their account and prevent them from logging in. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" onClick={() => setDeletingEmployee(null)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleDeleteEmployee} disabled={isSubmitting} style={{ flex: 1, background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

const inputStyle = {
  width: '100%', height: '38px', padding: '0 12px',
  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
  background: 'var(--color-bg)', fontSize: '14px',
  color: 'var(--color-text-primary)', outline: 'none'
};

const actionBtnStyle = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  padding: '6px', borderRadius: '6px',
  color: 'var(--color-text-secondary)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s'
};
