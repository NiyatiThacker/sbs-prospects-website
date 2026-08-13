import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getEmployees } from './employeeService';
import toast from 'react-hot-toast';

export async function getNotifications() {
  if (!isSupabaseConfigured) return [];
  
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) throw error;
    
    // Map to camelCase for the frontend
    return (data || []).map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      timestamp: n.created_at
    }));
  } catch (err) {
    console.error('[Supabase] Error fetching notifications:', err?.message || err, err?.code, err?.details);
    return [];
  }
}

export async function markAsRead(id) {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('[Supabase] Error marking notification read:', err);
  }
}

export async function markAllAsRead() {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    if (error) throw error;
  } catch (err) {
    console.error('[Supabase] Error marking all notifications read:', err);
  }
}

export async function createNotification(type, title, message) {
  if (!isSupabaseConfigured) return;
  try {
    // Check if a similar notification was created in the last 24 hours to avoid spam
    const { data: recent } = await supabase
      .from('notifications')
      .select('id')
      .eq('title', title)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);
      
    if (recent && recent.length > 0) {
      return; // Skip, already notified recently
    }

    const { error } = await supabase
      .from('notifications')
      .insert({ type, title, message });
      
    if (error) throw error;
    
    // Show a toast popup for the new notification!
    if (type === 'danger') toast.error(title);
    else if (type === 'success') toast.success(title);
    else toast(title, { icon: '🔔' });
    
  } catch (err) {
    console.error('[Supabase] Error creating notification:', err);
  }
}

// Generate system alerts by analyzing employee data
export async function generateSystemAlerts() {
  if (!isSupabaseConfigured) return;
  
  try {
    const employees = await getEmployees();
    if (!employees || employees.length === 0) return;
    
    // Alert 1: Inactive Employees (0 hours logged but they exist)
    const inactiveEmployees = employees.filter(e => e.status === 'inactive');
    if (inactiveEmployees.length > 0) {
      const names = inactiveEmployees.slice(0, 3).map(e => e.name).join(', ');
      const more = inactiveEmployees.length > 3 ? ` and ${inactiveEmployees.length - 3} others` : '';
      
      await createNotification(
        'danger',
        'Inactive Employees Detected',
        `${inactiveEmployees.length} employees are currently marked as inactive (0 hours logged today). Includes: ${names}${more}.`
      );
    }
    
    // Alert 2: High Performers (100% score)
    const topPerformers = employees.filter(e => e.score >= 95 && e.hoursWorked > 0);
    if (topPerformers.length > 0) {
      const names = topPerformers.slice(0, 2).map(e => e.name).join(', ');
      await createNotification(
        'success',
        'Top Performers Today',
        `${topPerformers.length} employees achieved over 95% productivity score today. Great job ${names}!`
      );
    }

    // Alert 3: Low Utilization
    const lowUtilization = employees.filter(e => e.score < 50 && e.hoursWorked > 0);
    if (lowUtilization.length > 0) {
      await createNotification(
        'warning',
        'Low Utilization Alert',
        `${lowUtilization.length} employees have logged active time but are currently below 50% productivity score.`
      );
    }
    
    
  } catch (err) {
    console.error('[Supabase] Error generating system alerts:', err);
  }
}

// Project/Task Notifications
export async function notifyProjectDone(employeeName, projectName) {
  await createNotification(
    'success',
    'Project Completed',
    `${employeeName} has marked the project "${projectName}" as done.`
  );
}

export async function notifyProjectDeadlineMissed(employeeName, projectName) {
  await createNotification(
    'danger',
    'Deadline Missed',
    `${employeeName} missed the deadline for the project "${projectName}".`
  );
}

export async function notifyProjectExtensionRequested(employeeName, projectName, newDeadline, reason) {
  await createNotification(
    'info',
    'Extension Requested',
    `${employeeName} requested a deadline extension for "${projectName}" to ${new Date(newDeadline).toLocaleString()}. Reason: ${reason}`
  );
}

