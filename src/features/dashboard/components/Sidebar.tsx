import { NavLink, useNavigate } from "react-router-dom"
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { sidebarItems } from "./sidebar/sidebarConfing"
import { useAlertasPigmentos } from "@/features/pigmentos/hooks/useAlertasPigmentos"

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  if (!role) return null

  const items = sidebarItems[role]

  // Solo carga el conteo si el rol es pigmentos
  const alertasPigmentos = useAlertasPigmentos()
  const mostrarBadge = role === "pigmentos" && alertasPigmentos > 0

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <aside className={`
      relative flex flex-col h-screen overflow-y-auto overflow-x-hidden
      bg-gray-900 text-white transition-all duration-300 ease-in-out
      md:flex
      ${collapsed ? "w-16" : "w-60"}
    `}>

      {/* Logo */}
      <div className="border-b-2 border-gray-700 pb-2 px-4 pt-4 flex flex-col justify-center">
        {collapsed ? (
          <button onClick={onToggle} className="flex items-center justify-center h-6 text-gray-400 hover:text-white transition-colors">
            <PanelLeftOpen size={20} className="shrink-0"/>
          </button>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-bold whitespace-nowrap">Plásticos Juquila</h1>
              <p className="text-sm text-gray-400 capitalize">{role}</p>
            </div>
            {/* Botón de toggle */}
            <button
              onClick={onToggle}
              className="absolute right-3 top-6 z-10 flex items-center justify-center
                w-6 h-6 text-gray-400 hover:text-white transition-colors"
            >
              <PanelLeftClose size={20} className="shrink-0"/>
            </button>
          </>
        )}
      </div>

      {/* Links de navegación */}
      <nav className="flex flex-col gap-1 flex-1 px-2 py-3">
        {items.map((item, index) => {
          const showSection =
            !collapsed &&
            item.section &&
            item.section !== items[index - 1]?.section
          const esPigmentosAlertas = role === "pigmentos" && item.path.includes("alertas")

          return (
            <div key={item.path}>
              {showSection && (
                <p className="text-xs text-gray-500 uppercase tracking-widest px-3 mt-4 mb-1 whitespace-nowrap">
                  {item.section}
                </p>
              )}

              <NavLink
                to={item.path}
                end={item.exact}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${collapsed ? "justify-center" : ""}
                  ${isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
              
                <div className="relative shrink-0">
                  <item.icon size={18} />
                  {collapsed && esPigmentosAlertas && mostrarBadge && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">
                      {alertasPigmentos > 9 ? "9+" : alertasPigmentos}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden flex items-center gap-2">
                    {item.label}
                    {/* Badge también en el texto cuando está expandido */}
                    {esPigmentosAlertas && mostrarBadge && (
                      <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        {alertasPigmentos > 9 ? "9+" : alertasPigmentos}
                      </span>
                    )}
                  </span>
                )}

              </NavLink>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title={collapsed ? "Cerrar sesión" : undefined}
        className={`
          flex items-center border-t-2 border-gray-700 w-full mt-3
          gap-3 px-3 py-6 text-sm text-gray-400 cursor-pointer
          hover:text-white transition-colors
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <LogOut size={18} className="shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">Cerrar sesión</span>}
      </button>

    </aside>
  )
}