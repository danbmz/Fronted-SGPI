import type { User } from '@/types/usuario'
import { mockUsers } from '@/mocks/users'

// ── Configuración ───────────────────────────────────────────
// const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'


// ── Tipos ───────────────────────────────────────────────────
export interface LoginCredentials {
  usuario: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// ── Error personalizado ─────────────────────────────────────
// export class AuthError extends Error {
//   constructor(
//     message: string,
//     public statusCode?: number
//   ) {
//     super(message)
//     this.name = 'AuthError'
//   }
// }

// ── Servicio ────────────────────────────────────────────────
export async function loginService(credentials: LoginCredentials): Promise<LoginResponse> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const user = mockUsers.find(
    u => u.usuario === credentials.usuario && u.password === credentials.password
  ) as User | undefined

  if (!user) {
    throw new Error("Credenciales incorrectas")
  }

  return {
    token: "fake-jwt-token-123",
    user: {
      id: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      role: user.role,
      activo: user.activo,
    }
  }

  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(credentials),
  // })

  // if (!response.ok) {
  //   const error = await response.json().catch(() => ({}))
  //   throw new AuthError(
  //     error.message ?? 'Credenciales incorrectas',
  //     response.status
  //   )
  // }

  // return response.json()
}

export async function logoutService(token: string): Promise<void> {
  
  
  // await fetch(`${API_BASE_URL}/auth/logout`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //   },
  // }).catch(() => {
  //   // si falla el logout en servidor, no bloqueamos al usuario
  // })
}

// export async function getMeService(token: string): Promise<User> {
//   const response = await fetch(`${API_BASE_URL}/auth/me`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   })

//   if (!response.ok) {
//     throw new AuthError('Sesión expirada', response.status)
//   }

//   return response.json()
// }