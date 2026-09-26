import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
/**
 * Leaderboard data service.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calculateProductivityScore } from '../utils/productivityScore';

export async function getLeaderboard(filters = {}) {
  if (isSupabaseConfigured) {
    try {
      // 1. Fetch employees (exclude Admins)
      const { data: employees, error: empErr } = await supabase
        .from('employees')
        .select('id, name, department, role')
        .neq('role', 'Admin');
      if (empErr) throw empErr;

      // Calculate date boundary based on period
      const now = new Date();
      const todayStr = now.toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
      
      let startDateStr = todayStr;
      let hoursAllotted = 40;
      let daysPassedInPeriod = 1;

      const period = filters.period || 'weekly';

      if (period === 'daily') {
        startDateStr = todayStr;
        hoursAllotted = 8;
        daysPassedInPeriod = 1;
      } else if (period === 'weekly') {
        const dayOfWeek = now.getDay();
        const offsetToMon = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);
        const monThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetToMon);
        startDateStr = monThisWeek.toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
        hoursAllotted = 40;
        daysPassedInPeriod = Math.max(1, Math.floor((now.getTime() - monThisWeek.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      } else if (period === 'monthly') {
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDateStr = firstOfMonth.toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
        daysPassedInPeriod = Math.max(1, now.getDate());
        hoursAllotted = daysPassedInPeriod * 8; // approx 8 hours per day passed
      } else if (period === 'quarterly') {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const firstOfQuarter = new Date(now.getFullYear(), quarterMonth, 1);
        startDateStr = firstOfQuarter.toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
        daysPassedInPeriod = Math.max(1, Math.floor((now.getTime() - firstOfQuarter.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        hoursAllotted = daysPassedInPeriod * 8;
      }

      // 2. Fetch daily summaries strictly for this period
      const { data: summaries, error: sumErr } = await supabase
        .from('screentime_daily_summary')
        .select('employee_id, category, total_minutes')
        .gte('date', startDateStr)
        .lte('date', todayStr);
      if (sumErr) throw sumErr;

      // 3. Fetch attendance strictly for this period
      const { data: attendance, error: attErr } = await supabase
        .from('attendance_records')
        .select('employee_id, status')
        .gte('date', startDateStr)
        .lte('date', todayStr);
      if (attErr) throw attErr;

      if (employees && summaries && attendance) {
        // Group metrics by employee
        const empTotalMins = {};
        const empProdMins = {};
        
        summaries.forEach(s => {
          empTotalMins[s.employee_id] = (empTotalMins[s.employee_id] || 0) + s.total_minutes;
          if (s.category === 'productive') {
            empProdMins[s.employee_id] = (empProdMins[s.employee_id] || 0) + s.total_minutes;
          }
        });

        const empPresentDays = {};
        const empLeaveDays = {};
        attendance.forEach(a => {
          if (a.status === 'present' || a.status === 'wfh') {
            empPresentDays[a.employee_id] = (empPresentDays[a.employee_id] || 0) + 1;
          } else if (a.status === 'late') {
            empPresentDays[a.employee_id] = (empPresentDays[a.employee_id] || 0) + 0.7; // Late penalty
          } else if (a.status === 'on_leave') {
            empLeaveDays[a.employee_id] = (empLeaveDays[a.employee_id] || 0) + 1;
          }
        });

        // Compute scores
        let list = employees.map(emp => {
          const totalMins = empTotalMins[emp.id] || 0;
          const prodMins = empProdMins[emp.id] || 0;
          const hoursWorked = Math.round((totalMins / 60) * 10) / 10;
          const presentDays = empPresentDays[emp.id] || 0;
          const leaveDays = empLeaveDays[emp.id] || 0;
          
          // Exempt approved leave days from total expected work days and hours
          const personalWorkDays = Math.max(1, daysPassedInPeriod - leaveDays);
          const personalHoursAllotted = Math.max(1, hoursAllotted - (leaveDays * 8));
          
          // Calculate the score
          const { score, breakdown } = calculateProductivityScore({
            hoursWorked,
            hoursAllotted: personalHoursAllotted,
            productiveMinutes: prodMins,
            totalAppMinutes: totalMins,
            presentDays,
            totalWorkDays: personalWorkDays,
          });

          return {
            id: emp.id,
            name: emp.name,
            department: emp.department,
            role: emp.role,
            score,
            hoursWorked,
            hoursAllotted: hoursAllotted,
            breakdown,
            trend: 'same',
          };
        });

        // Apply department filters
        if (filters.department) {
          list = list.filter(e => e.department === filters.department);
        }

        // Sort descending by score
        list.sort((a, b) => b.score - a.score);

        // Assign ranks
        return list.map((item, i) => ({ ...item, rank: i + 1 }));
      }
    } catch (err) {
      console.error('[Supabase] Error compiling leaderboard:', err);
    }
  }

  return [];
}
