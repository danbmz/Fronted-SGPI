import { useState, useEffect } from "react"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService"
import { getAvancesTurno } from "../../services/avancesTurnoService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import TarjetaOrdenAvances from "../../components/admin/TarjetaOrdenAvances"

export default function SeguimientoOrdenes() {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMaquina, setFiltroMaquina] = useState<string>("todas")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [ordenesData, avancesData] = await Promise.all([
          getOrdenesProduccion(),
          getAvancesTurno()
        ])
        setOrdenes(ordenesData.filter(o =>
          o.estado === "activa" || o.estado === "en_progreso"
        ))
        setAvances(avancesData)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  // Lista de máquinas únicas para el filtro
  const maquinas = [...new Set(ordenes.map(o => o.maquina))]

  const ordenesFiltradas = ordenes.filter(o => {
    const coincideMaquina = filtroMaquina === "todas" || o.maquina === filtroMaquina
    const coincideEstado = filtroEstado === "todos" || o.estado === filtroEstado
    return coincideMaquina && coincideEstado
  })

  const limpiarFiltros = () => {
    setFiltroMaquina("todas")
    setFiltroEstado("todos")
  }

  const hayFiltros = filtroMaquina !== "todas" || filtroEstado !== "todos"

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Consulta el avance de producción de todas las órdenes activas.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filtroMaquina} onValueChange={setFiltroMaquina}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Máquina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las máquinas</SelectItem>
            {maquinas.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="activa">Activa</SelectItem>
            <SelectItem value="en_progreso">En progreso</SelectItem>
          </SelectContent>
        </Select>

        {hayFiltros && (
          <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        )}

        <span className="text-xs text-muted-foreground ml-auto">
          {ordenesFiltradas.length} de {ordenes.length} órdenes
        </span>
      </div>

      {/* Órdenes */}
      {loading ? (
        <p className="text-muted-foreground">Cargando órdenes...</p>
      ) : ordenesFiltradas.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No hay órdenes que coincidan con los filtros seleccionados.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {ordenesFiltradas.map(orden => (
            <TarjetaOrdenAvances
              key={orden.id}
              orden={orden}
              avances={avances.filter(a => a.ordenId === orden.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}