import type { MovimientoInventario } from "@/validations/inventario/inventarioValidations"

export const getHistorialMovimientos = async (
  inventarioId: string,
  tipoInventario: MovimientoInventario["tipoInventario"]
): Promise<MovimientoInventario[]> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  const response = await fetch("/mocks/inventario/historialMovimientos.json")
  const data = await response.json()

  return data
    .filter((m: any) =>
      m.inventarioId === inventarioId &&
      m.tipoInventario === tipoInventario
    )
    .map((m: any) => ({ ...m, id: String(m.id) }))
    .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}