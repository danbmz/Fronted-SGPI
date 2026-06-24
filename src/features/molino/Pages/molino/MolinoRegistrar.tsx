import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registrarMoliendaSchema, type RegistrarMoliendaForm } from "@/validations/molino/moliendaValidations"
import { registrarMolienda, calcularColorMasFrecuente, getMoliendas } from "../../services/moliendaService"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { Molienda } from "@/validations/molino/moliendaValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

export default function MolinoRegistrar() {
  const { user } = useAuth()
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [moliendas, setMoliendas] = useState<Molienda[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMaterial, setFiltroMaterial] = useState<string>("")
  const [enviando, setEnviando] = useState(false)

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors }
  } = useForm<RegistrarMoliendaForm>({
    resolver: zodResolver(registrarMoliendaSchema),
    defaultValues: { ordenesIds: [] }
  })

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
  const ordenesIdsSeleccionadas = watch("ordenesIds") ?? []

  // Solo muestra órdenes del material filtrado y con merma disponible
  const calcularDisponible = (ordenId: string) => {
    const avancesOrden = avances.filter(a => a.ordenId === ordenId)
    const merma = avancesOrden.reduce((acc, a) => acc + a.kgMerma + a.kgPlasta, 0)
    const molido = moliendas
      .filter(m => m.ordenesIds.includes(ordenId))
      .reduce((acc, m) => acc + m.kgIngresados, 0)
    return merma - molido
  }

  const ordenesDisponibles = ordenes.filter(o =>
    o.materiaPrima === filtroMaterial && calcularDisponible(o.id) > 0
  )

  const toggleOrden = (ordenId: string) => {
    const actuales = ordenesIdsSeleccionadas
    if (actuales.includes(ordenId)) {
      setValue("ordenesIds", actuales.filter(id => id !== ordenId), { shouldValidate: true })
    } else {
      setValue("ordenesIds", [...actuales, ordenId], { shouldValidate: true })
    }
  }

  // Recalcula el color sugerido cada vez que cambia la selección
  useEffect(() => {
    const seleccionadas = ordenes.filter(o => ordenesIdsSeleccionadas.includes(o.id))
    if (seleccionadas.length > 0) {
      const colorSugerido = calcularColorMasFrecuente(seleccionadas)
      setValue("colorAproximado", colorSugerido)
    }
  }, [ordenesIdsSeleccionadas, ordenes, setValue])

  const totalDisponible = ordenesIdsSeleccionadas.reduce(
    (acc, id) => acc + calcularDisponible(id), 0
  )

  const onSubmit = async (data: RegistrarMoliendaForm) => {
    if (!user) return
    const ordenesSeleccionadas = ordenes.filter(o => data.ordenesIds.includes(o.id))
    const materiaPrimaId = ordenesSeleccionadas[0]?.materiaPrimaId
    if (!materiaPrimaId) return

    setEnviando(true)
    try {
      await registrarMolienda(data, ordenesSeleccionadas, materiaPrimaId, user)
      toast.success(`Molienda de ${data.kgIngresados}kg registrada correctamente.`)
      reset({ ordenesIds: [] })
      setFiltroMaterial("")
      // Refresca moliendas para actualizar disponibilidad
      const moliendasActualizadas = await getMoliendas()
      setMoliendas(moliendasActualizadas)
    } catch {
      toast.error("Error al registrar la molienda.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Selecciona las órdenes a moler — solo del mismo material base.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando órdenes...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Filtro de material */}
          <div className="flex flex-col gap-1">
            <Label>Material a moler</Label>
            <Select
              value={filtroMaterial}
              onValueChange={val => {
                setFiltroMaterial(val)
                setValue("ordenesIds", []) // limpia selección al cambiar material
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el material base" />
              </SelectTrigger>
              <SelectContent>
                {materiales.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selección de órdenes */}
          {filtroMaterial && (
            <div className="flex flex-col gap-2">
              <Label>Órdenes con merma disponible</Label>
              {ordenesDisponibles.length === 0 ? (
                <p className="text-xs text-muted-foreground px-1">
                  No hay merma pendiente para este material.
                </p>
              ) : (
                <div className="border rounded-md divide-y max-h-56 overflow-y-auto">
                  {ordenesDisponibles.map(orden => {
                    const disponible = calcularDisponible(orden.id)
                    const seleccionada = ordenesIdsSeleccionadas.includes(orden.id)
                    return (
                      <div
                        key={orden.id}
                        className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted cursor-pointer"
                        onClick={() => toggleOrden(orden.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={seleccionada} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{orden.folio}</span>
                            <span className="text-xs text-muted-foreground">
                              {orden.producto} — {orden.color}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-orange-600">
                          {disponible.toFixed(1)} kg
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {errors.ordenesIds && (
                <p className="text-xs text-red-500">{errors.ordenesIds.message}</p>
              )}
            </div>
          )}

          {/* Resumen de selección */}
          {ordenesIdsSeleccionadas.length > 0 && (
            <div className="bg-muted px-3 py-2 rounded-md text-sm">
              <span className="font-medium">{ordenesIdsSeleccionadas.length}</span> orden(es) seleccionada(s) ·{" "}
              <span className="font-medium">{totalDisponible.toFixed(1)} kg</span> disponibles para moler
            </div>
          )}

          {/* Datos de la molienda */}
          {ordenesIdsSeleccionadas.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label>Kg resultantes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("kgIngresados", { valueAsNumber: true })}
                    placeholder="0.0"
                  />
                  {errors.kgIngresados && (
                    <p className="text-xs text-red-500">{errors.kgIngresados.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Color aproximado</Label>
                  <Input
                    {...register("colorAproximado")}
                    placeholder="Sugerido automáticamente"
                  />
                  <p className="text-xs text-muted-foreground">Editable si el color no coincide.</p>
                  {errors.colorAproximado && (
                    <p className="text-xs text-red-500">{errors.colorAproximado.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Observaciones <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Textarea
                  {...register("observaciones")}
                  placeholder="Notas sobre la molienda..."
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={enviando}>
                {enviando ? "Registrando..." : "Registrar molienda"}
              </Button>
            </>
          )}
        </form>
      )}
    </div>
  )
}