// src/types/usuario.ts

export type Role = "admin" | "supervisor"

// Tipo completo — para gestión de usuarios (admin)
export interface User {
  id: string
  nombre: string
  usuario: string
  role: Role
  activo: boolean
  createdAt: string
}

// Tipo reducido — para sesión activa
export interface AuthUser {
  id: string
  nombre: string
  usuario: string
  role: Role
}

// Para crear un usuario — lo que el admin llena
export interface CrearUsuarioDTO {
  nombre: string
  usuario: string
  password: string
  role: Role
}

// Para editar un usuario — igual que crear, password opcional
export interface EditarUsuarioDTO {
  nombre: string
  usuario: string
  password?: string  // opcional, solo si quiere cambiarla
  role: Role
}

// Tipo reducido — para listas o selects
export interface UserResumen {
  id: string
  nombre: string
  usuario: string
}