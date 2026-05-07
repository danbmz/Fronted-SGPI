import { registrarLog } from '@/lib/auditService.ts'
import { useAuthStore } from '../../../store/authStore'
import { loginService, logoutService } from '../authService.ts'
import type { LoginCredentials } from '../authService.ts'
import type { User, Role } from '@/types/usuario.ts'

interface UseAuthReturn {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: Role | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const storeLogin = useAuthStore(state => state.login)
  const storeLogout = useAuthStore(state => state.logout)


  const login = async (credentials: LoginCredentials) => {
    const { user, token } = await loginService(credentials)  // llama a la API
    storeLogin(user, token)                                   // guarda en el store

    // Registrar el lOG
    await registrarLog({
    usuario: user.usuario,
    nombre: user.nombre,
    modulo: "auth",
    accion: "login",
    detalle: "Inicio de sesión exitoso"
  })
  }

  const logout = async () => {
    if (token) await logoutService(token)  // avisa al servidor

    // Registramos el Log
    await registrarLog({
      usuario: user?.usuario || "Desconocido",
      nombre: user?.nombre || "Desconocido",
      modulo: "auth",
      accion: "logout",
      detalle: "Cierre de sesión"
    })

    storeLogout()                          // limpia el store y localStorage
  }

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role ?? null,  // ← acceso directo al rol, útil en varios lugares
    login,
    logout,
  }
}