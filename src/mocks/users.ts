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
    usuario: "admin01",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    nombre: "Karla Gómez",
    usuario: "admin02",
    password: "admin123",
    role: "admin"
  },
  {
    id: 3,
    nombre: "Ana Ruiz",
    usuario: "supervisora01",
    password: "super123",
    role: "supervisor"
  },
  {
    id: 4,
    nombre: "Ana Gonzales",
    usuario: "supervirosa02",
    password: "super123",
    role: "supervisor"
  },
  {
    id: 5,
    nombre: "Ana Karen",
    usuario: "suupervisora03",
    password: "super123",
    role: "supervisor"
  }
]