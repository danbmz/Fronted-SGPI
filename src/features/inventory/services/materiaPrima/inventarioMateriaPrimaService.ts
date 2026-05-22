import type { InventarioMateriaPrima, AjusteManualForm } from "@/validations/inventario/inventarioValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getInventarioMateriasPrimas = async (): Promise<InventarioMateriaPrima[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const response = await fetch("/mocks/inventario/materiasPrimas.json")
  const data = await response.json()
  return data.map((m: any) => ({ ...m, id: String(m.id) }))
}

export const ajustarStockMateriaPrima = async (
  id: string,
  data: AjusteManualForm,
  original: InventarioMateriaPrima,
  usuarioActivo: AuthUser
): Promise<InventarioMateriaPrima> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "inventario",
    entidad: "MateriasPrimas",
    accion: "ajuste_manual",
    entidadId: id,
    detalle: `Stock de '${original.nombre}' ajustado de ${original.stockActual} kg a ${data.stockNuevo} kg. Motivo: ${data.motivo}`
  })

  return {
    ...original,
    stockActual: data.stockNuevo,
    ultimoMovimiento: new Date().toISOString().split("T")[0]
  }
}