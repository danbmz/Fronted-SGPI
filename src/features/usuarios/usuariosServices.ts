import type { User } from "@/types/usuario";
import { mockUsers } from "@/mocks/users";


export async function getUsuarios(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUsers.map((u): User => ({
    id: u.id,
    nombre: u.nombre,
    usuario: u.usuario,
    role: u.role,
    activo: u.activo,
  }))
}