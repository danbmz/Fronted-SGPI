import { useState, useEffect } from "react"
import { getReportes, type ReporteProduccion } from "@/features/reportes/services/reportesService"
import { exportarReporteOrdenes } from "@/lib/exportarExcell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TrendingUp, AlertTriangle, Package, CheckCircle } from "lucide-react"
import CardResumen from "@/features/dashboard/components/admin/CardResumen"
import GraficaProduccion from "@/features/dashboard/components/admin/GraficaProduccion"
import GraficaParos from "@/features/dashboard/components/admin/GraficaParos"
import TablaSupervisores from "../components/TablaSupervisores"
import TablaEficienciaOrdenes from "../components/TablaEficienciaOrdenes"
import TablaReporteOrdenes from "../components/TablaReporteOrdenes"

// Semana actual (Jue-Jue por defecto)
const getDefaultFechas = () => {
  const hoy = new Date()
  const dia = hoy.getDay()
  const diasDesdeJueves = (dia + 3) % 7
  const jueves = new Date(hoy)
  jueves.setDate(hoy.getDate() - diasDesdeJueves)
  const juevesSig = new Date(jueves)
  juevesSig.setDate(jueves.getDate() + 6)
  return {
    inicio: jueves.toISOString().split("T")[0],
    fin: juevesSig.toISOString().split("T")[0]
  }
}

export default function Reportes() {
  const defaults = getDefaultFechas()
  const [fechaInicio, setFechaInicio] = useState(defaults.inicio)
  const [fechaFin, setFechaFin] = useState(defaults.fin)
  const [datos, setDatos] = useState<ReporteProduccion | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReporte = async (inicio: string, fin: string) => {
    setLoading(true)
    try {
      const data = await getReportes({ fechaInicio: inicio, fechaFin: fin })
      setDatos(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReporte(fechaInicio, fechaFin)
  }, [])

  const handleAplicarFiltro = () => {
    fetchReporte(fechaInicio, fechaFin)
  }

  const handleExportar = () => {
    if (!datos) return
    const periodo = `${fechaInicio}_${fechaFin}`
    exportarReporteOrdenes(datos.ordenes, periodo)
  }

  const periodo = `${new Date(fechaInicio).toLocaleDateString("es-MX")} — ${new Date(fechaFin).toLocaleDateString("es-MX")}`

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Análisis de producción, calidad, paros y materiales.
          </p>
        </div>
      </div>

      {/* Selector de período global */}
      <div className="flex items-end gap-3 flex-wrap border rounded-lg px-4 py-3 bg-muted/30">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Desde</Label>
          <Input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Hasta</Label>
          <Input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="w-40"
          />
        </div>
        <Button onClick={handleAplicarFiltro} disabled={loading}>
          {loading ? "Cargando..." : "Aplicar período"}
        </Button>
        <span className="text-xs text-muted-foreground ml-auto self-center">
          Período: {periodo}
        </span>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando reporte...</p>
      ) : datos ? (
        <>
          {/* Cards de resumen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardResumen
              titulo="Total piezas buenas"
              valor={datos.totalPiezasBuenas.toLocaleString()}
              subtitulo={`+ ${datos.totalPiezasDefectuosas.toLocaleString()} defectuosas`}
              icono={<CheckCircle size={18} />}
              color="green"
            />
            <CardResumen
              titulo="Total piezas malas"
              valor={datos.totalPiezasDefectuosas.toLocaleString()}
              subtitulo="Piezas defectuosas"
              icono={<AlertTriangle size={18} />}
              color="red"
            />
            <CardResumen
              titulo="Calidad global"
              valor={`${datos.calidadGlobal}%`}
              subtitulo="Piezas buenas / total"
              icono={<TrendingUp size={18} />}
              color={datos.calidadGlobal >= 95 ? "green" : "orange"}
            />
            <CardResumen
              titulo="Material consumido"
              valor={`${datos.materialConsumidoKg.toLocaleString()} kg`}
              subtitulo="Órdenes completadas"
              icono={<Package size={18} />}
              color="blue"
            />
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GraficaProduccion datos={datos.produccionPorTurno} />
            <GraficaParos datos={datos.parosPorMotivo} />
          </div>

          {/* Tablas de análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TablaSupervisores supervisores={datos.supervisores} />
            <TablaEficienciaOrdenes ordenes={datos.ordenes} />
          </div>

          {/* Reporte de órdenes completadas */}
          <TablaReporteOrdenes
            ordenes={datos.ordenes}
            onExportar={handleExportar}
          />
        </>
      ) : null}
    </div>
  )
}