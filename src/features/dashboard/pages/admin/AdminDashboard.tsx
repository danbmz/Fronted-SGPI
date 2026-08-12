import { useState, useEffect } from "react"
import { getDashboardData, type ResumenDashboard } from "../../services/dashboardService"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import {
  Package, TrendingUp, Clock, AlertTriangle
} from "lucide-react"
import CardResumen from "../../components/admin/CardResumen"
import GraficaProduccion from "../../components/admin/GraficaProduccion"
import GraficaParos from "../../components/admin/GraficaParos"
import TablaOrdenesRecientes from "../../components/admin/TablaOrdenesRecientes"
import ListaAlertasStock from "../../components/admin/ListaAlertasStock"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import { getAvancesTurno } from "@/features/avancesTurno/services/avanceTurnoService"

export default function AdminDashboard() {
  const [datos, setDatos] = useState<ResumenDashboard | null>(null)
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true)
      try {
        const [dashData, ordenesData, avancesData] = await Promise.all([
          getDashboardData(),
          getOrdenesProduccion(),
          getAvancesTurno()
        ])
        setDatos(dashData)
        setOrdenes(ordenesData.slice(0, 5)) // últimas 5 órdenes
        setAvances(avancesData)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  if (!datos) return null
  // console.log(datos)


  const eficiencia = datos.piezasSemana > 0
    ? Math.round((datos.piezasSemana / (datos.piezasSemana + datos.defectuosasSemana)) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Resumen de producción — semana actual (Jue–Jue)
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando datos...</p>
      ) : (
        <>
            {/* Cards de resumen */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <CardResumen
                titulo="Órdenes activas"
                valor={`${datos.ordenesActivas + datos.ordenesEnProgreso}`}
                subtitulo={`${datos.ordenesActivas} activas · ${datos.ordenesEnProgreso} en progreso`}
                icono={<Package size={18} />}
                color="blue"
                />
                <CardResumen
                titulo="Piezas esta semana"
                valor={datos.piezasSemana.toLocaleString()}
                subtitulo={`Eficiencia: ${eficiencia}%`}
                icono={<TrendingUp size={18} />}
                color="green"
                />
                <CardResumen
                titulo="Minutos de paro"
                valor={datos.minutosParoSemana.toLocaleString()}
                subtitulo={`Principal: ${datos.motivoPrincipal}`}
                icono={<Clock size={18} />}
                color="orange"
                />
                <CardResumen
                titulo="Merma acumulada"
                valor={`${datos.kgMermaSemana.toFixed(1)} kg`}
                subtitulo="Semana actual"
                icono={<AlertTriangle size={18} />}
                color="red"
                />
                {datos.alertasStock.length > 0 && 
                    <CardResumen
                        titulo="Alertas de Stock"
                        valor={`${datos.alertasStock.length}`}
                        subtitulo="Material por debajo del mínimo"
                        icono={<AlertTriangle size={18} />}
                        color={"red"}
                    />
                }
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GraficaProduccion datos={datos.produccionSemana} />
                <GraficaParos datos={datos.parosPorMotivo} />
            </div>

            {/* Tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TablaOrdenesRecientes ordenes={ordenes} avances={avances} />
                <ListaAlertasStock alertas={datos.alertasStock} />
            </div>
        </>
      )}
    </div>
  )
}