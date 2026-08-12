import { useState } from "react"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno, Turno } from "@/validations/avancesTurno/avanceTurnoValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import DialogAbrirAvance from "./DialogAbrirAvance"
import { getFechaTurnoActual } from "../../services/avanceTurnoService"

interface Props {
  ordenes: OrdenProduccion[]
  avances: AvanceTurno[]
  turnoActual: Turno
  onAvanceAbierto: (avance: AvanceTurno, orden: OrdenProduccion) => void
}

export default function TablaOrdenesActivas({
  ordenes, avances, turnoActual, onAvanceAbierto
}: Props) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenProduccion | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  // Verifica si ya existe un avance abierto para esta orden en el turno actual
  const tieneAvanceAbierto = (ordenId: string) => {
    const fechaTurnoActual = getFechaTurnoActual();
    return avances.some(a =>
      a.ordenId === ordenId &&
      a.turno === turnoActual &&
      a.fecha === fechaTurnoActual &&
      a.estado === "abierto"
    )
  }

  const calcularPiezas = (ordenId: string): number => {
    return avances
        .filter(a => a.ordenId === ordenId)
        .reduce((total, avance) => total + avance.piezasBuenas, 0)
  }

  const colorEstado: Record<string, string> = {
    activa:      "bg-blue-100 text-blue-700",
    en_progreso: "bg-yellow-100 text-yellow-700"
  }

  const etiquetaEstado: Record<string, string> = {
    activa:      "Activa",
    en_progreso: "En progreso"
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Máquina</TableHead>
            <TableHead>Piezas objetivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.map((orden) => {
            const avanceAbierto = tieneAvanceAbierto(orden.id)
            const total = calcularPiezas(orden.id)
            return (
              <TableRow key={orden.id}>
                <TableCell className="font-mono text-sm font-medium">
                  {orden.folio}
                </TableCell>
                <TableCell className="font-medium">{orden.producto}</TableCell>
                <TableCell>{orden.color}</TableCell>
                <TableCell>{orden.maquina}</TableCell>
                <TableCell>{total.toLocaleString()}/{orden.totalPiezas.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado[orden.estado]}`}>
                    {etiquetaEstado[orden.estado]}
                  </span>
                </TableCell>
                <TableCell>
                  {avanceAbierto ? (
                    <span className="text-xs text-muted-foreground">
                      Avance en curso
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOrdenSeleccionada(orden)
                        setDialogAbierto(true)
                      }}
                    >
                      <PlayCircle size={14} className="mr-1" />
                      Iniciar avance
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {ordenes.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay órdenes activas o en progreso.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogAbrirAvance
        open={dialogAbierto}
        orden={ordenSeleccionada}
        turnoActual={turnoActual}
        onClose={() => {
          setDialogAbierto(false)
          setOrdenSeleccionada(null)
        }}
        onSuccess={onAvanceAbierto}
      />
    </>
  )
}