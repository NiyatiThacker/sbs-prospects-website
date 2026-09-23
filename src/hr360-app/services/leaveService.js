import { supabase, isSupabaseConfigured } from './supabaseClient';
import { createNotification } from './notificationsService';

export async function getLeaveRequests() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase] Error fetching leave requests:', err);
    return [];
  }
}

export async function updateLeaveRequestStatus(id, newStatus, requestData = null) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) throw error;

    // If approved, we need to sync with attendance_records!
    if (newStatus === 'approved' && requestData) {
      const { employee_id, start_date, end_date } = requestData;
      
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      const attendanceRecords = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        attendanceRecords.push({
          employee_id,
          date: dateStr,
          status: 'on_leave',
          check_in: null,
          check_out: null
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      if (attendanceRecords.length > 0) {
        // Upsert attendance records (on_leave)
        const { error: attError } = await supabase
          .from('attendance_records')
          .upsert(attendanceRecords, { onConflict: 'employee_id, date' });
          
        if (attError) throw attError;
      }
      
      await createNotification(
        'success',
        'Leave Approved',
        `Leave request for ${requestData.employee_name} has been approved from ${start_date} to ${end_date}.`
      );
    } else if (newStatus === 'rejected' && requestData) {
      await createNotification(
        'danger',
        'Leave Rejected',
        `Leave request for ${requestData.employee_name} was rejected.`
      );
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Error updating leave request:', err);
    return false;
  }
}
