import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import OrdenesProduccion from '@/features/ordenes/pages/OrdenesProduccion'
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard'
import Usuarios from '@/features/usuarios/pages/Usuarios'
import AuditLog from '@/features/auditLogs/pages/AuditLog'
import Operadores from '@/features/catalogo/pages/Operadores'
import Maquinas from '@/features/catalogo/pages/Maquinas'
import FormulaPigmentos from '@/features/catalogo/pages/FormulasPigmento'
import MotivosParo from '@/features/catalogo/pages/MotivosParo'
import Productos from '@/features/catalogo/pages/Productos'
import Pigmentos from '@/features/catalogo/pages/Pigmentos'
import MateriasPrimas from '@/features/catalogo/pages/MateriasPrimas'
import MateriasPrimasInventario from '@/features/inventory/pages/MateriasPrimasInventario'
import PigmentosInventario from '@/features/inventory/pages/PigmentosInventario'
import ProductoInventario from '@/features/inventory/pages/ProductoTerminado'

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
          { path: 'ordenes', element: <OrdenesProduccion /> },
          { path: 'avances-turno', element: <OrdenesProduccion /> },
          { path: 'tiempos-paro', element: <OrdenesProduccion /> },
          { path: 'molino', element: <OrdenesProduccion /> },
          { path: 'materias-primas', element: <MateriasPrimasInventario /> },
          { path: 'pigmentos', element: <PigmentosInventario /> },
          { path: 'producto-terminado', element: <ProductoInventario /> },
          { path: 'productos', element: <Productos /> },
          { path: 'maquinas', element: <Maquinas /> },
          { path: 'operadores', element: <Operadores /> },
          { path: 'formulas-pigmentos', element: <FormulaPigmentos /> },
          { path: 'materia-prima-catalogo', element: <MateriasPrimas /> },
          { path: 'pigmentos-catalogo', element: <Pigmentos /> },
          { path: 'motivos-paro', element: <MotivosParo /> },
          { path: 'reportes', element: <OrdenesProduccion /> },
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