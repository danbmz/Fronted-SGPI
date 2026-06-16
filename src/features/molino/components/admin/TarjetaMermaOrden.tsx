import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { Molienda } from "@/validations/molino/moliendaValidations"
import { CheckCircle } from "lucide-react"

interface Props {
  orden: OrdenProduccion
  avances: AvanceTurno[]
  moliendas: Molienda[]
}

export default function TarjetaMermaOrden({ orden, avances, moliendas }: Props) {
  const kgMermaTotal = avances.reduce((acc, a) => acc + a.kgMerma, 0)
  const kgPlastaTotal = avances.reduce((acc, a) => acc + a.kgPlasta, 0)
  const kgMolidoTotal = moliendas.reduce((acc, m) => acc + m.kgIngresados, 0)

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })

  const formatHora = (fecha: string) =>
    new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit", minute: "2-digit"
    })

  return (
    <div className="border rounded-lg overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
        <div className="flex items-center gap-3">
          <span className="font-mono font-medium text-sm">{orden.folio}</span>
          <span className="font-medium">{orden.producto} — {orden.color}</span>
          <span className="text-sm text-muted-foreground">{orden.maquina}</span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">
          En progreso
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* Métricas principales */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Merma acumulada</span>
            <span className="text-lg font-semibold text-red-600">
              {kgMermaTotal.toFixed(1)} kg
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900 rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Plasta acumulada</span>
            <span className="text-lg font-semibold text-orange-600">
              {kgPlastaTotal.toFixed(1)} kg
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Molido generado</span>
            <span className="text-lg font-semibold text-green-600">
              {kgMolidoTotal.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Detalle por turno */}
        {avances.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Merma por turno
            </p>
            <div className="border rounded-md divide-y">
              {avances.map(avance => (
                <div key={avance.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{avance.turno}</span>
                    <span className="text-muted-foreground text-xs">
                      {avance.supervisorNombre} · {avance.fecha}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-red-600">{avance.kgMerma} kg merma</span>
                    <span className="text-orange-600">{avance.kgPlasta} kg plasta</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      avance.estado === "abierto"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {avance.estado === "abierto" ? "En curso" : "Cerrado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moliendas registradas */}
        {moliendas.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Moliendas registradas
            </p>
            <div className="border rounded-md divide-y">
              {moliendas.map(molienda => (
                <div key={molienda.id} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {molienda.kgIngresados} kg ingresados a inventario
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{molienda.materialBase} — {molienda.colorAproximado}</span>
                    <span>{formatFecha(molienda.fecha)} {formatHora(molienda.fecha)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sin moliendas aún */}
        {moliendas.length === 0 && kgMermaTotal > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
            <span>Pendiente de molienda — {(kgMermaTotal + kgPlastaTotal).toFixed(1)} kg en espera</span>
          </div>
        )}
      </div>
    </div>
  )
}