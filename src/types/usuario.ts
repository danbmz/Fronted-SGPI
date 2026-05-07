export type Role = 'admin' | 'supervisor'

export interface User {
  id: number
  nombre: string
  usuario: string
  role: Role
  activo: boolean
}