import type { RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminHome from '../pages/admin/AdminHome'
import ProductionOrders from '@/features/ordenes/pages/ProductionOrders'
import SupervisorHome from '../pages/supervisor/SupervisorHome'
// import ShiftProgress from '../pages/supervisor/ShiftProgress'

export const dashboardRoutes: RouteObject = {
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [

    // ── Admin ──────────────────────────────────
    {
      element: <ProtectedRoute allowedRoles={['admin']} />,
      children: [
        { path: '/dashboard/admin', element: <AdminHome /> },
        { path: '/dashboard/admin/production-orders', element: <ProductionOrders /> },
      ],
    },

    // ── Supervisor ─────────────────────────────
    {
      element: <ProtectedRoute allowedRoles={['supervisor']} />,
      children: [
        { path: '/dashboard/supervisor', element: <SupervisorHome /> },
        // { path: '/dashboard/supervisor/shift-progress', element: <ShiftProgress /> },
      ],
    },

  ],
}