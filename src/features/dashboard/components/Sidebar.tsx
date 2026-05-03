// src/components/sidebar/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { sidebarItems } from "./sidebar/sidebarConfing"

export default function Sidebar() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  if (!role) return null

  const items = sidebarItems[role]

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <aside className="flex-1 h-screen overflow-y-auto bg-gray-900 text-white p-4 hidden md:block">

      {/* Logo o nombre del sistema */}
      <div className=" border-b-2 border-gray-700 pb-2">
        <h1 className="text-xl font-bold">Plásticos Juquila</h1>
        <p className="text-sm text-gray-400 capitalize">{role}</p>
      </div>

      {/* Links de navegación */}
      <nav className="flex flex-col gap-1 flex-1">
          {items.map((item, index) => {
            const showSection =
              item.section && item.section !== items[index - 1]?.section

            return (
              <div key={item.path}>

                {/* Muestra el subtítulo solo cuando cambia la sección */}
                {showSection && (
                  <p className="text-xs text-gray-500 uppercase tracking-widest px-3 mt-4 mb-1">
                    {item.section}
                  </p>
                )}

                <NavLink
                  to={item.path}
                  end={item.exact} // Solo aplica "active" cuando la ruta es exactamente igual a item.path
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>

              </div>
            )
          })}
      </nav>

      {/* Logout al fondo */}
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
        className="flex items-center border-t-2 border-gray-700 w-full mt-3 gap-3 px-3 py-6 text-sm text-gray-400 cursor-pointer"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>

    </aside>
  )
}