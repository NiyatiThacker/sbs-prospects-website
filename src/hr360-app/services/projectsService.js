import { supabase, isSupabaseConfigured } from './supabaseClient';
import { createNotification } from './notificationsService';

export async function getProjects(employeeId = null) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[Supabase] Error fetching projects:', err);
    }
  }
  return [];
}

export async function assignProject(employeeId, employeeName, name, description, deadline) {
  const newProject = {
    id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    employee_id: String(employeeId),
    employee_name: employeeName,
    name,
    description,
    deadline, // ISO string
    status: 'active',
    extensions: [],
    extension_requests: [],
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').insert([newProject]);
      if (error) throw error;
      return newProject;
    } catch (err) {
      console.error('[Supabase] Error assigning project:', err);
    }
  }
  return null;
}

export async function updateProjectStatus(projectId, status) {
  if (isSupabaseConfigured) {
    try {
      // Fetch current project to get its name
      const { data: proj, error: fetchErr } = await supabase.from('projects').select('name').eq('id', projectId).single();
      if (fetchErr) throw fetchErr;

      // Update ALL active projects with this exact same name (team sync for countdown failure)
      // Anyone who is already 'done' will remain 'done' and will not be marked as 'failed'
      const { error } = await supabase.from('projects')
        .update({ status })
        .eq('name', proj.name)
        .eq('status', 'active');
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error updating project status:', err);
    }
  }
  return false;
}

export async function verifyProjectSubmissions(projectName) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects')
        .update({ status: 'done' })
        .eq('name', projectName)
        .eq('status', 'in_review');
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error verifying project submissions:', err);
    }
  }
  return false;
}

export async function extendDeadline(projectId, newDeadline, reason) {
  let project = null;
  
  if (isSupabaseConfigured) {
    try {
      const { data, error: fetchErr } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (fetchErr) throw fetchErr;
      project = data;
    } catch (err) {
      console.error('[Supabase] Error fetching project for extension:', err);
    }
  }
  
  if (!project) return false;
  
  const extensionRecord = {
    previousDeadline: project.deadline,
    newDeadline,
    reason: reason || 'HR Extension',
    date: new Date().toISOString()
  };
  
  const updatedExtensions = [...(project.extensions || []), extensionRecord];
  
  if (isSupabaseConfigured) {
    try {
      // Fetch all team members with this project name
      const { data: members, error: membersErr } = await supabase.from('projects').select('*').eq('name', project.name);
      if (membersErr) throw membersErr;
      
      const promises = members.map(m => {
        const mExtensions = [...(m.extensions || []), extensionRecord];
        // If they failed because of deadline, reset them to active. 
        // If they are done, leave them done.
        const newStatus = (m.status === 'failed') ? 'active' : m.status;
        
        return supabase.from('projects').update({
          deadline: newDeadline,
          status: newStatus,
          extensions: mExtensions,
          extension_requests: []
        }).eq('id', m.id);
      });
      
      await Promise.all(promises);
      return true;
    } catch (err) {
      console.error('[Supabase] Error extending deadline:', err);
    }
  }
  return false;
}

export async function requestExtension(projectId, requestedDeadline, reason) {
  let project = null;
  
  if (isSupabaseConfigured) {
    try {
      const { data, error: fetchErr } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (fetchErr) throw fetchErr;
      project = data;
    } catch (err) {
      console.error('[Supabase] Error fetching project for request:', err);
    }
  }
  
  if (!project) return false;
  
  const requestRecord = {
    requestedDeadline,
    reason,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  const updatedRequests = [...(project.extension_requests || []), requestRecord];
  
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').update({
        extension_requests: updatedRequests
      }).eq('id', projectId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[Supabase] Error requesting extension:', err);
    }
  }
  return false;
}
