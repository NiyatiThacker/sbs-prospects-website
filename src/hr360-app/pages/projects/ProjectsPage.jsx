import React, { useState, useEffect } from 'react';
import { getProjects, assignProject, extendDeadline, updateProjectStatus } from '@/hr360-app/services/projectsService';
import { notifyProjectDeadlineMissed } from '@/hr360-app/services/notificationsService';
import AssignProjectModal from './components/AssignProjectModal';
import EditDeadlineModal from './components/EditDeadlineModal';
import CountdownTimer from './components/CountdownTimer';
import toast from 'react-hot-toast';
import { Plus, Edit2, Clock, CheckCircle } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
    // Poll for updates every 10 seconds to sync with mock local storage
    const interval = setInterval(fetchProjects, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (projectData) => {
    const promises = projectData.selectedEmployees.map(emp => 
      assignProject(
        emp.id, 
        emp.name, 
        projectData.name, 
        projectData.description, 
        projectData.deadline
      )
    );
    await Promise.all(promises);
    toast.success('Project Assigned!');
    fetchProjects();
  };

  const handleExtend = async (projectId, newDeadline, reason) => {
    await extendDeadline(projectId, newDeadline, reason);
    toast.success('Deadline Extended!');
    fetchProjects();
  };

  const handleZero = async (project) => {
    if (project.status === 'active') {
      await updateProjectStatus(project.id, 'failed');
      await notifyProjectDeadlineMissed(project.employee_name, project.name);
      fetchProjects();
    }
  };

  const groupedProjects = {};
  projects.forEach(p => {
    if (!groupedProjects[p.name]) {
      groupedProjects[p.name] = [];
    }
    groupedProjects[p.name].push(p);
  });

  const uniqueProjects = Object.values(groupedProjects).map(group => {
    const p = group[0];
    
    let teamProgress = "";
    let derivedStatus = 'active';
    
    if (group.length > 1) {
      const doneCount = group.filter(g => g.status === 'done').length;
      teamProgress = `${doneCount}/${group.length}`;
      
      if (group.every(g => g.status === 'done')) {
        derivedStatus = 'done';
      } else if (group.some(g => g.status === 'failed')) {
        derivedStatus = 'failed';
      } else {
        derivedStatus = 'active';
      }
    } else {
      derivedStatus = p.status;
    }

    return {
      ...p,
      isTeam: group.length > 1,
      teamMembers: group.map(g => g.employee_name).join(', '),
      teamProgress,
      status: derivedStatus
    };
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--color-text)' }}>Projects & Tasks</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Manage assignments and track deadlines.</p>
        </div>
        <button 
          onClick={() => setIsAssignOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
            backgroundColor: 'var(--color-brand)', color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer', fontWeight: 500
          }}
        >
          <Plus size={18} /> Assign Project
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Project</th>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Employee</th>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Deadline</th>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Time Left</th>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uniqueProjects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.description || 'No description'}
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--color-text)' }} title={p.isTeam ? p.teamMembers : ''}>
                  {p.isTeam ? 'Team Project' : p.employee_name}
                </td>
                <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                  {new Date(p.deadline).toLocaleString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <CountdownTimer deadline={p.deadline} status={p.status} onZero={() => handleZero(p)} />
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                    backgroundColor: p.status === 'done' ? 'rgba(22, 163, 74, 0.1)' : (p.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                    color: p.status === 'done' ? '#16A34A' : (p.status === 'failed' ? '#EF4444' : '#3B82F6')
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                  {p.isTeam && p.status !== 'failed' && (
                     <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px', fontWeight: 500 }}>
                       Progress: {p.teamProgress}
                     </div>
                  )}
                  {p.extension_requests && p.extension_requests.length > 0 && (
                    <div style={{ fontSize: '11px', color: '#D97706', marginTop: '4px' }}>
                      Extension Requested
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button 
                    onClick={() => setEditingProject(p)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-text-secondary)',
                      cursor: 'pointer', padding: '4px'
                    }}
                    title="Edit/Extend Deadline"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  No projects assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AssignProjectModal 
        isOpen={isAssignOpen} 
        onClose={() => setIsAssignOpen(false)} 
        onAssign={handleAssign} 
      />

      <EditDeadlineModal 
        isOpen={!!editingProject} 
        onClose={() => setEditingProject(null)} 
        project={editingProject} 
        onSave={handleExtend}
      />
    </div>
  );
}
