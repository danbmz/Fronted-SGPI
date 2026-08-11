import { LayoutDashboard, Users, ClipboardList, TrendingUp, Cog, Package, Droplets, BoxSelect, ShoppingBag, Wrench, BarChart2, HardHat, ShieldCheck, TextAlignJustify, Package2Icon, Droplet, Clock, Hammer, Bell } from "lucide-react"

export interface SidebarItem {
  label: string
  path: string
  icon: React.ElementType
  section?: string
  exact?: boolean
}

export const sidebarItems: Record<"ADMIN" | "SUPERVISOR" | "MOLINO" | "PIGMENTOS" | "PROGRAMADOR", SidebarItem[]> = {
  ADMIN: [
    { section: "PRINCIPAL", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, exact: true },
    { section: "PRINCIPAL", label: "Pedidos", path: "/admin/pedidos", icon: ClipboardList },
    { section: "PRINCIPAL", label: "Órdenes", path: "/admin/ordenes", icon: ClipboardList },
    { section: "OPERACIONES", label: "Avances de turno", path: "/admin/avances-turno", icon: TrendingUp },
    { section: "OPERACIONES", label: "Molino", path: "/admin/molino", icon: Cog },
    { section: "INVENTARIO", label: "Materias primas", path: "/admin/materias-primas", icon: Package },
    { section: "INVENTARIO", label: "Molido", path: "/admin/molido", icon: Package },
    { section: "INVENTARIO", label: "Pigmentos", path: "/admin/pigmentos", icon: Droplets },
    { section: "INVENTARIO", label: "Producto terminado", path: "/admin/producto-terminado", icon: BoxSelect },
    { section: "CATÁLOGOS", label: "Productos", path: "/admin/productos", icon: ShoppingBag },
    { section: "CATÁLOGOS", label: "Materias Primas", path: "/admin/materia-prima-catalogo", icon: Package2Icon },
    { section: "CATÁLOGOS", label: "Pigmentos", path: "/admin/pigmentos-catalogo", icon: Droplet },
    { section: "CATÁLOGOS", label: "Motivos de Paro", path: "/admin/motivos-paro", icon: TextAlignJustify },
    { section: "CATÁLOGOS", label: "Operadores", path: "/admin/operadores", icon: HardHat },
    { section: "CATÁLOGOS", label: "Máquinas", path: "/admin/maquinas", icon: Wrench },
    { section: "CATÁLOGOS", label: "Colores Sólidos", path: "/admin/colores-solidos", icon: Wrench },
    { section: "CATÁLOGOS", label: "Defectos", path: "/admin/defectos-productos", icon: Wrench },
    { section: "ADMINISTRACIÓN", label: "Reportes", path: "/admin/reportes", icon: BarChart2 },
    { section: "ADMINISTRACIÓN", label: "Usuarios", path: "/admin/usuarios", icon: Users },
    { section: "ADMINISTRACIÓN", label: "Auditoría", path: "/admin/auditoria", icon: ShieldCheck },
  ],
  SUPERVISOR: [
    { section: "OPERACIONES", label: "Órdenes", path: "/supervisor/ordenes", icon: ClipboardList, exact: true },
    { section: "OPERACIONES", label: "Avances de turno", path: "/supervisor/avances", icon: TrendingUp, exact: true },
  ],
  MOLINO: [
    { section: "OPERACIONES", label: "Pendientes", path: "/molino/pendientes", icon: Clock, exact: true },
    { section: "OPERACIONES", label: "Registrar", path: "/molino/registrar", icon: Hammer, exact: true },
  ],
  PIGMENTOS: [
    { section: "OPERACIONES", label: "Órdenes", path: "/pigmentos/ordenes", icon: ClipboardList, exact: true },
    { section: "OPERACIONES", label: "Alertas", path: "/pigmentos/alertas", icon: Bell, exact: true },
  ],
  PROGRAMADOR: [
    { section: "OPERACIONES", label: "Pedidos", path: "/programador/pedidos", icon: ClipboardList, exact: true },
    { section: "OPERACIONES", label: "Órdenes", path: "/programador/ordenes", icon: ClipboardList, exact: true },
  ]
}