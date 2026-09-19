import { useAuthStore } from '@/store/authStore'
import { login as loginService, logout as logoutService } from '@/features/auth/authService'
import type { AuthUser } from '@/features/usuarios/schemas/usuario.schema';
import type { Role } from '@/types/enums';

interface LoginCredentials {
  usuario: string
  password: string
}

interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore.getState>['user']
  isAuthenticated: boolean
  cargando: boolean
  role: Role | null
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  logout: (motivo?: "EXPLICITO" | "INACTIVIDAD") => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const storeLogin = useAuthStore((state) => state.login)
  const storeLogout = useAuthStore((state) => state.logout)
  const cargando = useAuthStore((state) => state.cargando)

  const login = async (credentials: LoginCredentials) => {
    const { usuario } = await loginService(credentials.usuario, credentials.password)
    storeLogin(usuario)
    return usuario;
  }

  const logout = async (motivo: "EXPLICITO" | "INACTIVIDAD" = "EXPLICITO") => {
    await logoutService(motivo)
    storeLogout()
  }

  return {
    user,
    isAuthenticated,
    cargando,
    role: user?.role ?? null,
    login,
    logout,
  }
}