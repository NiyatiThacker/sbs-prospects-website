/**
 * Placeholder productivity score calculator.
 * PRD Open Question #1: exact formula TBD — this is a reasonable default.
 *
 * Composite score (0–100) = weighted sum of:
 *   - Hours utilization (40%): actual hours / allotted hours
 *   - Productive app ratio (35%): productive app time / total app time
 *   - Attendance consistency (25%): present days / total working days
 */

import { SCORE_WEIGHTS } from './constants';

/**
 * Calculate the productivity score for an employee.
 * @param {Object} params
 * @param {number} params.hoursWorked - Total hours worked in the period
 * @param {number} params.hoursAllotted - Total allotted hours in the period
 * @param {number} params.productiveMinutes - Minutes on productive apps
 * @param {number} params.totalAppMinutes - Total tracked app minutes
 * @param {number} params.presentDays - Days employee was present
 * @param {number} params.totalWorkDays - Total working days in the period
 * @returns {{ score: number, breakdown: { hours: number, apps: number, attendance: number } }}
 */
export function calculateProductivityScore({
  hoursWorked = 0,
  hoursAllotted = 1,
  productiveMinutes = 0,
  totalAppMinutes = 1,
  presentDays = 0,
  totalWorkDays = 1,
}) {
  // Each sub-score is clamped to 0–100. Handle 0 denominators to avoid NaN/Infinity.
  const hoursScore = hoursAllotted > 0 ? Math.min(100, (hoursWorked / hoursAllotted) * 100) : 0;
  const appsScore = totalAppMinutes > 0 ? Math.min(100, (productiveMinutes / totalAppMinutes) * 100) : 0;
  const attendanceScore = totalWorkDays > 0 ? Math.min(100, (presentDays / totalWorkDays) * 100) : 0;

  const composite =
    hoursScore * SCORE_WEIGHTS.HOURS_UTILIZATION +
    appsScore * SCORE_WEIGHTS.PRODUCTIVE_APP_RATIO +
    attendanceScore * SCORE_WEIGHTS.ATTENDANCE_CONSISTENCY;

  return {
    score: Math.round(composite * 10) / 10, // one decimal
    breakdown: {
      hours: Math.round(hoursScore * 10) / 10,
      apps: Math.round(appsScore * 10) / 10,
      attendance: Math.round(attendanceScore * 10) / 10,
    },
  };
}

/**
 * Get a label for a productivity score.
 * @param {number} score - 0–100
 * @returns {'Excellent'|'Good'|'Needs Attention'|'Low'}
 */
export function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Needs Attention';
  return 'Low';
}

/**
 * Get the status color token for a productivity score.
 * @param {number} score - 0–100
 * @returns {'success'|'warning'|'danger'}
 */
export function getScoreStatus(score) {
  if (score >= 75) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}
