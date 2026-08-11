import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import OrdenesPage from '@/features/ordenes/pages/OrdenesPage'
import Usuarios from '@/features/usuarios/pages/Usuarios'
import AuditLog from '@/features/auditLogs/pages/AuditLog'
import Operadores from '@/features/catalogo/pages/Operadores'
import Maquinas from '@/features/catalogo/pages/Maquinas'
import MotivosParo from '@/features/catalogo/pages/MotivosParo'
import Productos from '@/features/catalogo/pages/Productos'
import Pigmentos from '@/features/catalogo/pages/Pigmentos'
import MateriasPrimas from '@/features/catalogo/pages/MateriasPrimas'
import MateriasPrimasInventario from '@/features/inventory/pages/MateriasPrimasInventario'
import PigmentosInventario from '@/features/inventory/pages/PigmentosInventario'
import ProductoInventario from '@/features/inventory/pages/ProductoInventario'
import AvancesTurno from '@/features/avancesTurno/pages/supervisor/AvancesTurno'
import SeguimientoOrdenes from '@/features/avancesTurno/pages/admin/SeguimientoOrdenes'
import MolinoAdmin from '@/features/molino/Pages/admin/MolinoAdmin'
import Reportes from '@/features/reportes/pages/Reportes'
import MolinoPendientes from '@/features/molino/Pages/molino/MolinoPendientes'
import PigmentosOrdenes from '@/features/pigmentos/pages/pigmentos/PigmentosOrdenes'
import Ordenes from '@/features/avancesTurno/pages/supervisor/Ordenes'
import MolinoRegistrar from '@/features/molino/Pages/molino/MolinoRegistrar'
import PigmentosAlertas from '@/features/pigmentos/pages/pigmentos/PigmentosAlertas'
import PedidosPage from '@/features/pedidos/pages/PedidosPage'
import PedidoDetallePage from '@/features/pedidos/pages/PedidoDetallePage'
import OrdenDetallePage from '@/features/ordenes/pages/OrdenDetallePage'
import MolidoInventario from '@/features/inventory/pages/MolidoInventario'
import DefectosProducto from '@/features/catalogo/pages/DefectosProductos'
import ColoresSolidosPage from '@/features/catalogo/pages/ColoresSolidosPage'

export const dashboardRoutes: RouteObject[] = [
  // ── Admin ──────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'pedidos', element: <PedidosPage /> },
          { path: 'pedidos/:id', element: <PedidoDetallePage /> },
          { path: 'ordenes', element: <OrdenesPage /> },
          { path: 'ordenes/:id', element: <OrdenDetallePage /> },
          { path: 'avances-turno', element: <SeguimientoOrdenes /> },
          { path: 'molino', element: <MolinoAdmin /> },
          { path: 'materias-primas', element: <MateriasPrimasInventario /> },
          { path: 'molido', element: <MolidoInventario /> },
          { path: 'pigmentos', element: <PigmentosInventario /> },
          { path: 'producto-terminado', element: <ProductoInventario /> },
          { path: 'productos', element: <Productos /> },
          { path: 'materia-prima-catalogo', element: <MateriasPrimas /> },
          { path: 'pigmentos-catalogo', element: <Pigmentos /> },
          { path: 'operadores', element: <Operadores /> },
          { path: 'maquinas', element: <Maquinas /> },
          { path: 'motivos-paro', element: <MotivosParo /> },
          { path: 'colores-solidos', element: <ColoresSolidosPage /> },
          { path: 'defectos-productos', element: <DefectosProducto /> },
          { path: 'reportes', element: <Reportes /> },
          { path: 'usuarios', element: <Usuarios /> },
          { path: 'auditoria', element: <AuditLog /> }, 
        ],
      },
    ],
  },

  {
    path: '/programador',
    element: <ProtectedRoute allowedRoles={['PROGRAMADOR']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'pedidos', element: <PedidosPage /> },
          { path: 'pedidos/:id', element: <PedidoDetallePage /> },
          { path: 'ordenes', element: <OrdenesPage /> },
          { path: 'ordenes/:id', element: <OrdenDetallePage /> },
        ]
      }
    ]
  },

  // ── Supervisor ─────────────────────────────
  {
    path: '/supervisor',
    element: <ProtectedRoute allowedRoles={['SUPERVISOR']} />,
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
    element: <ProtectedRoute allowedRoles={['MOLINO']} />,
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
    element: <ProtectedRoute allowedRoles={['PIGMENTOS']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="inicio" replace /> },
          { path: 'ordenes', element: <PigmentosOrdenes /> },
          { path: 'alertas', element: <PigmentosAlertas /> },
        ],
      },
    ],
  },
]