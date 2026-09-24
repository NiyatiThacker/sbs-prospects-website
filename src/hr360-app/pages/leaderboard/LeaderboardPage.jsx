import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import Card from '@/hr360-app/components/shared/ui/Card';
import Avatar from '@/hr360-app/components/shared/ui/Avatar';
import ProgressBar from '@/hr360-app/components/shared/ui/ProgressBar';
import Button from '@/hr360-app/components/shared/ui/Button';
import EmptyState from '@/hr360-app/components/shared/ui/EmptyState';
import { SkeletonTable } from '@/hr360-app/components/shared/ui/Skeleton';
import { DEPARTMENTS, TIME_PERIOD_LABELS } from '@/hr360-app/utils/constants';
import { formatHours } from '@/hr360-app/utils/formatters';
import { getScoreStatus } from '@/hr360-app/utils/productivityScore';
import { getLeaderboard } from '@/hr360-app/services/leaderboardService';

const TREND_ICONS = {
  up: <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />,
  down: <TrendingDown size={14} style={{ color: 'var(--color-danger)' }} />,
  same: <Minus size={14} style={{ color: 'var(--color-neutral)' }} />,
};

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

const getTrendPercentage = (emp) => {
  if (emp.trend === 'same') return '0%';
  const hash = emp.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `${(hash % 15) + 2}%`;
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [period, setPeriod] = useState('weekly');
  const [expandedEmpId, setExpandedEmpId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const result = await getLeaderboard({ department: department || undefined, period });
      if (!cancelled) { setData(result); setIsLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [department, period]);

  if (isLoading) return <PageContainer><SkeletonTable rows={10} cols={5} /></PageContainer>;

  const top3 = data.slice(0, 3);

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Formula Explanation */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px' }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--color-text-secondary)', 
            background: 'var(--color-surface)', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', 
            maxWidth: '400px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={14} style={{ color: 'var(--color-primary)' }} />
              How is the Leaderboard Score calculated?
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Score</strong> = (40% × Hours) + (35% × Productivity) + (25% × Attendance)
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, lineHeight: 1.4 }}>
              {data.length > 0 ? (
                <>
                  <em>Example ({data[0].name}):</em> (0.40 × {data[0].breakdown.hours} pts) + (0.35 × {data[0].breakdown.apps} pts) + (0.25 × {data[0].breakdown.attendance} pts) = <strong>{data[0].score}</strong> points
                </>
              ) : (
                <>
                  <em>Example:</em> If an employee gets 100% on all metrics, their score is <strong>100</strong>.
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Podium */}
        {top3.length === 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'flex-end', padding: '4px 0' }}>
            {[top3[1], top3[0], top3[2]].map((emp, i) => {
              const actualIndex = i === 0 ? 1 : i === 1 ? 0 : 2;
              const heights = [110, 150, 90];
              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <Avatar name={emp.name} size={actualIndex === 0 ? 56 : 48} />
                  <div style={{
                    fontSize: actualIndex === 0 ? '15px' : '13px',
                    fontWeight: 600, marginTop: '8px', textAlign: 'center',
                    color: 'var(--color-text-primary)',
                  }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{emp.department}</div>
                  <div style={{
                    fontSize: actualIndex === 0 ? '24px' : '20px',
                    fontWeight: 700, fontFeatureSettings: '"tnum"',
                    color: MEDAL_COLORS[actualIndex], marginTop: '4px',
                  }}>
                    {emp.score}
                  </div>
                  <div style={{
                    width: actualIndex === 0 ? '120px' : '100px',
                    height: `${heights[i]}px`,
                    borderRadius: '12px 12px 0 0',
                    marginTop: '8px',
                    background: `linear-gradient(180deg, ${MEDAL_COLORS[actualIndex]}30 0%, ${MEDAL_COLORS[actualIndex]}10 100%)`,
                    border: `1px solid ${MEDAL_COLORS[actualIndex]}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trophy size={actualIndex === 0 ? 28 : 22} style={{ color: MEDAL_COLORS[actualIndex] }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <Card padding="12px 16px">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['daily', 'weekly', 'monthly', 'quarterly'].map(p => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'primary' : 'ghost'}
                onClick={() => setPeriod(p)}
              >
                {TIME_PERIOD_LABELS[p]}
              </Button>
            ))}
            <div style={{ flex: 1 }} />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </Card>

        {/* Full leaderboard table */}
        <Card padding="0">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  {['Rank', 'Employee', 'Department', 'Score', 'Hours', 'Productivity', 'Attendance', ''].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '12px',
                      textTransform: 'uppercase', letterSpacing: '0.5px', color: '#FFFFFF',
                      background: '#00B4D8', borderBottom: 'none',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((emp) => (
                  <Fragment key={emp.id}>
                    <tr
                      key={emp.id}
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      style={{
                        cursor: 'pointer', transition: 'background 0.2s',
                        background: emp.rank <= 3 ? `${MEDAL_COLORS[emp.rank - 1]}08` : (expandedEmpId === emp.id ? 'var(--color-bg)' : 'transparent'),
                        borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = emp.rank <= 3 ? `${MEDAL_COLORS[emp.rank - 1]}08` : (expandedEmpId === emp.id ? 'var(--color-bg)' : 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 700, width: '60px', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <span style={{
                          color: emp.rank <= 3 ? MEDAL_COLORS[emp.rank - 1] : 'var(--color-text-secondary)',
                          fontSize: emp.rank <= 3 ? '16px' : '14px',
                        }}>
                          #{emp.rank}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name={emp.name} size={32} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{emp.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{emp.role}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        {emp.department}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                          <ProgressBar value={emp.score} max={100} height={6} style={{ flex: 1, maxWidth: '80px' }} animated={false} />
                          <span style={{ fontWeight: 600, fontFeatureSettings: '"tnum"', color: `var(--color-${getScoreStatus(emp.score)})` }}>
                            {emp.score}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFeatureSettings: '"tnum"', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        {formatHours(emp.hoursWorked)} / {formatHours(emp.hoursAllotted)}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                          <ProgressBar value={emp.breakdown.apps} max={100} height={6} style={{ flex: 1, maxWidth: '60px' }} animated={false} />
                          <span style={{ fontWeight: 600, fontSize: '13px', fontFeatureSettings: '"tnum"', color: 'var(--color-text-secondary)' }}>
                            {emp.breakdown.apps}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                          <ProgressBar value={emp.breakdown.attendance} max={100} height={6} style={{ flex: 1, maxWidth: '60px' }} animated={false} />
                          <span style={{ fontWeight: 600, fontSize: '13px', fontFeatureSettings: '"tnum"', color: 'var(--color-text-secondary)' }}>
                            {emp.breakdown.attendance}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', borderBottom: expandedEmpId === emp.id ? 'none' : '1px solid var(--color-border)' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedEmpId(expandedEmpId === emp.id ? null : emp.id);
                          }}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--color-text-secondary)', padding: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          {expandedEmpId === emp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    {expandedEmpId === emp.id && (
                      <tr style={{ background: 'var(--color-bg)' }}>
                        <td colSpan={8} style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Hours Score (40% Weight)</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ProgressBar value={emp.breakdown.hours} max={100} height={8} style={{ flex: 1 }} animated={false} />
                                <span style={{ fontWeight: 600, fontSize: '15px', fontFeatureSettings: '"tnum"' }}>{emp.breakdown.hours} pts</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Based on {formatHours(emp.hoursWorked)} of {formatHours(emp.hoursAllotted)} hours logged.</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Productivity Score (35% Weight)</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ProgressBar value={emp.breakdown.apps} max={100} height={8} style={{ flex: 1 }} animated={false} />
                                <span style={{ fontWeight: 600, fontSize: '15px', fontFeatureSettings: '"tnum"' }}>{emp.breakdown.apps} pts</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Based on percentage of productive app usage.</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Attendance Score (25% Weight)</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ProgressBar value={emp.breakdown.attendance} max={100} height={8} style={{ flex: 1 }} animated={false} />
                                <span style={{ fontWeight: 600, fontSize: '15px', fontFeatureSettings: '"tnum"' }}>{emp.breakdown.attendance} pts</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Based on punctuality and shift compliance.</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
