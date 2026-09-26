import { CheckCircle2, XCircle, Clock, Home, Calendar, PieChart, Activity, AlertCircle, HelpCircle } from 'lucide-react';

/**
 * Status badge — bespoke pill shape with specific icons, borders, and typography.
 */
const STATUS_STYLES = {
  present: { bg: 'var(--color-success)', color: '#FFFFFF', label: 'Present' },
  absent: { bg: 'var(--color-danger)', color: '#FFFFFF', label: 'Absent' },
  late: { bg: 'var(--color-warning)', color: '#FFFFFF', label: 'Late' },
  half_day: { bg: 'var(--color-warning)', color: '#FFFFFF', label: 'Half-day' },
  on_leave: { bg: 'var(--color-neutral)', color: '#FFFFFF', label: 'On Leave' },
  on_break: { bg: '#F59E0B', color: '#FFFFFF', label: 'On Break' },
  wfh: { bg: 'var(--color-info)', color: '#FFFFFF', label: 'WFH' },
  active: { bg: 'var(--color-success)', color: '#FFFFFF', label: 'Active' },
  inactive: { bg: 'var(--color-neutral)', color: '#FFFFFF', label: 'Inactive' },
  productive: { bg: 'var(--color-success)', color: '#FFFFFF', label: 'Productive' },
  neutral: { bg: 'var(--color-info)', color: '#FFFFFF', label: 'Neutral' },
  distracting: { bg: 'var(--color-warning)', color: '#FFFFFF', label: 'Distracting' },
  success: { bg: 'var(--color-success)', color: '#FFFFFF', label: '' },
  warning: { bg: 'var(--color-warning)', color: '#FFFFFF', label: '' },
  danger: { bg: 'var(--color-danger)', color: '#FFFFFF', label: '' },
  info: { bg: 'var(--color-info)', color: '#FFFFFF', label: '' },
};

export default function StatusBadge({ status, label, size = 'sm', style = {} }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.neutral;
  const displayLabel = label || s.label || status;
  const isSmall = size === 'sm';
  const Icon = s.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '4px 10px' : '6px 14px',
        borderRadius: '0px',
        fontSize: isSmall ? '12px' : '13px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: isSmall ? '16px' : '18px',
        background: s.bg,
        color: s.color,
        border: 'none',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span>
        {displayLabel}
      </span>
    </span>
  );
}
