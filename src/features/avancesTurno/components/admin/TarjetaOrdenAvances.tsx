import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { AlertTriangle, Clock, Package, Layers } from "lucide-react"

interface Props {
  orden: OrdenProduccion
  avances: AvanceTurno[]
}

export default function TarjetaOrdenAvances({ orden, avances }: Props) {
  const piezasProducidas = avances.reduce((acc, a) => acc + a.piezasBuenas, 0)
  const porcentaje = Math.min(100, Math.round((piezasProducidas / orden.totalPiezas) * 100))
  const kgMermaTotal = avances.reduce((acc, a) => acc + a.kgMerma + a.kgPlasta, 0)
  const minutosParoTotal = avances.reduce((acc, a) =>
    acc + a.tiemposParo.reduce((t, p) => t + p.minutos, 0), 0
  )
  const cantidadParos = avances.reduce((acc, a) => acc + a.tiemposParo.length, 0)

  const colorEstado: Record<string, string> = {
    activa:      "bg-blue-100 text-blue-700",
    en_progreso: "bg-yellow-100 text-yellow-700"
  }

  const etiquetaEstado: Record<string, string> = {
    activa:      "Activa",
    en_progreso: "En progreso"
  }

  const colorBarra = porcentaje >= 100
    ? "bg-green-500"
    : porcentaje >= 60
    ? "bg-blue-500"
    : "bg-primary"

  const formatHora = (fecha: string | null) => {
    if (!fecha) return "—"
    return new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden">

      {/* Header de la orden */}
      <div className="flex flex-col gap-3 px-4 py-3 bg-muted/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono font-medium">{orden.folio}</span>
            <span className="font-medium">{orden.producto} — {orden.color}</span>
            <span className="text-sm text-muted-foreground">{orden.maquina}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado[orden.estado]}`}>
            {etiquetaEstado[orden.estado]}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{piezasProducidas.toLocaleString()} piezas producidas</span>
            <span>{porcentaje}% — objetivo: {orden.totalPiezas.toLocaleString()}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${colorBarra}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* Resumen de métricas */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-1 text-sm">
            <Package size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Merma total:</span>
            <span className={`font-medium ${kgMermaTotal > 0 ? "text-orange-600" : ""}`}>
              {kgMermaTotal.toFixed(1)} kg
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Paros:</span>
            <span className={`font-medium ${minutosParoTotal > 0 ? "text-red-600" : ""}`}>
              {cantidadParos > 0
                ? `${cantidadParos} paro(s) — ${minutosParoTotal} min`
                : "Sin paros"
              }
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Layers size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Avances registrados:</span>
            <span className="font-medium">{avances.length}</span>
          </div>
          {orden.stockInsuficiente && (
            <div className="flex items-center gap-1 text-sm text-orange-600">
              <AlertTriangle size={14} />
              <span>Stock insuficiente</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de avances */}
      {avances.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          Esta orden aún no tiene avances registrados.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turno</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Piezas buenas</TableHead>
              <TableHead>Defectuosas</TableHead>
              <TableHead>Merma (kg)</TableHead>
              <TableHead>Plasta (kg)</TableHead>
              <TableHead>Paros</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {avances.map((avance) => {
              const minutosParoAvance = avance.tiemposParo.reduce((acc, t) => acc + t.minutos, 0)
              return (
                <TableRow key={avance.id}>
                  <TableCell className="font-medium">{avance.turno}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{avance.fecha}</TableCell>
                  <TableCell className="text-sm">{avance.supervisorNombre}</TableCell>
                  <TableCell className="text-sm">{formatHora(avance.horaInicio)}</TableCell>
                  <TableCell className="text-sm">{formatHora(avance.horaFin)}</TableCell>
                  <TableCell className="font-medium">{avance.piezasBuenas.toLocaleString()}</TableCell>
                  <TableCell>{avance.piezasDefectuosas.toLocaleString()}</TableCell>
                  <TableCell>{avance.kgMerma}</TableCell>
                  <TableCell>{avance.kgPlasta}</TableCell>
                  <TableCell>
                    {avance.tiemposParo.length > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{avance.tiemposParo.length} paro(s)</span>
                        <span className="text-xs text-muted-foreground">
                          {minutosParoAvance} min
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      avance.estado === "abierto"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {avance.estado === "abierto" ? "En curso" : "Cerrado"}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}