import { create } from 'zustand'
import type { AuthUser } from '@/features/usuarios/schemas/usuario.schema'
import { irA } from '@/lib/navigation'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  cargando: boolean
  login: (user: AuthUser) => void
  logout: () => void
  setCargando: (cargando: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  cargando: true,

  login: (user) => {
    set({ user, isAuthenticated: true, cargando: false })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, cargando: false })
  },

  setCargando: (cargando) => set({ cargando }),
}))

// Escucha el evento disparado por httpClient cuando el refresh falla de verdad
window.addEventListener('sesion-expirada', () => {
  useAuthStore.getState().logout()
  irA('/') // usa React Router, no window.location.href
})