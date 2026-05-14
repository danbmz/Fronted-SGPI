import type { MotivoParo, CrearMotivoParoDTO, EditarMotivoParoDTO } from "@/types/motivosCatalogo"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getMotivosParo = async (): Promise<MotivoParo[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/catalogo/motivosParo.json")
  const data = await response.json()
  return data.map((m: any) => ({
    ...m,
    id: String(m.id)
  }))
}

export const crearMotivoParo = async (
  data: CrearMotivoParoDTO,
  usuarioActivo: AuthUser
): Promise<MotivoParo> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevoMotivo: MotivoParo = {
    ...data,
    id: String(Date.now()),
    activo: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MotivosParo",
    accion: "crear",
    entidadId: nuevoMotivo.id,
    detalle: `Motivo de paro '${nuevoMotivo.nombre}' creado`
  })

  return nuevoMotivo
}

export const editarMotivoParo = async (
  id: string,
  data: EditarMotivoParoDTO,
  motivoOriginal: MotivoParo,
  usuarioActivo: AuthUser
): Promise<MotivoParo> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MotivosParo",
    accion: "editar",
    entidadId: id,
    detalle: `Motivo de paro '${data.nombre}' editado`
  })

  return { ...motivoOriginal, ...data, id }
}

export const desactivarMotivoParo = async (
  motivo: MotivoParo,
  usuarioActivo: AuthUser
): Promise<MotivoParo> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MotivosParo",
    accion: "desactivar",
    entidadId: motivo.id,
    detalle: `Motivo de paro '${motivo.nombre}' desactivado`
  })

  return { ...motivo, activo: false }
}

export const reactivarMotivoParo = async (
  motivo: MotivoParo,
  usuarioActivo: AuthUser
): Promise<MotivoParo> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MotivosParo",
    accion: "reactivar",
    entidadId: motivo.id,
    detalle: `Motivo de paro '${motivo.nombre}' reactivado`
  })

  return { ...motivo, activo: true }
}