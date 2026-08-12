// src/pages/pigmentos/PigmentosAlertas.tsx
import { useState, useEffect } from "react"
import { getAvancesTurno } from "../../../avancesTurno/services/avanceTurnoService"
import { confirmarSobrante, confirmarMaterialPreparado, confirmarMaterialSiguiente } from "../../services/pigmentosOrdenesService"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenService"
import { getInfoMaquinas, type InfoMaquina } from "../../services/pigmentosOrdenesService"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import { AlertTriangle, Package, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PigmentosAlertas() {
  const { user } = useAuth()
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [infoMaquinas, setInfoMaquinas] = useState<InfoMaquina[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [avancesData, ordenesData, maquinasData] = await Promise.all([
          getAvancesTurno(),
          getOrdenesProduccion(),
          getInfoMaquinas()
        ])
        setAvances(avancesData)
        setOrdenes(ordenesData)
        setInfoMaquinas(maquinasData)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  // ── Handlers ─────────────────────────────────────────────────
  const handleConfirmarSobrante = async (avance: AvanceTurno) => {
    if (!user) return
    setIsLoading(true)
    try {
      const avanceActualizado = await confirmarSobrante(avance, user)
      setAvances(prev => prev.map(a => a.id === avanceActualizado.id ? avanceActualizado : a))
      toast.success(`Sobrante de ${avance.kgSobrante}kg confirmado.`)
    } catch {
      toast.error("Error al confirmar el sobrante.")
    } finally{
        setIsLoading(false)
    }
  }

  const handleConfirmarEnvioMaterial = async (avance: AvanceTurno) => {
    if (!user) return
    setIsLoading(true)
    try {
      const avanceActualizado = await confirmarMaterialPreparado(avance, user)
      setAvances(prev => prev.map(a => a.id === avanceActualizado.id ? avanceActualizado : a))
      toast.success(`Material enviado confirmado para ${avance.folio}.`)
    } catch {
      toast.error("Error al confirmar el material.")
    } finally {
        setIsLoading(false)
    }
  }

  const handleConfirmarMaterialSiguiente = async (orden: OrdenProduccion) => {
    if (!user) return
    setIsLoading(true)
    try {
      const ordenActualizada = await confirmarMaterialSiguiente(orden, user)
      setOrdenes(prev => prev.map(o => o.id === ordenActualizada.id ? ordenActualizada : o))
      toast.success(`Material listo para ${orden.folio}.`)
    } catch {
      toast.error("Error al confirmar el material.")
    } finally {
        setIsLoading(false)
    }
  }

  // ── Construcción de alertas ───────────────────────────────────

  // 1. Material faltante — solicitudes no confirmadas
  const alertasFaltante = avances.flatMap(avance =>
    avance.solicitudesMaterial
      .filter(s => !s.confirmado)
      .map(s => ({ avance, solicitud: s }))
  )

  // 2. Material sobrante — avances cerrados con sobrante no confirmado
  const alertasSobrante = avances.filter(a =>
    a.estado === "cerrado" &&
    a.kgSobrante > 0 &&
    !a.sobranteConfirmado
  )

  // 3. Órdenes por terminar — máquinas en rojo con siguiente orden sin confirmar
  const alertasPorTerminar = infoMaquinas.filter(m =>
    m.colorSemaforo === "rojo" &&
    m.siguienteOrden !== null &&
    !ordenes.find(o => o.id === m.siguienteOrden?.id)?.materialSiguienteConfirmado
  )

  const totalAlertas = alertasFaltante.length + alertasSobrante.length + alertasPorTerminar.length

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Solicitudes y notificaciones pendientes de atender.
          </p>
        </div>
        {totalAlertas > 0 && (
          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
            {totalAlertas} pendiente{totalAlertas > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando alertas...</p>
      ) : totalAlertas === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <CheckCircle size={32} className="text-green-500" />
          <p className="text-sm">No hay alertas pendientes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">

          {/* ── Órdenes por terminar ── */}
          {alertasPorTerminar.map(info => {
            const siguiente = ordenes.find(o => o.id === info.siguienteOrden?.id)
            if (!siguiente) return null
            const kgVirgen = siguiente.tipoMaterial === "mezcla"
              ? (siguiente.materiaPrimaTotalKg * siguiente.porcentajeVirgen) / 100
              : siguiente.materiaPrimaTotalKg
            const kgMolido = siguiente.tipoMaterial === "mezcla"
              ? (siguiente.materiaPrimaTotalKg * siguiente.porcentajeMolido) / 100
              : 0
            const grPigmento = siguiente.materiaPrimaTotalKg * (info.siguienteOrden?.dosisGrPorKg ?? 0)

            return (
              <div key={`terminar-${info.maquina.id}`}
                className="border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start justify-between gap-4 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Preparar material — {info.maquina.nombre}
                    </p>
                    <p className="text-sm font-medium">
                      {siguiente.folio} — {siguiente.producto} {siguiente.color}
                    </p>

                    {/* Material a preparar */}
                    <div className="flex flex-col gap-0.5 mt-1 border-t border-blue-200 dark:border-blue-800 pt-2">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                        Material a preparar:
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {siguiente.materiaPrima} —{" "}
                        <span className="font-medium">{kgVirgen.toFixed(1)} kg</span> virgen
                      </p>
                      {kgMolido > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Molido {siguiente.color} —{" "}
                          <span className="font-medium">{kgMolido.toFixed(1)} kg</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Pigmento: {siguiente.pigmento} —{` ${siguiente.tipoPigmento} - `}
                        <span className="font-medium">{grPigmento.toFixed(0)} gr</span>
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleConfirmarMaterialSiguiente(siguiente)}
                  disabled={isLoading}
                >
                  <CheckCircle size={14} className="mr-1" />
                  {isLoading ? "Confirmando" : "Material listo"}
                </Button>
              </div>
            )
          })}

          {/* ── Material faltante ── */}
          {alertasFaltante.map(({ avance, solicitud }) => (
            <div key={`faltante-${solicitud.id}`}
              className="border border-red-200 dark:border-red-900 rounded-lg p-4 flex items-start justify-between gap-4 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Material faltante
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{avance.folio}</span> —{" "}
                    {avance.producto} {avance.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Turno {avance.turno} · {avance.supervisorNombre} · {avance.maquina}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Se solicitan{" "}
                    <span className="text-red-600">{solicitud.kgSolicitados} kg</span>{" "}
                    adicionales
                  </p>
                  {solicitud.motivo && (
                    <p className="text-xs text-muted-foreground">
                      Motivo: {solicitud.motivo}
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleConfirmarEnvioMaterial(avance)}
                disabled={isLoading}
              >
                <CheckCircle size={14} className="mr-1" />
                {isLoading ? "Confirmando" : "Confirmar envío"}
              </Button>
            </div>
          ))}

          {/* ── Material sobrante ── */}
          {alertasSobrante.map(avance => (
            <div key={`sobrante-${avance.id}`}
              className="border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 flex items-start justify-between gap-4 bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-start gap-3">
                <Package size={18} className="text-yellow-600 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    Material sobrante
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{avance.folio}</span> —{" "}
                    {avance.producto} {avance.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Turno {avance.turno} · {avance.supervisorNombre} · {avance.maquina}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Regresan{" "}
                    <span className="text-yellow-600">{avance.kgSobrante} kg</span>{" "}
                    de material
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleConfirmarSobrante(avance)}
                disabled={isLoading}
              >
                <CheckCircle size={14} className="mr-1" />
                {isLoading ? "Confirmando" : "Confirmar recepción"}
              </Button>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}