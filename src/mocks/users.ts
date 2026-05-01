// src/mocks/users.js
export interface MockUser {
  id: number
  nombre: string
  usuario: string
  password: string
  role: "admin" | "supervisor"
}


export const mockUsers: MockUser[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    usuario: "juanadmin01",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    nombre: "Ana Ruiz",
    usuario: "anasupervisora01",
    password: "super123",
    role: "supervisor"
  }
]