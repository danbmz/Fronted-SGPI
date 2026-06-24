import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import { produccionSemana, parosPorMotivo } from "@/mocks/dashboard/dashboardData"
import { ordenesCompletadas } from "@/mocks/reportes/reportesData"

export interface FiltroReporte {
  fechaInicio: string
  fechaFin: string
}

export interface ReporteOrden {
  folio: string
  fechaCreacion: string
  producto: string
  color: string
  estado: string
  materiaPrimaTotalKg: number
  pigmentoRequeridoGr: number
  totalPiezas: number
  piezasProducidas: number
  cumplimiento: number
  clienteDestino: string
}

export interface ReporteSupervisor {
  nombre: string
  avancesRegistrados: number
  piezasBuenas: number
  piezasDefectuosas: number
  calidad: number
}

export interface ReporteProduccion {
  totalPiezasBuenas: number
  totalPiezasDefectuosas: number
  calidadGlobal: number
  materialConsumidoKg: number
  produccionPorTurno: typeof produccionSemana
  parosPorMotivo: typeof parosPorMotivo
  supervisores: ReporteSupervisor[]
  ordenes: ReporteOrden[]
}

export const getReportes = async (filtro: FiltroReporte): Promise<ReporteProduccion> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const avances = await getAvancesTurno()

  // Filtra avances por rango de fecha
  const avancesFiltrados = avances.filter(a => {
    const fecha = new Date(a.fecha)
    const inicio = new Date(filtro.fechaInicio)
    const fin = new Date(`${filtro.fechaFin}T23:59:59`)
    return fecha >= inicio && fecha <= fin
  })

  const totalPiezasBuenas = avancesFiltrados.reduce((acc, a) => acc + a.piezasBuenas, 0)
  const totalPiezasDefectuosas = avancesFiltrados.reduce((acc, a) => acc + a.piezasDefectuosas, 0)
  const calidadGlobal = totalPiezasBuenas + totalPiezasDefectuosas > 0
    ? parseFloat(((totalPiezasBuenas / (totalPiezasBuenas + totalPiezasDefectuosas)) * 100).toFixed(1))
    : 0

  // Agrupa por supervisor
  const mapaSupervisores: Record<string, ReporteSupervisor> = {}
  avancesFiltrados.forEach(a => {
    if (!mapaSupervisores[a.supervisorId]) {
      mapaSupervisores[a.supervisorId] = {
        nombre: a.supervisorNombre,
        avancesRegistrados: 0,
        piezasBuenas: 0,
        piezasDefectuosas: 0,
        calidad: 0
      }
    }
    mapaSupervisores[a.supervisorId].avancesRegistrados += 1
    mapaSupervisores[a.supervisorId].piezasBuenas += a.piezasBuenas
    mapaSupervisores[a.supervisorId].piezasDefectuosas += a.piezasDefectuosas
  })

  const supervisores = Object.values(mapaSupervisores).map(s => ({
    ...s,
    calidad: s.piezasBuenas + s.piezasDefectuosas > 0
      ? parseFloat(((s.piezasBuenas / (s.piezasBuenas + s.piezasDefectuosas)) * 100).toFixed(1))
      : 0
  }))

  // Órdenes completadas con cálculo de cumplimiento
  const ordenes: ReporteOrden[] = ordenesCompletadas.map(o => ({
    folio: o.folio,
    fechaCreacion: o.fechaCreacion,
    producto: `${o.producto} ${o.color}`,
    color: o.color,
    estado: o.estado,
    materiaPrimaTotalKg: o.materiaPrimaTotalKg,
    pigmentoRequeridoGr: parseFloat((o.pigmentoRequeridoKg * 1000).toFixed(0)),
    totalPiezas: o.totalPiezas,
    piezasProducidas: o.piezasProducidas,
    cumplimiento: parseFloat(((o.piezasProducidas / o.totalPiezas) * 100).toFixed(1)),
    clienteDestino: o.clienteDestino
  }))

  return {
    totalPiezasBuenas,
    totalPiezasDefectuosas,
    calidadGlobal,
    materialConsumidoKg: ordenes.reduce((acc, o) => acc + o.materiaPrimaTotalKg, 0),
    produccionPorTurno: produccionSemana,
    parosPorMotivo,
    supervisores,
    ordenes
  }
}