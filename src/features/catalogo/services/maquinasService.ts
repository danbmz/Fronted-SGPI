import type { Maquina, CrearMaquinaDTO, EditarMaquinaDTO, CambiarEstadoMaquinaDTO } from "@/types/maquinasCatalogo"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getMaquinas = async (): Promise<Maquina[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/catalogo/maquinas.json")
  const data = await response.json()
  return data.map((m: any) => ({
    ...m,
    id: String(m.id),
    capacidadTon: m.capacidadTon ?? null
  }))
}

export const crearMaquina = async (
  data: CrearMaquinaDTO,
  usuarioActivo: AuthUser
): Promise<Maquina> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevaMaquina: Maquina = {
    ...data,
    id: String(Date.now()),
    estado: "activa",
    createdAt: new Date().toISOString()
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "crear",
    entidad: "Maquina",
    entidadId: nuevaMaquina.id,
    detalle: `Máquina '${nuevaMaquina.nombre}' registrada`
  })

  return nuevaMaquina
}

export const editarMaquina = async (
  id: string,
  data: EditarMaquinaDTO,
  maquinaOriginal: Maquina,
  usuarioActivo: AuthUser
): Promise<Maquina> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "editar",
    entidad: "Maquina",
    entidadId: id,
    detalle: `Máquina '${data.nombre}' editada`
  })

  return { ...maquinaOriginal, ...data, id }
}

export const cambiarEstadoMaquina = async (
  maquina: Maquina,
  data: CambiarEstadoMaquinaDTO,
  usuarioActivo: AuthUser
): Promise<Maquina> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    accion: "cambiar_estado",
    entidad: "Maquina",
    entidadId: maquina.id,
    detalle: `Máquina '${maquina.nombre}' cambió de estado: ${maquina.estado} → ${data.estado}. Motivo: ${data.motivo}`
  })

  return { ...maquina, estado: data.estado }
}