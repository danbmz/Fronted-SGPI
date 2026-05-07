import type { User } from "@/types/usuario";
import { mockUsers } from "@/mocks/users";
import { registrarLog } from "@/lib/auditService";


export async function getUsuarios(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUsers.map((u): User => ({
    id: u.id,
    nombre: u.nombre,
    usuario: u.usuario,
    role: u.role,
    activo: u.activo,
    createdAt: u.createdAt
  }))
}

export const crearUsuario = async (data: Omit<User, "id" | "activo">, usuarioActivo: User): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simula creación
  const nuevoUsuario: User = { 
    ...data, 
    id: String(Date.now()),
    activo: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "usuarios",
    accion: "crear",
    entidad: "Usuario",
    entidadId: nuevoUsuario.id,
    detalle: `Usuario '${nuevoUsuario.usuario}' creado con rol ${nuevoUsuario.role}`
  })

  return nuevoUsuario
}

export const editarUsuario = async (data: User, usuarioActivo: User): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "usuarios",
    accion: "editar",
    entidad: "Usuario",
    entidadId: data.id,
    detalle: `Usuario '${data.usuario}' editado`
  })

  return data
}

export const desactivarUsuario = async (data: User, usuarioActivo: User): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "usuarios",
    accion: "desactivar",
    entidad: "Usuario",
    entidadId: data.id,
    detalle: `Usuario '${data.usuario}' desactivado`
  })

  return { ...data, activo: false }
}

export const reactivarUsuario = async (data: User, usuarioActivo: User): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "usuarios",
    accion: "reactivar",
    entidad: "Usuario",
    entidadId: data.id,
    detalle: `Usuario '${data.usuario}' reactivado`
  })

  return { ...data, activo: true }
}