import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ProductionOrders from '@/features/ordenes/pages/ProductionOrders'
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard'
import Usuarios from '@/features/usuarios/pages/Usuarios'
import AuditLog from '@/features/auditLogs/pages/AuditLog'
import Operadores from '@/features/catalogo/pages/Operadores'
import Maquinas from '@/features/catalogo/pages/Maquinas'
import FormulaPigmentos from '@/features/catalogo/pages/FormulasPigmento'
import MateriaPrima from '@/features/catalogo/pages/MateriaPrima'
import MotivosParo from '@/features/catalogo/pages/MotivosParo'
import Productos from '@/features/catalogo/pages/Productos'
import Pigmentos from '@/features/catalogo/pages/Pigmentos'

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
          { path: 'productos', element: <Productos /> },
          { path: 'maquinas', element: <Maquinas /> },
          { path: 'operadores', element: <Operadores /> },
          { path: 'formulas-pigmentos', element: <FormulaPigmentos /> },
          { path: 'materia-prima-catalogo', element: <MateriaPrima /> },
          { path: 'pigmentos-catalogo', element: <Pigmentos /> },
          { path: 'motivos-paro', element: <MotivosParo /> },
          { path: 'reportes', element: <ProductionOrders /> },
          { path: 'usuarios', element: <Usuarios /> },
          { path: 'auditoria', element: <AuditLog /> }, 
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