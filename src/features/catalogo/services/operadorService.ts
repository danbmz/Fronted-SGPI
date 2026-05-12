import type { Operador, CrearOperadorDTO, EditarOperadorDTO } from '@/types/operadoresCatalogo'
import { registrarLog } from "@/lib/auditService"
import type { AuthUser } from "@/types/usuario"

// NOS QUEDAMOS AQUI
export const getOperadores = async (): Promise<Operador[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const response = await fetch("/mocks/catalogo/operadores.json")
  const data = await response.json()
  
  return data.map((o: any) => ({
    ...o,
    id: String(o.id),
    turnoHabitual: o.turnoHabitual as "Mañana" | "Tarde" | "Noche"
  }))
}

export const crearOperador = async (
  data: CrearOperadorDTO,
  usuarioActivo: AuthUser
): Promise<Operador> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevoOperador: Operador = {
    ...data,
    id: String(Date.now()),
    activo: true,
    createdAt: new Date().toISOString()
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "crear",
    entidad: "Operador",
    entidadId: nuevoOperador.id,
    detalle: `Operador '${nuevoOperador.nombre}' creado`
  })

  return nuevoOperador
}

export const editarOperador = async (
  id: string,
  data: EditarOperadorDTO,
  operadorOriginal: Operador,
  usuarioActivo: AuthUser
): Promise<Operador> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "editar",
    entidad: "Operador",
    entidadId: id,
    detalle: `Operador '${operadorOriginal.nombre}' editado`
  })

  return { ...operadorOriginal, ...data, id }
}

export const desactivarOperador = async (
  operador: Operador,
  usuarioActivo: AuthUser
): Promise<Operador> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "desactivar",
    entidad: "Operador",
    entidadId: operador.id,
    detalle: `Operador '${operador.nombre}' desactivado`
  })

  return { ...operador, activo: false }
}

export const reactivarOperador = async (
  operador: Operador,
  usuarioActivo: AuthUser
): Promise<Operador> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "reactivar",
    entidad: "Operador",
    entidadId: operador.id,
    detalle: `Operador '${operador.nombre}' reactivado`
  })

  return { ...operador, activo: true }
}