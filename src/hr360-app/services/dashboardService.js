import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
/**
 * Dashboard data service — fetches KPIs, trends, department comparison, and alerts.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function getDashboardSummary() {
  if (isSupabaseConfigured) {
    try {
      const kpis = await getDashboardKpis();
      const hoursTrend = await getHoursTrend();
      const departmentComparison = await getDepartmentComparison();
      const appCategorySplit = await getAppCategorySplit();
      const alerts = await getAlerts();

      return {
        kpis,
        hoursTrend,
        departmentComparison,
        appCategorySplit,
        alerts,
        topEmployees: [], 
      };
    } catch (err) {
      console.error('[Supabase] Error compiling dashboard summary:', err);
    }
  }

  return {
    kpis: await getDashboardKpis(),
    hoursTrend: [],
    departmentComparison: [],
    appCategorySplit: [],
    alerts: [],
    topEmployees: [],
  };
}

export async function getDashboardKpis() {
  if (isSupabaseConfigured) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get Total Employee Count
      const { data: allEmps } = await supabase.from('employees').select('id, name').neq('role', 'Admin');
      const validEmpIds = new Set(allEmps?.map(e => e.id) || []);
      const totalEmpCount = validEmpIds.size || 1;

      // 1. Active Employees
      const { data: latestLogs } = await supabase
        .from('screentime_raw_logs')
        .select('employee_id')
        .gte('timestamp', new Date(Date.now() - 30 * 60000).toISOString());
      
      let activeEmployeesSet = new Set(latestLogs?.filter(l => validEmpIds.has(l.employee_id)).map(l => l.employee_id) || []);
      let activeCount = activeEmployeesSet.size;

      // 2. Attendance Rate
      let { data: todayAttendance } = await supabase
        .from('attendance_records')
        .select('employee_id, status, date')
        .order('date', { ascending: false })
        .limit(100);
        
      let presentCount = todayAttendance?.filter(r => validEmpIds.has(r.employee_id) && ['present', 'late', 'wfh', 'half_day'].includes(r.status)).length || 0;
      let attendanceRate = Math.round((presentCount / Math.max(1, totalEmpCount)) * 100);

      // 3. Avg Utilization
      const { data: recentSummaries } = await supabase
        .from('screentime_daily_summary')
        .select('employee_id, category, total_minutes')
        .gte('date', sevenDaysAgo);
        
      let productiveMins = 0;
      let totalMins = 0;
      const empProdMap = {}; 

      recentSummaries?.forEach(s => {
        if (!validEmpIds.has(s.employee_id)) return;
        const cat = (s.category || '').toLowerCase();
        totalMins += s.total_minutes;
        if (!empProdMap[s.employee_id]) empProdMap[s.employee_id] = { prod: 0, total: 0 };
        empProdMap[s.employee_id].total += s.total_minutes;
        
        if (cat === 'productive') {
          productiveMins += s.total_minutes;
          empProdMap[s.employee_id].prod += s.total_minutes;
        }
      });
      
      let avgUtil = totalMins > 0 ? Math.round((productiveMins / totalMins) * 100) : 0;
      const avgHoursPerEmp = totalMins > 0 ? Math.round((totalMins / 60 / Math.max(1, Object.keys(empProdMap).length)) * 10) / 10 : 0;

      // 4. Needs Attention
      const lateEmpIds = new Set(todayAttendance?.filter(r => validEmpIds.has(r.employee_id) && r.status === 'late').map(r => r.employee_id) || []);
      const lowProdEmpIds = new Set();
      Object.keys(empProdMap).forEach(empId => {
        const stats = empProdMap[empId];
        if (stats.total > 0 && (stats.prod / stats.total) < 0.5) {
          lowProdEmpIds.add(empId);
        }
      });
      const attentionSet = new Set([...lateEmpIds, ...lowProdEmpIds]);
      let needsAttentionCount = attentionSet.size;

      return {
        avgUtilization: { value: avgUtil, previous: avgUtil, suffix: "%", secondary: `${avgHoursPerEmp}h / day` },
        attendanceRate: { value: attendanceRate, previous: attendanceRate, suffix: "%", secondary: `${presentCount} / ${totalEmpCount} On Duty` },
        activeEmployees: { value: activeCount, previous: activeCount, suffix: "", secondary: `Out of ${totalEmpCount} team members` },
        flaggedEmployees: { value: needsAttentionCount, previous: needsAttentionCount, suffix: "", secondary: "Requires manager review" },
      };
    } catch (err) {
      console.error('[Supabase] Error fetching dashboard KPIs:', err);
    }
  }

  return {
    avgUtilization: { value: 0, previous: 0, suffix: "%", secondary: "0h / day" },
    attendanceRate: { value: 0, previous: 0, suffix: "%", secondary: "0 / 0 On Duty" },
    activeEmployees: { value: 0, previous: 0, suffix: "", secondary: "Out of 0 team members" },
    flaggedEmployees: { value: 0, previous: 0, suffix: "", secondary: "Requires manager review" },
  };
}

export async function getHoursTrend() {
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
  
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('date, total_minutes');
      if (error) throw error;

      const dayStats = {};
      data?.forEach(s => {
        if (!dayStats[s.date]) dayStats[s.date] = 0;
        dayStats[s.date] += s.total_minutes;
      });

      const allTimes = Object.keys(dayStats).map(d => new Date(d).getTime()).filter(t => !isNaN(t));
      const refTime = allTimes.length > 0 ? Math.max(Date.now(), ...allTimes) : Date.now();
      const curr = new Date(refTime);
      const dayOfWeek = curr.getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
      const offsetToMonday = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);
      const mondayThisWeek = new Date(curr.getTime() + offsetToMonday * 24 * 60 * 60 * 1000);
      const mondayLastWeek = new Date(mondayThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

      const trend = [];
      for (let i = 0; i < 14; i++) {
        const d = new Date(mondayLastWeek.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = d.toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE });
        const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const displayDay = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        let mins = dayStats[dateStr] || 0;
        let hours = Math.round((mins / 60) * 10) / 10;

        trend.push({
          date: dateFormatted,
          displayDay,
          hours,
          rawDate: dateStr,
          isWeekend: displayDay === 'Sat' || displayDay === 'Sun',
          weekGroup: i < 7 ? 'prev_week' : 'this_week'
        });
      }

      return trend;
    } catch (err) {
      console.error('[Supabase] Error fetching hours trend:', err);
    }
  }

  return [];
}

export async function getDepartmentComparison() {
  if (isSupabaseConfigured) {
    try {
      const { data: employees, error: empErr } = await supabase
        .from('employees')
        .select('id, department');
      if (empErr) throw empErr;

      const { data: summaries, error: sumErr } = await supabase
        .from('screentime_daily_summary')
        .select('employee_id, category, total_minutes');
      if (sumErr) throw sumErr;

      if (employees && summaries) {
        const empDept = {};
        const deptEmpCounts = {};
        employees.forEach(e => {
          empDept[e.id] = e.department;
          deptEmpCounts[e.department] = (deptEmpCounts[e.department] || 0) + 1;
        });

        const deptProd = {};
        const deptTotal = {};
        summaries.forEach(s => {
          const dept = empDept[s.employee_id];
          if (dept) {
            deptTotal[dept] = (deptTotal[dept] || 0) + s.total_minutes;
            if (s.category === 'productive') {
              deptProd[dept] = (deptProd[dept] || 0) + s.total_minutes;
            }
          }
        });

        return Object.keys(deptEmpCounts).map(dept => {
          const total = deptTotal[dept] || 0;
          const prod = deptProd[dept] || 0;
          const utilization = total > 0 ? Math.round((prod / total) * 1000) / 10 : 0;
          return {
            department: dept,
            utilization,
            employees: deptEmpCounts[dept] || 1,
          };
        });
      }
    } catch (err) {
      console.error('[Supabase] Error fetching department comparison:', err);
    }
  }

  return [];
}

export async function getAppCategorySplit() {
  if (isSupabaseConfigured) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      let { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('category, total_minutes')
        .gte('date', sevenDaysAgo);
        
      if (error) throw error;

      if (data && data.length > 0) {
        let productive = 0;
        let neutral = 0;
        let distracting = 0;

        data.forEach(s => {
          const cat = (s.category || '').toLowerCase();
          if (cat === 'productive') productive += s.total_minutes;
          else if (cat === 'distracting') distracting += s.total_minutes;
          else neutral += s.total_minutes; 
        });

        const total = productive + neutral + distracting;
        if (total > 0) {
          return [
            { category: "Productive", value: productive, percentage: Math.round((productive / total) * 100), color: "#10B981", unit: " min" },
            { category: "Neutral", value: neutral, percentage: Math.round((neutral / total) * 100), color: "#3B82F6", unit: " min" },
            { category: "Distracting", value: distracting, percentage: Math.round((distracting / total) * 100), color: "#EF4444", unit: " min" },
          ];
        }
      }
    } catch (err) {
      console.error('[Supabase] Error fetching app category split:', err);
    }
  }

  return [];
}

export async function getAlerts() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      if (data) {
        return data.map(a => ({
          id: a.id,
          type: a.type,
          message: a.message,
          timestamp: a.timestamp,
          read: a.read,
        }));
      }
    } catch (err) {
      console.error('[Supabase] Error fetching alerts:', err);
    }
  }

  return [];
}
