import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Trophy,
  AppWindow,
  FileBarChart,
  Settings,
  Bell,
  Activity,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  AlertTriangle,
  Globe,
  Palmtree,
  LogOut
} from 'lucide-react';
import { useMediaQuery } from '@/hr360-app/hooks/useMediaQuery';
import { useAuth } from '@/hr360-app/context/AuthContext';
import { getLeaveRequests } from '@/hr360-app/services/leaveService';
import { getProjects } from '@/hr360-app/services/projectsService';

const ICON_MAP = {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Trophy,
  AppWindow,
  FileBarChart,
  Settings,
  Bell,
  MessageSquare,
  Briefcase,
  AlertTriangle,
  Globe,
  Palmtree
};

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['Admin', 'Employee'] },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck', roles: ['Admin', 'Employee'] },
  { path: '/employees', label: 'Employees', icon: 'Users', roles: ['Admin'] },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy', roles: ['Admin', 'Employee'] },
  { path: '/projects', label: 'Projects', icon: 'Briefcase', roles: ['Admin', 'Employee'] },
  { path: '/applications', label: 'Applications', icon: 'AppWindow', roles: ['Admin', 'Employee'] },
  { path: '/leave-requests', label: 'Leave Requests', icon: 'Palmtree', roles: ['Admin'] },
  { path: '/reports', label: 'Reports', icon: 'FileBarChart', roles: ['Admin'] },
  { path: '/issues', label: 'Reported Issues', icon: 'AlertTriangle', roles: ['Admin'] },
  { path: '/broadcasts', label: 'Broadcasts', icon: 'Bell', roles: ['Admin'] },
  { path: '/settings', label: 'Settings', icon: 'Settings', roles: ['Admin'] },
  { path: '/website', label: 'Back to Website', icon: 'Globe', roles: ['Admin', 'Employee'], external: true },
];

export default function Sidebar({ collapsed, onToggle }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  const { user } = useAuth();
  
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [pendingProjectsCount, setPendingProjectsCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'Admin') {
      const fetchCounts = async () => {
        try {
          const lReqs = await getLeaveRequests();
          setPendingLeavesCount(lReqs.filter(r => r.status === 'pending').length);
          const pReqs = await getProjects();
          setPendingProjectsCount(pReqs.filter(r => r.status === 'pending').length);
        } catch(e) {}
      };
      fetchCounts();
      const interval = setInterval(fetchCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isMobile && collapsed ? 0 : (collapsed ? 80 : 280) }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          background: '#030712', // Ultra dark premium background
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          flexShrink: 0,
          overflow: 'hidden'
        }}
      >
        {/* Brand Header */}
        <div style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 4px 12px rgba(99, 102, 241, 0.3)',
              flexShrink: 0
            }}>
              <Activity size={20} color="#fff" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  style={{ color: '#fff', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}
                >
                  HR360
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {NAV_ITEMS.filter(item => item.roles.includes(user?.role || 'Admin')).map((item) => {
            let badge = 0;
            if (item.label === 'Leave Requests') badge = pendingLeavesCount;
            if (item.label === 'Projects') badge = pendingProjectsCount;
            
            return (
              <SidebarLink
                key={item.path}
                item={item}
                active={isActive(item.path)}
                onNavigate={isMobile ? onToggle : undefined}
                collapsed={collapsed}
                badge={badge}
              />
            );
          })}
        </div>

        {/* Footer Toggle */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          background: 'rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={onToggle}
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: 'none', color: '#94A3B8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarLink({ item, active, onNavigate, collapsed, badge = 0 }) {
  const Icon = ICON_MAP[item.icon];
  const Component = item.external ? 'a' : NavLink;
  const linkProps = item.external ? { href: item.path } : { to: item.path, onClick: onNavigate };

  return (
    <div style={{ position: 'relative' }}>
      <Component
        {...linkProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: '100%',
          height: '44px',
          padding: collapsed ? '0' : '0 16px',
          gap: '12px',
          borderRadius: '10px',
          color: active ? '#FFFFFF' : '#94A3B8',
          background: active ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
          borderLeft: active ? '4px solid #818CF8' : '4px solid transparent',
          textDecoration: 'none',
          transition: 'all 0.2s',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = '#F8FAFC';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {Icon && (
          <Icon 
            size={20} 
            style={{ 
              flexShrink: 0, 
              color: active ? '#818CF8' : 'inherit',
              transition: 'color 0.2s'
            }} 
          />
        )}
        
        {badge > 0 && collapsed && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px',
            background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 0 2px #0F172A'
          }} />
        )}

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
              style={{ whiteSpace: 'nowrap', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', flex: 1 }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge > 0 && (
                <span style={{
                  background: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 'bold',
                  padding: '2px 6px', borderRadius: '10px', minWidth: '20px', textAlign: 'center'
                }}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </Component>
    </div>
  );
}
