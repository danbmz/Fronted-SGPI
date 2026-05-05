import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ProductionOrders from '@/features/ordenes/pages/ProductionOrders'
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard'
import Usuarios from '@/features/usuarios/pages/Usuarios'
// import ShiftProgress from '../pages/supervisor/ShiftProgress'

export const dashboardRoutes: RouteObject[] = [
  // ── Admin ──────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'ordenes', element: <ProductionOrders /> },
          { path: 'avances-turno', element: <ProductionOrders /> },
          { path: 'tiempos-paro', element: <ProductionOrders /> },
          { path: 'molino', element: <ProductionOrders /> },
          { path: 'materias-primas', element: <ProductionOrders /> },
          { path: 'pigmentos', element: <ProductionOrders /> },
          { path: 'producto-terminado', element: <ProductionOrders /> },
          { path: 'productos', element: <ProductionOrders /> },
          { path: 'maquinas', element: <ProductionOrders /> },
          { path: 'operadores', element: <ProductionOrders /> },
          { path: 'formulas-pigmentos', element: <ProductionOrders /> },
          { path: 'reportes', element: <ProductionOrders /> },
          { path: 'usuarios', element: <Usuarios /> },
          { path: 'auditoria', element: <ProductionOrders /> }, 
        ],
      },
    ],
  },

  // ── Supervisor ─────────────────────────────
  {
    path: '/supervisor',
    element: <ProtectedRoute allowedRoles={['supervisor']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'dashboard', element: <SupervisorDashboard /> },
        ],
      },
    ],
  },
]