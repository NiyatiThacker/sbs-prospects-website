import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AdminRoute from '@/hr360-app/components/shared/layout/AdminRoute';

// ── Lazy-loaded page components (route-level code splitting) ──────────────
const DashboardPage = lazy(() => import('@/hr360-app/pages/dashboard/DashboardPage'));
const AttendancePage = lazy(() => import('@/hr360-app/pages/attendance/AttendancePage'));
const EmployeeDirectoryPage = lazy(() => import('@/hr360-app/pages/employees/EmployeeDirectoryPage'));
const EmployeeDetailPage = lazy(() => import('@/hr360-app/pages/employees/EmployeeDetailPage'));
const LeaderboardPage = lazy(() => import('@/hr360-app/pages/leaderboard/LeaderboardPage'));
const ApplicationsPage = lazy(() => import('@/hr360-app/pages/applications/ApplicationsPage'));
const ReportsPage = lazy(() => import('@/hr360-app/pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('@/hr360-app/pages/settings/SettingsPage'));
const NotificationsPage = lazy(() => import('@/hr360-app/pages/notifications/NotificationsPage'));
const ProjectsPage = lazy(() => import('@/hr360-app/pages/projects/ProjectsPage'));
const IssuesPage = lazy(() => import('@/hr360-app/pages/issues/IssuesPage'));
const LoginPage = lazy(() => import('@/hr360-app/pages/auth/LoginPage'));
const UpdatePasswordPage = lazy(() => import('@/hr360-app/pages/auth/UpdatePasswordPage'));

/**
 * Page loading fallback — lightweight skeleton, not a spinner.
 */
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-brand)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: '13px' }}>Loading…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/update-password',
    element: withSuspense(UpdatePasswordPage),
  },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'dashboard', element: <Navigate to="/" replace /> },
      { path: 'attendance', element: withSuspense(AttendancePage) },
      { path: 'employees', element: <AdminRoute>{withSuspense(EmployeeDirectoryPage)}</AdminRoute> },
      { path: 'employees/:id', element: <AdminRoute>{withSuspense(EmployeeDetailPage)}</AdminRoute> },
      { path: 'leaderboard', element: withSuspense(LeaderboardPage) },
      { path: 'applications', element: withSuspense(ApplicationsPage) },
      { path: 'projects', element: withSuspense(ProjectsPage) },
      { path: 'reports', element: <AdminRoute>{withSuspense(ReportsPage)}</AdminRoute> },
      { path: 'issues', element: <AdminRoute>{withSuspense(IssuesPage)}</AdminRoute> },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
    ],
  },
], {
  basename: "/hr360"
});
