import type { Role } from "@/types/usuario"

export interface MockUser {
  id: number
  nombre: string
  usuario: string
  password: string
  role: Role
  activo: boolean
  createdAt: string
}


export const mockUsers: MockUser[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    usuario: "admin01",
    password: "admin123",
    role: "admin",
    activo: true,
    createdAt: "2023-01-01T00:00:00Z"
  }
  ,
  {
    id: 2,
    nombre: "Karla Gómez",
    usuario: "admin02",
    password: "admin123",
    role: "admin",
    activo: true,
    createdAt: "2023-01-01T00:00:00Z"
  }
  ,
  {
    id: 3,
    nombre: "Ana Ruiz",
    usuario: "supervisora01",
    password: "super123",
    role: "supervisor",
    activo: true,
    createdAt: "2023-01-01T00:00:00Z"
  }
  ,
  {
    id: 4,
    nombre: "Ana Gonzales",
    usuario: "supervirosa02",
    password: "super123",
    role: "supervisor",
    activo: true,
    createdAt: "2023-01-01T00:00:00Z"
  }
  ,
  {
    id: 5,
    nombre: "Ana Karen",
    usuario: "suupervisora03",
    password: "super123",
    role: "supervisor",
    activo: false,
    createdAt: "2023-01-01T00:00:00Z"
  },
  { 
    id: 6, 
    nombre: "Roberto Sánchez", 
    usuario: "molino01",    
    password: "molino123",    
    role: "molino",    
    activo: true, 
    createdAt: "2026-01-01" 
  },
  { 
    id: 7, 
    nombre: "Patricia Lima",   
    usuario: "pigmentos01", 
    password: "pigmentos123", 
    role: "pigmentos", 
    activo: true, 
    createdAt: "2026-01-01" 
  }
]