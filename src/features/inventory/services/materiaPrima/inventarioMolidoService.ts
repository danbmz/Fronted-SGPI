import type { InventarioMolido, AjusteManualForm } from "@/validations/inventario/inventarioValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getInventarioMolido = async (): Promise<InventarioMolido[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/inventario/molido.json")
  const data = await response.json()
  return data.map((m: any) => ({
    ...m,
    id: String(m.id),
    ordenOrigen: m.ordenOrigen ?? null
  }))
}

export const ajustarStockMolido = async (
  id: string,
  data: AjusteManualForm,
  original: InventarioMolido,
  usuarioActivo: AuthUser
): Promise<InventarioMolido> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "inventario",
    entidad: "Molido",
    accion: "ajuste_manual",
    entidadId: id,
    detalle: `Stock de molido '${original.colorAproximado}' (${original.materialBase}) ajustado de ${original.stockActual} kg a ${data.stockNuevo} kg. Motivo: ${data.motivo}`
  })

  return {
    ...original,
    stockActual: data.stockNuevo,
    ultimaEntrada: new Date().toISOString().split("T")[0]
  }
}