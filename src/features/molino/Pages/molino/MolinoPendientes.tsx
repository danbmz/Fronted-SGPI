import { useState, useEffect } from "react"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import { getMoliendas } from "../../services/moliendaService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { Molienda } from "@/validations/molino/moliendaValidations"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

export default function MolinoPendientes() {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [moliendas, setMoliendas] = useState<Molienda[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMaterial, setFiltroMaterial] = useState("todos")

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [ordenesData, avancesData, moliendasData] = await Promise.all([
          getOrdenesProduccion(),
          getAvancesTurno(),
          getMoliendas()
        ])
        setOrdenes(ordenesData.filter(o => o.estado === "en_progreso"))
        setAvances(avancesData)
        setMoliendas(moliendasData)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  const materiales = [...new Set(ordenes.map(o => o.materiaPrima))]

  const ordenesFiltradas = ordenes.filter(o =>
    filtroMaterial === "todos" || o.materiaPrima === filtroMaterial
  )

  const calcularMerma = (ordenId: string) => {
    const avancesOrden = avances.filter(a => a.ordenId === ordenId)
    return {
      merma: avancesOrden.reduce((acc, a) => acc + a.kgMerma, 0),
      plasta: avancesOrden.reduce((acc, a) => acc + a.kgPlasta, 0)
    }
  }

  const calcularMolido = (ordenId: string) =>
    moliendas
      .filter(m => m.ordenesIds.includes(ordenId))
      .reduce((acc, m) => acc + m.kgIngresados, 0)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Órdenes en progreso con merma disponible para moler.
        </p>
      </div>

      <Select value={filtroMaterial} onValueChange={setFiltroMaterial}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Filtrar por material" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los materiales</SelectItem>
          {materiales.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <p className="text-muted-foreground">Cargando datos...</p>
      ) : ordenesFiltradas.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay órdenes con merma pendiente.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {ordenesFiltradas.map(orden => {
            const { merma, plasta } = calcularMerma(orden.id)
            const molido = calcularMolido(orden.id)
            const disponible = merma + plasta - molido

            return (
              <div key={orden.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-medium">{orden.folio}</span>
                  <span className="text-sm">{orden.producto} — {orden.color}</span>
                  <span className="text-xs text-muted-foreground">{orden.materiaPrima}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Merma + Plasta</span>
                    <span className="font-medium text-red-600">{(merma + plasta).toFixed(1)} kg</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Ya molido</span>
                    <span className="font-medium text-green-600">{molido.toFixed(1)} kg</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Disponible</span>
                    <span className={`font-semibold ${disponible > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                      {disponible.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}