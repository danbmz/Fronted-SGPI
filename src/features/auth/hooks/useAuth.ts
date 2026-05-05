import { useAuthStore } from '../../../store/authStore'
import { loginService, logoutService } from '../authService.ts'
import type { LoginCredentials } from '../authService.ts'
import type { User, Role } from '../../../store/authStore'

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
  }

  const logout = async () => {
    if (token) await logoutService(token)  // avisa al servidor
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