import { Navigate, type RouteObject } from 'react-router-dom'
import ProtectedRoute from '../../../shared/components/ProtectedRoute'
import DashboardLayout from '../pages/DashboardLayout'
import DashboardPage from '../pages/admin/DashboardPage'
import OrdenesPage from '@/features/ordenes/pages/OrdenesPage'
import Usuarios from '@/features/usuarios/pages/Usuarios'
import AuditoriaPage from '@/features/auditLogs/pages/AuditoriaPage'
import Operadores from '@/features/catalogo/pages/Operadores'
import Maquinas from '@/features/catalogo/pages/Maquinas'
import MotivosParo from '@/features/catalogo/pages/MotivosParo'
import Productos from '@/features/catalogo/pages/Productos'
import Pigmentos from '@/features/catalogo/pages/Pigmentos'
import MateriasPrimas from '@/features/catalogo/pages/MateriasPrimas'
import MateriasPrimasInventario from '@/features/inventory/pages/MateriasPrimasInventario'
import PigmentosInventario from '@/features/inventory/pages/PigmentosInventario'
import ProductoInventario from '@/features/inventory/pages/ProductoInventario'
import AvancesTurnoPage from '@/features/avancesTurno/pages/supervisor/AvancesTurnoPage'
import AvancesTurnoAdminPage from '@/features/avancesTurno/pages/admin/AvancesTurnoAdminPage'
import PedidosPage from '@/features/pedidos/pages/PedidosPage'
import PedidoDetallePage from '@/features/pedidos/pages/PedidoDetallePage'
import OrdenDetallePage from '@/features/ordenes/pages/OrdenDetallePage'
import MolidoInventario from '@/features/inventory/pages/MolidoInventario'
import DefectosProducto from '@/features/catalogo/pages/DefectosProductos'
import ColoresSolidosPage from '@/features/catalogo/pages/ColoresSolidosPage'
import OrdenesDisponiblesPage from '@/features/avancesTurno/pages/supervisor/OrdenesDisponiblesPage'
import AvanceTurnoDetallePage from '@/features/avancesTurno/pages/supervisor/AvanceTurnoDetallePage'
import PendientesConfirmacionPage from '@/features/molino/Pages/molino/PendientesConfirmacionPage'
import PendientesMolerPage from '@/features/molino/Pages/molino/PendientesMolerPage'
import MoliendasPage from '@/features/molino/Pages/molino/MoliendasPage'
import OrdenesPigmentosPage from '@/features/pigmentos/pages/pigmentos/OrdenesPigmentosPage'
import SolicitudesEIncidenciasPage from '@/features/pigmentos/pages/pigmentos/SolicitudesEIncidenciasPage'
import HistorialInventarioPage from '@/features/inventory/components/movimientos/HistorialInventarioPage'
import SobrantesPendientesPage from '@/features/pigmentos/pages/pigmentos/SobrantesPendientesPage'
import MolinoAdminPage from '@/features/molino/Pages/admin/MolinoAdminPage'
import ReportesPage from '@/features/reportes/pages/ReportesPage'

export const dashboardRoutes: RouteObject[] = [
  // ── Admin ──────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'pedidos', element: <PedidosPage /> },
          { path: 'pedidos/:id', element: <PedidoDetallePage /> },
          { path: 'ordenes', element: <OrdenesPage /> },
          { path: 'ordenes/:id', element: <OrdenDetallePage /> },
          { path: 'avances-turno', element: <AvancesTurnoAdminPage /> },
          { path: 'avances-turno/:id', element: <AvanceTurnoDetallePage /> },
          { path: 'molino', element: <MolinoAdminPage /> },
          { path: 'materias-primas', element: <MateriasPrimasInventario /> },
          { path: 'molido', element: <MolidoInventario /> },
          { path: 'pigmentos', element: <PigmentosInventario /> },
          { path: 'producto-terminado', element: <ProductoInventario /> },
          { path: 'historial-inventario', element: <HistorialInventarioPage /> },
          { path: 'productos', element: <Productos /> },
          { path: 'materia-prima-catalogo', element: <MateriasPrimas /> },
          { path: 'pigmentos-catalogo', element: <Pigmentos /> },
          { path: 'operadores', element: <Operadores /> },
          { path: 'maquinas', element: <Maquinas /> },
          { path: 'motivos-paro', element: <MotivosParo /> },
          { path: 'colores-solidos', element: <ColoresSolidosPage /> },
          { path: 'defectos-productos', element: <DefectosProducto /> },
          { path: 'reportes', element: <ReportesPage /> },
          { path: 'usuarios', element: <Usuarios /> },
          { path: 'auditoria', element: <AuditoriaPage /> }, 
        ],
      },
    ],
  },

  // ── Programador ─────────────────────────────
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
          { path: 'ordenes', element: <OrdenesDisponiblesPage /> },
          { path: 'ordenes/:id', element: <OrdenDetallePage /> },
          { path: 'avances', element: <AvancesTurnoPage /> },
          { path: 'avances/:id', element: <AvanceTurnoDetallePage /> },
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
          { path: 'pendientes', element: <PendientesConfirmacionPage /> },
          { path: 'registrar', element: <PendientesMolerPage /> },
          { path: 'historial', element: <MoliendasPage /> },
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
          { path: 'ordenes', element: <OrdenesPigmentosPage /> },
          { path: 'ordenes/:id', element: <OrdenDetallePage /> },
          { path: 'sobrante', element: <SobrantesPendientesPage /> },
          { path: 'alertas', element: <SolicitudesEIncidenciasPage /> },
          { path: 'materias-primas', element: <MateriasPrimasInventario /> },
          { path: 'molido', element: <MolidoInventario /> },
          { path: 'pigmentos', element: <PigmentosInventario /> },
          { path: 'historial-inventario', element: <HistorialInventarioPage /> },
        ],
      },
    ],
  },
]