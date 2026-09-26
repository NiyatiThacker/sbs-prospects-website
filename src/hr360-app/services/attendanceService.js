import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
/**
 * Attendance data service.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function getAttendance(filters = {}) {
  if (isSupabaseConfigured) {
    try {
      const targetDate = filters.date || new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });

      // 1. Fetch all employees (exclude Admins)
      let empQuery = supabase.from('employees').select('id, name, department, expected_shift_start, expected_shift_end').neq('role', 'Admin');
      if (filters.department) {
        empQuery = empQuery.eq('department', filters.department);
      }
      const { data: employees, error: empError } = await empQuery;
      if (empError) throw empError;

      // 2. Fetch attendance records for targetDate
      let query = supabase
        .from('attendance_records')
        .select(`id, employee_id, date, status, check_in, check_out`)
        .eq('date', targetDate);

      // (If filters.status is set, we will filter it in JS so we don't drop absent people before classifying them)
      
      const { data: records, error } = await query;
      if (error) throw error;

      // Fetch active ping logs to determine if someone is actively online right now
      const { data: latestLogs } = await supabase
        .from('screentime_raw_logs')
        .select('employee_id, timestamp, window_title, process_name')
        .gte('timestamp', new Date(Date.now() - 90 * 1000).toISOString())
        .order('timestamp', { ascending: true });

      const activeEmployeeStatuses = new Map();
      latestLogs?.forEach(l => {
        let st = 'active';
        if (l.window_title === 'On Break' && l.process_name === 'Break') {
            st = 'on_break';
        }
        activeEmployeeStatuses.set(l.employee_id, st);
      });
      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });

      const formatIST = (timeStr) => {
        if (!timeStr) return null;
        const date = new Date(`1970-01-01T${timeStr}Z`);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: COMPANY_TIMEZONE, hour12: false });
      };

      // 3. Merge
      let results = [];
      for (const emp of (employees || [])) {
        const record = records?.find(r => r.employee_id === emp.id);
        const activeStatus = activeEmployeeStatuses.get(emp.id);
        const isActive = activeStatus === 'active' || activeStatus === 'on_break';
        
        let displayStatus = record?.status || 'absent';
        if (targetDate === todayStr && activeStatus === 'on_break') {
            displayStatus = 'on_break';
        }

        if (record) {
          results.push({
            id: record.id,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            date: record.date,
            status: displayStatus,
            checkIn: formatIST(record.check_in),
            checkOut: isActive ? null : formatIST(record.check_out),
            expectedShiftStart: emp.expected_shift_start ? emp.expected_shift_start.slice(0, 5) : '09:00',
            expectedShiftEnd: emp.expected_shift_end ? emp.expected_shift_end.slice(0, 5) : '18:00',
            isActive,
          });
        } else {
          results.push({
            id: `absent-${emp.id}-${targetDate}`,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            date: targetDate,
            status: 'absent',
            checkIn: null,
            checkOut: null,
            expectedShiftStart: emp.expected_shift_start ? emp.expected_shift_start.slice(0, 5) : '09:00',
            expectedShiftEnd: emp.expected_shift_end ? emp.expected_shift_end.slice(0, 5) : '18:00',
            isActive,
          });
        }
      }

      // Apply status filter if present
      if (filters.status) {
        results = results.filter(r => r.status === filters.status);
      }

      // Auto-recover missing check-ins and check-outs from raw logs
      const daysToRecover = results.filter(r => (r.status === 'present' || r.status === 'wfh' || r.status === 'half_day' || r.status === 'on_break') && (!r.checkIn || !r.checkOut || r.checkIn === '—' || r.checkOut === '—'));
      
      for (const r of daysToRecover) {
        try {
            const startOfDay = new Date(`${r.date}T00:00:00+05:30`).toISOString();
            const endOfDay = new Date(`${r.date}T23:59:59+05:30`).toISOString();

            if (!r.checkIn || r.checkIn === '—') {
                const { data: firstLog } = await supabase
                    .from('screentime_raw_logs')
                    .select('timestamp')
                    .eq('employee_id', r.employeeId)
                    .gte('timestamp', startOfDay)
                    .lte('timestamp', endOfDay)
                    .order('timestamp', { ascending: true })
                    .limit(1);
                if (firstLog && firstLog.length > 0) {
                    const ts = firstLog[0].timestamp.endsWith('Z') ? firstLog[0].timestamp : firstLog[0].timestamp + 'Z';
                    r.checkIn = new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: COMPANY_TIMEZONE, hour12: false });
                    r.isAutoRecoveredCheckIn = true;
                } else {
                    r.checkIn = '—';
                }
            }
            if (!r.isActive && (!r.checkOut || r.checkOut === '—')) {
                const { data: lastLog } = await supabase
                    .from('screentime_raw_logs')
                    .select('timestamp')
                    .eq('employee_id', r.employeeId)
                    .gte('timestamp', startOfDay)
                    .lte('timestamp', endOfDay)
                    .order('timestamp', { ascending: false })
                    .limit(1);
                if (lastLog && lastLog.length > 0) {
                    const ts = lastLog[0].timestamp.endsWith('Z') ? lastLog[0].timestamp : lastLog[0].timestamp + 'Z';
                    r.checkOut = new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: COMPANY_TIMEZONE, hour12: false });
                    r.isAutoRecoveredCheckOut = true;
                } else {
                    r.checkOut = '—';
                }
            } else if (r.isActive) {
                r.checkOut = '—';
            }
        } catch (e) {
            console.warn('Could not auto-recover check-in for attendance row:', r.employeeId, e);
        }
      }

      // Format remaining nulls to '—'
      results.forEach(r => {
        if (!r.checkIn) r.checkIn = '—';
        if (!r.checkOut) r.checkOut = '—';
      });

      const statusWeight = {
        present: 1,
        late: 1,
        wfh: 1,
        half_day: 1,
        on_break: 1.5,
        on_leave: 2,
        absent: 3
      };
      results.sort((a, b) => {
        const wA = statusWeight[a.status] || 99;
        const wB = statusWeight[b.status] || 99;
        if (wA !== wB) return wA - wB;
        // if same status, sort alphabetically by name
        return (a.employeeName || '').localeCompare(b.employeeName || '');
      });

      return results;
    } catch (err) {
      console.error('[Supabase] Error fetching attendance:', err);
    }
  }
  return [];
}

  export async function getAttendanceSummary() {
  if (isSupabaseConfigured) {
    try {
      const { data: allEmps } = await supabase.from('employees').select('id').neq('role', 'Admin');
      const validEmpIds = new Set(allEmps?.map(e => e.id) || []);

      const todayStr = new Date().toISOString().split('T')[0];
      let { data: todayRecords, error } = await supabase
        .from('attendance_records')
        .select('employee_id, status')
        .eq('date', todayStr);
      
      if (error) throw error;
      todayRecords = todayRecords?.filter(r => validEmpIds.has(r.employee_id)) || [];

      // Also get historical rate
      let { data: allRecords, error: allErr } = await supabase
        .from('attendance_records')
        .select('employee_id, status')
        .limit(1000);

      if (allErr) throw allErr;
      allRecords = allRecords?.filter(r => validEmpIds.has(r.employee_id)) || [];

      const totalCount = allRecords?.length || 1;
      const presentCount = allRecords?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'wfh' || r.status === 'half_day').length || 0;
      const attendanceRate = Math.round((presentCount / totalCount) * 1000) / 10;

      return {
        attendanceRate: attendanceRate || 0,
        presentToday: todayRecords?.filter(r => r.status === 'present').length || 0,
        absentToday: todayRecords?.filter(r => r.status === 'absent').length || 0,
        lateToday: todayRecords?.filter(r => r.status === 'late').length || 0,
        onLeaveToday: todayRecords?.filter(r => r.status === 'on_leave').length || 0,
        wfhToday: todayRecords?.filter(r => r.status === 'wfh').length || 0,
      };
    } catch (err) {
      console.error('[Supabase] Error fetching attendance summary:', err);
    }
  }

  return {
    attendanceRate: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    onLeaveToday: 0,
    wfhToday: 0,
  };
}

export async function updateAttendanceStatus(employeeId, date, status, checkInIST, checkOutIST) {
  if (isSupabaseConfigured) {
    try {
      const convertIstToUtcTime = (istTimeStr) => {
        if (!istTimeStr || istTimeStr === '—') return null;
        const [h, m] = istTimeStr.split(':');
        let totalMins = parseInt(h, 10) * 60 + parseInt(m, 10);
        let utcMins = totalMins - COMPANY_TIMEZONE_OFFSET_MINS;
        if (utcMins < 0) utcMins += 24 * 60;
        const utcH = Math.floor(utcMins / 60).toString().padStart(2, '0');
        const utcM = (utcMins % 60).toString().padStart(2, '0');
        return `${utcH}:${utcM}:00`;
      };

      const check_in = checkInIST ? convertIstToUtcTime(checkInIST) : (checkInIST === '' ? null : undefined);
      const check_out = checkOutIST ? convertIstToUtcTime(checkOutIST) : (checkOutIST === '' ? null : undefined);

      const updatePayload = { status };
      if (check_in !== undefined) updatePayload.check_in = check_in;
      if (check_out !== undefined) updatePayload.check_out = check_out;

      // Check if record exists
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('employee_id', employeeId)
        .eq('date', date)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('attendance_records')
          .update(updatePayload)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Insert new record
        const insertPayload = { 
          employee_id: employeeId, 
          date, 
          status, 
          check_in: check_in || null, 
          check_out: check_out || null 
        };
        const { data, error } = await supabase
          .from('attendance_records')
          .insert(insertPayload)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    } catch (err) {
      console.error('[Supabase] Error updating attendance status:', err);
      throw err;
    }
  }
  throw new Error('Supabase not configured');
}

