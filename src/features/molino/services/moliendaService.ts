import { registrarLog } from "@/lib/auditService"
import type { AuthUser } from "@/types/usuario"
import type { Molienda, RegistrarMoliendaForm } from "@/validations/molino/moliendaValidations"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"

export const getMoliendas = async (): Promise<Molienda[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/molino/moliendas.json")
  const data = await response.json()
  return data.map((m: any) => ({ ...m, id: String(m.id) }))
}

export const getMoliendaPorOrden = async (ordenId: string): Promise<Molienda[]> => {
  const todas = await getMoliendas()
  return todas.filter(m => m.ordenesIds.includes(ordenId))
}

export const registrarMolienda = async (
  data: RegistrarMoliendaForm,
  ordenesSeleccionadas: OrdenProduccion[],
  materiaPrimaId: string,
  usuarioActivo: AuthUser
): Promise<Molienda> => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const nuevaMolienda: Molienda = {
    id: String(Date.now()),
    ordenesIds: data.ordenesIds,
    folios: ordenesSeleccionadas.map(o => o.folio),
    materialBase: ordenesSeleccionadas[0].materiaPrima,
    materiaPrimaId,
    colorAproximado: data.colorAproximado,
    kgIngresados: data.kgIngresados,
    fecha: new Date().toISOString(),
    observaciones: data.observaciones ?? null
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "molino",
    entidad: "Molienda",
    accion: "registrar_molienda",
    entidadId: nuevaMolienda.id,
    detalle: `${data.kgIngresados}kg molidos de ${ordenesSeleccionadas.length} orden(es): ${nuevaMolienda.folios.join(", ")} — Color: ${data.colorAproximado}`
  })

  return nuevaMolienda
}

// Calcula el color más frecuente entre las órdenes seleccionadas
export const calcularColorMasFrecuente = (ordenes: OrdenProduccion[]): string => {
  const conteo: Record<string, number> = {}
  ordenes.forEach(o => {
    conteo[o.color] = (conteo[o.color] ?? 0) + 1
  })
  const entradas = Object.entries(conteo)
  if (entradas.length === 0) return ""
  return entradas.sort((a, b) => b[1] - a[1])[0][0]
}