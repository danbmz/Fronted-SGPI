// src/components/sidebar/sidebarConfig.ts
import { LayoutDashboard, Users, ClipboardList, TrendingUp, Timer, Cog, Package, Droplets, BoxSelect, ShoppingBag, Wrench, FlaskConical, BarChart2, HardHat, ShieldCheck, TextAlignJustify, Package2Icon, Droplet } from "lucide-react"

export interface SidebarItem {
  label: string
  path: string
  icon: React.ElementType
  section?: string
  exact?: boolean
}

export const sidebarItems: Record<"admin" | "supervisor", SidebarItem[]> = {
  admin: [
    { section: "PRINCIPAL", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, exact: true },
    { section: "PRINCIPAL", label: "Órdenes", path: "/admin/ordenes", icon: ClipboardList },
    { section: "OPERACIONES", label: "Avances de turno", path: "/admin/avances-turno", icon: TrendingUp },
    { section: "OPERACIONES", label: "Tiempos paro", path: "/admin/tiempos-paro", icon: Timer },
    { section: "OPERACIONES", label: "Molino", path: "/admin/molino", icon: Cog },
    { section: "INVENTARIO", label: "Materias primas", path: "/admin/materias-primas", icon: Package },
    { section: "INVENTARIO", label: "Pigmentos", path: "/admin/pigmentos", icon: Droplets },
    { section: "INVENTARIO", label: "Producto terminado", path: "/admin/producto-terminado", icon: BoxSelect },
    { section: "CATÁLOGOS", label: "Productos", path: "/admin/productos", icon: ShoppingBag },
    { section: "CATÁLOGOS", label: "Materias Primas", path: "/admin/materia-prima-catalogo", icon: Package2Icon },
    { section: "CATÁLOGOS", label: "Pigmentos", path: "/admin/pigmentos-catalogo", icon: Droplet },
    { section: "CATÁLOGOS", label: "Fórmulas Pigmentos", path: "/admin/formulas-pigmentos", icon: FlaskConical },
    { section: "CATÁLOGOS", label: "Motivos de Paro", path: "/admin/motivos-paro", icon: TextAlignJustify },
    { section: "CATÁLOGOS", label: "Operadores", path: "/admin/operadores", icon: HardHat },
    { section: "CATÁLOGOS", label: "Máquinas", path: "/admin/maquinas", icon: Wrench },
    { section: "ADMINISTRACIÓN", label: "Reportes", path: "/admin/reportes", icon: BarChart2 },
    { section: "ADMINISTRACIÓN", label: "Usuarios", path: "/admin/usuarios", icon: Users },
    { section: "ADMINISTRACIÓN", label: "Auditoría", path: "/admin/auditoria", icon: ShieldCheck },
  ],
  supervisor: [
    { section: "PRINCIPAL", label: "Dashboard", path: "/supervisor/dashboard", icon: LayoutDashboard, exact: true },
    { section: "PRINCIPAL", label: "Órdenes", path: "/supervisor/ordenes", icon: ClipboardList },
    { section: "OPERACIONES", label: "Avances de turno", path: "/supervisor/avances-turno", icon: TrendingUp },
    { section: "OPERACIONES", label: "Tiempos paro", path: "/supervisor/tiempos-paro", icon: Timer },
    { section: "OPERACIONES", label: "Molino", path: "/supervisor/molino", icon: Cog },
  ],
}