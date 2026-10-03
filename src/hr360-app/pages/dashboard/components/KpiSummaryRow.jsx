import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, UserCheck, AlertTriangle, MoreHorizontal, ExternalLink, RefreshCw, Bell, CheckCircle2 } from 'lucide-react';

export default function KpiSummaryRow({ kpis }) {
  const [activeMenu, setActiveMenu] = useState(null); // card index or null
  const [toggleState, setToggleState] = useState({}); // map of index -> boolean (false = default value, true = secondary value)
  const [toastMessage, setToastMessage] = useState(null);
  const menuRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (activeMenu !== null && menuRefs.current[activeMenu] && !menuRefs.current[activeMenu].contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  if (!kpis) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getTrend = (current, previous, reverse = false) => {
    if (!previous || previous === 0) return { trend: 0, isPositive: true };
    const diff = current - previous;
    const percent = (Math.abs(diff) / previous) * 100;
    // For normal metrics, diff >= 0 is positive (green). For attention count, diff <= 0 is positive!
    const isPositive = reverse ? diff <= 0 : diff >= 0;
    return { trend: percent.toFixed(1), isPositive, isUp: diff >= 0 };
  };

  const cards = [
    {
      title: 'Productivity Ratio',
      value: `${Math.round(kpis.avgUtilization.value)}%`,
      secondaryValue: kpis.avgUtilization.secondary || '7.4h / day',
      ...getTrend(kpis.avgUtilization.value, kpis.avgUtilization.previous),
      icon: <Clock size={22} color="white" />,
      color: '#4F46E5', // Indigo
      navTarget: '/leaderboard',
      navLabel: 'View Productivity Leaderboard',
      toggleLabel: 'Switch to Daily Hours View',
    },
    {
      title: 'Attendance Rate',
      value: `${Math.round(kpis.attendanceRate.value)}%`,
      secondaryValue: kpis.attendanceRate.secondary || '25 / 27 On Duty',
      ...getTrend(kpis.attendanceRate.value, kpis.attendanceRate.previous),
      icon: <UserCheck size={22} color="white" />,
      color: '#0284C7', // Sky Blue
      navTarget: '/attendance',
      navLabel: 'View Attendance Roster',
      toggleLabel: 'Switch to Headcount View',
    },
    {
      title: 'Active Employees',
      value: Math.round(kpis.activeEmployees.value),
      secondaryValue: kpis.activeEmployees.secondary || 'Out of 27 team members',
      ...getTrend(kpis.activeEmployees.value, kpis.activeEmployees.previous),
      icon: <Users size={22} color="white" />,
      color: '#059669', // Emerald Green
      navTarget: '/employees',
      navLabel: 'View Online Team Directory',
      toggleLabel: 'Toggle Detailed Ratio',
    },
    {
      title: 'Needs Attention',
      value: Math.round(kpis.flaggedEmployees.value),
      secondaryValue: kpis.flaggedEmployees.secondary || 'Requires manager review',
      ...getTrend(kpis.flaggedEmployees.value, kpis.flaggedEmployees.previous, true),
      icon: <AlertTriangle size={22} color="white" />,
      color: '#DC2626', // Red
      navTarget: '/notifications',
      navLabel: 'Review Alert Logs',
      toggleLabel: 'Toggle Status Note',
      actionLabel: 'Send Reminder Notification',
      onAction: () => showToast('Automated reminder alerts dispatched to flagged employees!'),
    },
  ];

  const toggleCardView = (index) => {
    setToggleState(prev => ({ ...prev, [index]: !prev[index] }));
    setActiveMenu(null);
  };

  return (
    <>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#111827',
          color: '#F9FAFB',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 500,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
      }}>
        {cards.map((card, i) => {
          const isToggled = toggleState[i];
          const displayVal = isToggled ? card.secondaryValue : card.value;

          return (
            <div key={i} style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: card.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 12px ${card.color}33`
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
                    {card.title}
                  </h3>
                </div>

                {/* Options Menu Button */}
                <div ref={el => menuRefs.current[i] = el} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === i ? null : i)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '6px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="More Options"
                  >
                    <MoreHorizontal size={20} color="#6B7280" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === i && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      zIndex: 50,
                      width: '210px',
                      padding: '6px 0',
                      marginTop: '6px'
                    }}>
                      <button
                        onClick={() => toggleCardView(i)}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          padding: '10px 16px', textAlign: 'left', fontSize: '13px',
                          color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <RefreshCw size={15} color="#6B7280" />
                        <span>{isToggled ? "Show Default Metric" : card.toggleLabel}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenu(null);
                          navigate(card.navTarget);
                        }}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          padding: '10px 16px', textAlign: 'left', fontSize: '13px',
                          color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <ExternalLink size={15} color="#6B7280" />
                        <span>{card.navLabel}</span>
                      </button>

                      {card.actionLabel && (
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            if (card.onAction) card.onAction();
                          }}
                          style={{
                            width: '100%', background: 'transparent', border: 'none',
                            padding: '10px 16px', textAlign: 'left', fontSize: '13px',
                            color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            borderTop: '1px solid #F3F4F6', marginTop: '4px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Bell size={15} color="#DC2626" />
                          <span>{card.actionLabel}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Metric Value */}
              <div style={{ 
                fontSize: isToggled && card.secondaryValue.length > 8 ? '22px' : '32px', 
                fontWeight: 800, 
                color: '#111827', 
                marginBottom: '16px',
                letterSpacing: '-0.5px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}>
                {displayVal}
              </div>
              
              {/* Trend Comparison Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <div style={{
                  background: (i === 3 || !card.isPositive) ? '#FEF2F2' : '#ECFDF5',
                  color: (i === 3 || !card.isPositive) ? '#DC2626' : '#059669',
                  padding: '4px 10px', borderRadius: '14px',
                  fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {card.isUp ? '↑' : '↓'} {Math.abs(card.trend)}%
                </div>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                  {i === 3 ? (!card.isUp ? 'Fewer than last week' : 'From last week') : 'From last week'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
