import { getOrdenesProduccion } from "@/features/ordenes/services/ordenService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avanceTurnoService"
import { getInventarioMateriasPrimas } from "@/features/inventory/services/materiaPrima/inventarioMateriaPrimaService"
import { getInventarioPigmentos } from "@/features/inventory/services/pigmentos/inventarioPigmentoService"
import { produccionSemana, parosPorMotivo } from "@/mocks/dashboard/dashboardData"

export interface AlertaStock {
  id: string
  nombre: string
  tipo: "material" | "pigmento"
  stockActual: number
  stockMinimo: number
  unidad: string
}

export interface ResumenDashboard {
  ordenesActivas: number
  ordenesEnProgreso: number
  piezasSemana: number
  defectuosasSemana: number
  minutosParoSemana: number
  motivoPrincipal: string
  kgMermaSemana: number
  produccionSemana: typeof produccionSemana
  parosPorMotivo: typeof parosPorMotivo
  alertasStock: AlertaStock[]
}

export const getDashboardData = async (): Promise<ResumenDashboard> => {
  await new Promise(resolve => setTimeout(resolve, 100))

  const [ordenes, avances, materiales, pigmentos] = await Promise.all([
    getOrdenesProduccion(),
    getAvancesTurno(),
    getInventarioMateriasPrimas(),
    getInventarioPigmentos()
  ])

  const ordenesActivas = ordenes.filter(o => o.estado === "activa").length
  const ordenesEnProgreso = ordenes.filter(o => o.estado === "en_progreso").length

  const piezasSemana = avances.reduce((acc, a) => acc + a.piezasBuenas, 0)
  const defectuosasSemana = avances.reduce((acc, a) => acc + a.piezasDefectuosas, 0)
  const kgMermaSemana = avances.reduce((acc, a) => acc + a.kgMerma + a.kgPlasta, 0)

  const minutosParoSemana = avances.reduce((acc, a) =>
    acc + a.tiemposParo.reduce((t, p) => t + p.minutos, 0), 0
  )

  // Motivo de paro más frecuente
  const conteoMotivos: Record<string, number> = {}
  avances.forEach(a => {
    a.tiemposParo.forEach(p => {
      conteoMotivos[p.motivo] = (conteoMotivos[p.motivo] ?? 0) + p.minutos
    })
  })
  const motivoPrincipal = Object.entries(conteoMotivos)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sin paros"

  // Alertas de stock bajo
  const alertasStock: AlertaStock[] = [
    ...materiales
      .filter(m => m.stockActual < m.stockMinimo)
      .map(m => ({
        id: m.id,
        nombre: m.nombre,
        tipo: "material" as const,
        stockActual: m.stockActual,
        stockMinimo: m.stockMinimo,
        unidad: "kg"
      })),
    ...pigmentos
      .filter(p => p.stockActual < p.stockMinimo)
      .map(p => ({
        id: p.id,
        nombre: `${p.color} ${p.categoriaColor}`,
        tipo: "pigmento" as const,
        stockActual: p.stockActual,
        stockMinimo: p.stockMinimo,
        unidad: "kg"
      }))
  ]

  return {
    ordenesActivas,
    ordenesEnProgreso,
    piezasSemana,
    defectuosasSemana,
    minutosParoSemana,
    motivoPrincipal,
    kgMermaSemana,
    produccionSemana,
    parosPorMotivo,
    alertasStock
  }
}