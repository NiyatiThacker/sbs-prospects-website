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
  Palmtree
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
];

const NAV_BOTTOM = [
  { path: '/settings', label: 'Settings', icon: 'Settings' },
  { path: '/', label: 'Back to Website', icon: 'Globe', external: true },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user } = useAuth();
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [pendingProjectsCount, setPendingProjectsCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'Admin') {
      const fetchCounts = async () => {
        const [reqs, projects] = await Promise.all([
          getLeaveRequests(),
          getProjects()
        ]);
        
        const pendingLeaves = reqs.filter(r => r.status === 'pending');
        setPendingLeavesCount(pendingLeaves.length);
        
        let pendingExt = 0;
        projects.forEach(p => {
          if (p.extension_requests && p.extension_requests.some(req => req.status === 'pending')) {
            pendingExt++;
          }
        });
        setPendingProjectsCount(pendingExt);
      };
      
      fetchCounts();
      const interval = setInterval(fetchCounts, 10000);
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
              background: 'rgba(0,0,0,0.4)',
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isMobile && collapsed ? 0 : (collapsed ? 110 : 260) }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          background: '#00B4D8', // Borcelle cyan blue
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          gap: '16px',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Logo Circle */}
        <Link to="/" style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#0F1115',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          textDecoration: 'none',
          cursor: 'pointer'
        }}>
          <Activity size={28} color="#fff" />
        </Link>

        {/* Nav Pill */}
        <motion.div 
          animate={{ 
            width: collapsed ? 64 : 210,
            alignItems: collapsed ? 'center' : 'stretch',
            paddingLeft: collapsed ? 0 : 16,
            paddingRight: collapsed ? 0 : 16,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            flex: 1,
            borderRadius: '40px',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 0', // Reduced padding
            gap: '8px',        // Reduced gap
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minHeight: 0
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

          <div style={{ flex: 1, minHeight: '12px' }} />

          {NAV_BOTTOM.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onNavigate={isMobile ? onToggle : undefined}
              collapsed={collapsed}
            />
          ))}

        </motion.div>
      </motion.aside>
    </>
  );
}

function SidebarLink({ item, active, onNavigate, collapsed, badge = 0 }) {
  const Icon = ICON_MAP[item.icon];
  const [isHovered, setIsHovered] = useState(false);

  const Component = item.external ? 'a' : NavLink;
  const linkProps = item.external ? { href: item.path } : { to: item.path, onClick: onNavigate };

  return (
    <div 
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        {...linkProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: collapsed ? '40px' : '100%',
          height: '40px',
          padding: collapsed ? '0' : '0 16px',
          gap: '12px',
          borderRadius: collapsed ? '50%' : '20px',
          color: active ? '#FFFFFF' : '#6B7280',
          background: active ? '#00B4D8' : 'transparent',
          textDecoration: 'none',
          transition: 'all 0.2s',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.color = '#111827';
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.color = '#6B7280';
        }}
      >
        {Icon && <Icon size={20} style={{ flexShrink: 0 }} />}
        
        {badge > 0 && collapsed && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '10px',
            height: '10px',
            background: 'var(--color-danger)',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        )}

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', flex: 1 }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge > 0 && (
                <span style={{
                  background: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  lineHeight: 1
                }}>
                  {badge}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </Component>

      <AnimatePresence>
        {isHovered && collapsed && (
          <motion.div
            initial={{ clipPath: 'inset(0 100% 0 0)', x: -20 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', x: 0 }}
            exit={{ clipPath: 'inset(0 100% 0 0)', x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              left: '40px',
              top: '50%',
              y: '-50%',
              background: '#FFFFFF',
              color: '#111827',
              padding: '8px 16px 8px 24px',
              borderRadius: '0 24px 24px 0',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              zIndex: -1,
              pointerEvents: 'none',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
