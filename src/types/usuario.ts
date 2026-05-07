export type Role = 'admin' | 'supervisor'

export interface User {
  id: number | string
  nombre: string
  usuario: string
  role: Role
  activo: boolean
  createdAt: string
}