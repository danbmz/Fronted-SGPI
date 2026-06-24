import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import OrdenesProduccion from '@/features/ordenes/pages/OrdenesProduccion'
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
import AvancesTurno from '@/features/avancesTurno/pages/supervisor/AvancesTurno'
import SeguimientoOrdenes from '@/features/avancesTurno/pages/admin/SeguimientoOrdenes'
import MolinoAdmin from '@/features/molino/Pages/admin/MolinoAdmin'
import Reportes from '@/features/reportes/pages/Reportes'
import MolinoPendientes from '@/features/molino/Pages/molino/MolinoPendientes'
import PigmentosOrdenes from '@/features/pigmentos/pages/PigmentosOrdenes'
import Ordenes from '@/features/avancesTurno/pages/supervisor/Ordenes'
import MolinoRegistrar from '@/features/molino/Pages/molino/MolinoRegistrar'

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
          { path: 'avances-turno', element: <SeguimientoOrdenes /> },
          { path: 'molino', element: <MolinoAdmin /> },
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
          { path: 'reportes', element: <Reportes /> },
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
          { path: 'avances', element: <AvancesTurno /> },
          { path: 'ordenes', element: <Ordenes /> },
        ],
      },
    ],
  },

  // ── Molino ─────────────────────────────
  {
    path: '/molino',
    element: <ProtectedRoute allowedRoles={['molino']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'pendientes', element: <MolinoPendientes /> },
          { path: 'registrar', element: <MolinoRegistrar /> },
        ],
      },
    ],
  },

  // ── Pigmentos ─────────────────────────────
  {
    path: '/pigmentos',
    element: <ProtectedRoute allowedRoles={['pigmentos']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'ordenes', element: <PigmentosOrdenes /> },
          { path: 'alertas', element: <AvancesTurno /> },
          { path: 'formulas', element: <AvancesTurno /> },
        ],
      },
    ],
  },
]