import type { User, AuthUser, CrearUsuarioDTO, EditarUsuarioDTO } from "@/types/usuario";
import { mockUsers } from "@/mocks/users";
import { registrarLog } from "@/lib/auditService";


export async function getUsuarios(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUsers.map((u): User => ({
    id: String(u.id),
    nombre: u.nombre,
    usuario: u.usuario,
    role: u.role,
    activo: u.activo,
    createdAt: u.createdAt
  }))
}

export const crearUsuario = async (data: CrearUsuarioDTO, usuarioActivo: AuthUser): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simula lo que devolvería el backend — un User completo con id y fechas generadas
  const nuevoUsuario: User = {
    id: String(Date.now()),
    nombre: data.nombre,
    usuario: data.usuario,
    role: data.role,
    activo: true,
    createdAt: new Date().toISOString()
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

export const editarUsuario = async (id: string, data: EditarUsuarioDTO, usuarioOriginal: User,  // ← para conservar activo y createdAt
usuarioActivo: AuthUser
): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "usuarios",
    accion: "editar",
    entidad: "Usuario",
    entidadId: id,
    detalle: `Usuario '${usuarioOriginal.usuario}' editado`
  })

  return {
    ...usuarioOriginal, // conserva activo, createdAt y cualquier otro campo
    ...data,            // sobreescribe solo los campos editados
    id                  // aseguras que el id no cambie
  }
}

export const desactivarUsuario = async (data: User, usuarioActivo: AuthUser): Promise<User> => {
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

export const reactivarUsuario = async (data: User, usuarioActivo: AuthUser): Promise<User> => {
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