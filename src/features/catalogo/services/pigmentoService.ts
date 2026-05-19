import type { Pigmento, CrearPigmento, EditarPigmento } from "@/validations/catalogo/pigmentosValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getPigmentos = async (): Promise<Pigmento[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/catalogo/pigmentos.json")
  const data = await response.json()
  return data.map((p: any) => ({
    ...p,
    id: String(p.id),
    materiaPrimaId: String(p.materiaPrimaId)
  }))
}

export const crearPigmento = async (
  data: CrearPigmento,
  usuarioActivo: AuthUser
): Promise<Pigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevoPigmento: Pigmento = {
    ...data,
    id: String(Date.now()),
    activo: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Pigmentos",
    accion: "crear",
    entidadId: nuevoPigmento.id,
    detalle: `Pigmento '${nuevoPigmento.color}' (${nuevoPigmento.categoriaColor}) creado`
  })

  return nuevoPigmento
}

export const editarPigmento = async (
  id: string,
  data: EditarPigmento,
  pigmentoOriginal: Pigmento,
  usuarioActivo: AuthUser
): Promise<Pigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Pigmentos",
    accion: "editar",
    entidadId: id,
    detalle: `Pigmento '${data.color}' (${data.categoriaColor}) editado`
  })

  return { ...pigmentoOriginal, ...data, id }
}

export const desactivarPigmento = async (
  pigmento: Pigmento,
  usuarioActivo: AuthUser
): Promise<Pigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Pigmentos",
    accion: "desactivar",
    entidadId: pigmento.id,
    detalle: `Pigmento '${pigmento.color}' desactivado`
  })

  return { ...pigmento, activo: false }
}

export const reactivarPigmento = async (
  pigmento: Pigmento,
  usuarioActivo: AuthUser
): Promise<Pigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Pigmentos",
    accion: "reactivar",
    entidadId: pigmento.id,
    detalle: `Pigmento '${pigmento.color}' reactivado`
  })

  return { ...pigmento, activo: true }
}