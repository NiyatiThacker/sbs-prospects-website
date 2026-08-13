import { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { useMediaQuery } from '@/hr360-app/hooks/useMediaQuery';
import { useAuth } from '@/hr360-app/context/AuthContext';

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
  Globe
};

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['Admin', 'Employee'] },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck', roles: ['Admin', 'Employee'] },
  { path: '/employees', label: 'Employees', icon: 'Users', roles: ['Admin'] },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy', roles: ['Admin', 'Employee'] },
  { path: '/projects', label: 'Projects', icon: 'Briefcase', roles: ['Admin', 'Employee'] },
  { path: '/applications', label: 'Applications', icon: 'AppWindow', roles: ['Admin', 'Employee'] },
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
            padding: '24px 0',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          {NAV_ITEMS.filter(item => item.roles.includes(user?.role || 'Admin')).map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onNavigate={isMobile ? onToggle : undefined}
              collapsed={collapsed}
            />
          ))}

          <div style={{ flex: 1 }} />

          {NAV_BOTTOM.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onNavigate={isMobile ? onToggle : undefined}
              collapsed={collapsed}
            />
          ))}

          {/* User Avatar & Toggle */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '2px solid rgba(255,255,255,0.1)',
              flexShrink: 0
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>

            <button 
              onClick={onToggle}
              style={{
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                color: '#4B5563',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}

function SidebarLink({ item, active, onNavigate, collapsed }) {
  const Icon = ICON_MAP[item.icon];
  const [isHovered, setIsHovered] = useState(false);

  const Component = item.external ? 'a' : NavLink;
  const linkProps = item.external ? { href: item.path } : { to: item.path, onClick: onNavigate };

  return (
    <div 
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Component
        {...linkProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: collapsed ? '44px' : '100%',
          height: '44px',
          padding: collapsed ? '0' : '0 16px',
          gap: '12px',
          borderRadius: collapsed ? '50%' : '22px',
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
        
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: '13px' }}
            >
              {item.label}
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
              left: '44px',
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
