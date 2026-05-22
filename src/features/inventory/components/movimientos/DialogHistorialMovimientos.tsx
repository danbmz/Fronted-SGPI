import { useState, useEffect } from "react"
import type { MovimientoInventario } from "@/validations/inventario/inventarioValidations"
import { getHistorialMovimientos } from "../../services/history/historialMovimientosService"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { ArrowUpCircle, ArrowDownCircle, SlidersHorizontal } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  inventarioId: string
  tipoInventario: MovimientoInventario["tipoInventario"]
  titulo: string
  subtitulo?: string
}

const colorMovimiento: Record<string, string> = {
  entrada:       "text-green-600",
  consumo:       "text-red-600",
  ajuste_manual: "text-yellow-600"
}

const iconoMovimiento = (tipo: string) => {
  if (tipo === "entrada")       return <ArrowUpCircle size={14} className="text-green-600" />
  if (tipo === "consumo")       return <ArrowDownCircle size={14} className="text-red-600" />
  if (tipo === "ajuste_manual") return <SlidersHorizontal size={14} className="text-yellow-600" />
}

const etiquetaMovimiento: Record<string, string> = {
  entrada:       "Entrada",
  consumo:       "Consumo",
  ajuste_manual: "Ajuste manual"
}

export default function DialogHistorialMovimientos({
  open, onClose, inventarioId, tipoInventario, titulo, subtitulo
}: Props) {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    const fetchHistorial = async () => {
      setLoading(true)
      try {
        const data = await getHistorialMovimientos(inventarioId, tipoInventario)
        setMovimientos(data)
      } finally {
        setLoading(false)
      }
    }
    fetchHistorial()
  }, [open, inventarioId, tipoInventario])

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Historial de movimientos</DialogTitle>
          <DialogDescription>
            {titulo}{subtitulo ? ` — ${subtitulo}` : ""}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground py-4 text-sm">Cargando historial...</p>
        ) : movimientos.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm text-center">
            No hay movimientos registrados.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Anterior</TableHead>
                <TableHead>Diferencia</TableHead>
                <TableHead>Nuevo</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatFecha(m.fecha)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {iconoMovimiento(m.tipoMovimiento)}
                      <span className={`text-xs font-medium ${colorMovimiento[m.tipoMovimiento]}`}>
                        {etiquetaMovimiento[m.tipoMovimiento]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{m.cantidadAnterior}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${m.diferencia > 0 ? "text-green-600" : "text-red-600"}`}>
                      {m.diferencia > 0 ? `+${m.diferencia}` : m.diferencia}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{m.cantidadNueva}</TableCell>
                  <TableCell className="text-sm max-w-48 truncate" title={m.motivo}>
                    {m.motivo}
                  </TableCell>
                  <TableCell className="text-sm">{m.creadoPor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}