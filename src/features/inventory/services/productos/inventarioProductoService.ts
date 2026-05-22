import type { InventarioProductoTerminado, AjusteManualForm } from "@/validations/inventario/inventarioValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getInventarioProductoTerminado = async (): Promise<InventarioProductoTerminado[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/inventario/productoTerminado.json")
  const data = await response.json()
  return data.map((p: any) => ({ ...p, id: String(p.id) }))
}

export const ajustarStockProductoTerminado = async (
  id: string,
  data: AjusteManualForm,
  original: InventarioProductoTerminado,
  usuarioActivo: AuthUser
): Promise<InventarioProductoTerminado> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "inventario",
    entidad: "ProductoTerminado",
    accion: "ajuste_manual",
    entidadId: id,
    detalle: `Stock de '${original.nombre}' ajustado de ${original.stockActual} pzas a ${data.stockNuevo} pzas. Motivo: ${data.motivo}`
  })

  return {
    ...original,
    stockActual: data.stockNuevo,
    ultimoMovimiento: new Date().toISOString().split("T")[0]
  }
}