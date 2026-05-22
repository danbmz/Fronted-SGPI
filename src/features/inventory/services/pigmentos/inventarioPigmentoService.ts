import type { InventarioPigmento, AjusteManualForm } from "@/validations/inventario/inventarioValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getInventarioPigmentos = async (): Promise<InventarioPigmento[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/inventario/pigmentos.json")
  const data = await response.json()
  return data.map((p: any) => ({ ...p, id: String(p.id) }))
}

export const ajustarStockPigmento = async (
  id: string,
  data: AjusteManualForm,
  original: InventarioPigmento,
  usuarioActivo: AuthUser
): Promise<InventarioPigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "inventario",
    entidad: "Pigmentos",
    accion: "ajuste_manual",
    entidadId: id,
    detalle: `Stock de pigmento '${original.color}' (${original.categoriaColor}) ajustado de ${original.stockActual} kg a ${data.stockNuevo} kg. Motivo: ${data.motivo}`
  })

  return {
    ...original,
    stockActual: data.stockNuevo,
    ultimoMovimiento: new Date().toISOString().split("T")[0]
  }
}