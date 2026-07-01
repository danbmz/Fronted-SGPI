import { useState, useEffect } from "react"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import { confirmarRecepcionMolino } from "../../services/moliendaService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import DialogReportarDiferencia from "../../components/molino/DialogReportarDiferencia"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MolinoPendientes() {
  const { user } = useAuth()
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filtroMaterial, setFiltroMaterial] = useState("todos")
  const [avanceSeleccionado, setAvanceSeleccionado] = useState<AvanceTurno | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [ordenesData, avancesData] = await Promise.all([
          getOrdenesProduccion(),
          getAvancesTurno(),
        ])
        setOrdenes(ordenesData.filter(o => o.estado === "en_progreso"))
        setAvances(avancesData.filter(a => a.estado === "cerrado"))
      } finally {
        setLoading(false)
      } 
    }
    fetchDatos()
  }, [])

  const handleConfirmar = async (avance: AvanceTurno) => {
    if (!user) return
    setIsSubmitting(true)
    try {
      const avanceActualizado = await confirmarRecepcionMolino(avance, user)
      setAvances(prev => prev.map(a => a.id === avanceActualizado.id ? avanceActualizado : a))
      toast.success(`Recepción confirmada — ${avance.folio} turno ${avance.turno}.`)
    } catch {
      toast.error("Error al confirmar la recepción.")
    } finally {
      setIsSubmitting(false)
    }

  }

  const handleDiferenciaGuardada = (avanceActualizado: AvanceTurno) => {
    setAvances(prev => prev.map(a => a.id === avanceActualizado.id ? avanceActualizado : a))
    setAvanceSeleccionado(null)
    setDialogAbierto(false)
  }

  // Agrupa avances por orden
  const materiales = [...new Set(ordenes.map(o => o.materiaPrima))]

  const ordenesFiltradas = ordenes.filter(o =>
    filtroMaterial === "todos" || o.materiaPrima === filtroMaterial
  )

  const getAvancesPorOrden = (ordenId: string) =>
    avances.filter(a => a.ordenId === ordenId)

  const calcularTotales = (avancesOrden: AvanceTurno[]) => ({
    kgMerma: avancesOrden.reduce((acc, a) => acc + a.kgMerma, 0),
    kgPlasta: avancesOrden.reduce((acc, a) => acc + a.kgPlasta, 0),
    piezasDefectuosas: avancesOrden.reduce((acc, a) => acc + a.piezasDefectuosas, 0),
    piezasCambioColor: avancesOrden.reduce((acc, a) => acc + a.piezasCambioColor, 0)
  })

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Confirma o reporta diferencias en la merma recibida de cada turno.
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
        <div className="flex flex-col gap-4">
          {ordenesFiltradas.map(orden => {
            const avancesOrden = getAvancesPorOrden(orden.id)
            if (avancesOrden.length === 0) return null
            const totales = calcularTotales(avancesOrden)

            return (
              <div key={orden.id} className="border rounded-lg overflow-hidden">

                {/* Header de la orden */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-sm">{orden.folio}</span>
                    <span className="font-medium">{orden.producto} — {orden.color}</span>
                    <span className="text-sm text-muted-foreground">{orden.materiaPrima}</span>
                  </div>
                  {/* Totales acumulados */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Total merma: <span className="font-medium text-red-600">{totales.kgMerma.toFixed(1)} kg</span>
                    </span>
                    <span className="text-muted-foreground">
                      Total plasta: <span className="font-medium text-orange-600">{totales.kgPlasta.toFixed(1)} kg</span>
                    </span>
                    <span className="text-muted-foreground">
                      Pzas defectuosas: <span className="font-medium">{totales.piezasDefectuosas}</span>
                    </span>
                    {totales.piezasCambioColor > 0 && (
                      <span className="text-muted-foreground">
                        Cambio color: <span className="font-medium">{totales.piezasCambioColor}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Avances por turno */}
                <div className="divide-y">
                  {avancesOrden.map(avance => {
                    const confirmado = avance.confirmacionMolino?.confirmado
                    const hayDiferencia = avance.confirmacionMolino?.hayDiferencia

                    return (
                      <div key={avance.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{avance.turno}</span>
                            <span className="text-xs text-muted-foreground">
                              {avance.supervisorNombre} · {avance.fecha}
                            </span>
                            {hayDiferencia && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
                                Diferencia reportada
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{avance.kgMerma} kg merma</span>
                            <span>{avance.kgPlasta} kg plasta</span>
                            <span>{avance.piezasDefectuosas} pzas defectuosas</span>
                            {avance.piezasCambioColor > 0 && (
                              <span>{avance.piezasCambioColor} pzas cambio color</span>
                            )}
                          </div>
                          {/* Muestra lo recibido si hay diferencia */}
                          {hayDiferencia && avance.confirmacionMolino && (
                            <div className="flex items-center gap-4 text-xs text-orange-600 mt-0.5">
                              <span>Recibido: {avance.confirmacionMolino.kgMermaRecibida} kg merma</span>
                              <span>{avance.confirmacionMolino.kgPlastaRecibida} kg plasta</span>
                              <span>{avance.confirmacionMolino.piezasMalasRecibidas} pzas defectuosas</span>
                              {avance.confirmacionMolino.piezasCambioColorRecibidas > 0 && (
                                <span>{avance.confirmacionMolino.piezasCambioColorRecibidas} pzas cambio color</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2 ml-4">
                          {confirmado ? (
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                              hayDiferencia
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              <CheckCircle size={12} />
                              {hayDiferencia ? "Confirmado con diferencia" : "Confirmado"}
                            </span>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  setAvanceSeleccionado(avance)
                                  setDialogAbierto(true)
                                }}
                              >
                                <AlertTriangle size={14} className="mr-1" />
                                Reportar diferencia
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleConfirmar(avance)}
                                disabled={isSubmitting}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Confirmar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DialogReportarDiferencia
        open={dialogAbierto}
        avance={avanceSeleccionado}
        onClose={() => {
          setDialogAbierto(false)
          setAvanceSeleccionado(null)
        }}
        onSuccess={handleDiferenciaGuardada}
      />
    </div>
  )
}