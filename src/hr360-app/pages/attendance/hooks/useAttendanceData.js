import { COMPANY_TIMEZONE, COMPANY_TIMEZONE_OFFSET_MINS, COMPANY_TIMEZONE_OFFSET_STR } from '@/hr360-app/config/timezone';
import { useState, useEffect, useMemo } from 'react';
import { getAttendance } from '@/hr360-app/services/attendanceService';

export default function useAttendanceData() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ date: new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE }) });

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setIsLoading(true);
        const attendanceData = await getAttendance(filters);
        if (!cancelled) {
          setRecords(attendanceData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [filters]);

  const summary = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        attendanceRate: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        targetDate: filters.date || new Date().toLocaleDateString('en-CA', { timeZone: COMPANY_TIMEZONE })
      };
    }

    const targetDate = records[0].date;
    const presentCount = records.filter(r => ['present', 'wfh', 'late', 'half_day'].includes(r.status)).length;
    const absentCount = records.filter(r => r.status === 'absent').length;
    const lateCount = records.filter(r => r.status === 'late').length;

    const totalCount = records.length;
    const attendanceRate = Math.round((presentCount / totalCount) * 100) || 0;

    return {
      attendanceRate,
      presentCount,
      absentCount,
      lateCount,
      targetDate
    };
  }, [records, filters.date]);

  return { records, summary, isLoading, error, filters, setFilters };
}
