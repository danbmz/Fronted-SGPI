import type { Role } from "./usuario"

export interface FormValues {
  nombre: string
  usuario: string
  password: string
  role: Role
}