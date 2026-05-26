import { useState } from "react"
import type { OrdenProduccion, EstadoOrden } from "@/validations/ordenes/ordenProduccionValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertTriangle } from "lucide-react"
import DialogActivarOrden from "./DialogActivarOrden"
import DialogCancelarOrden from "./DialogCancelarOrden"

interface Props {
  ordenes: OrdenProduccion[]
  onOrdenActualizada: (orden: OrdenProduccion) => void
}

const colorEstado: Record<EstadoOrden, string> = {
  borrador:    "bg-gray-100 text-gray-700",
  activa:      "bg-blue-100 text-blue-700",
  en_progreso: "bg-yellow-100 text-yellow-700",
  pausada:     "bg-orange-100 text-orange-700",
  completada:  "bg-green-100 text-green-700",
  cancelada:   "bg-red-100 text-red-700"
}

const etiquetaEstado: Record<EstadoOrden, string> = {
  borrador:    "Borrador",
  activa:      "Activa",
  en_progreso: "En progreso",
  pausada:     "Pausada",
  completada:  "Completada",
  cancelada:   "Cancelada"
}

export default function TablaOrdenesProduccion({ ordenes, onOrdenActualizada }: Props) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenProduccion | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"activar" | "cancelar" | null>(null)

  const abrirDialog = (tipo: "activar" | "cancelar", orden: OrdenProduccion) => {
    setOrdenSeleccionada(orden)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setOrdenSeleccionada(null)
    setDialogAbierto(null)
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Piezas</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Máquina</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.map((orden) => (
            <TableRow key={orden.id}>
              <TableCell className="font-mono text-sm font-medium">
                <div className="flex items-center gap-2">
                  {orden.folio}
                  {orden.stockInsuficiente && (
                    <AlertTriangle size={14} className="text-orange-500" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{orden.producto}</TableCell>
              <TableCell>{orden.color}</TableCell>
              <TableCell>{orden.totalPiezas.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{orden.materiaPrima}</span>
                  {orden.tipoMaterial === "mezcla" && (
                    <span className="text-xs text-muted-foreground">
                      {orden.porcentajeVirgen}% / {orden.porcentajeMolido}% molido
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{orden.maquina}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado[orden.estado]}`}>
                  {etiquetaEstado[orden.estado]}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatFecha(orden.fechaCreacion)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {orden.estado === "borrador" && !orden.stockInsuficiente && (
                      <DropdownMenuItem onClick={() => abrirDialog("activar", orden)}>
                        Activar orden
                      </DropdownMenuItem>
                    )}
                    {orden.estado === "borrador" && orden.stockInsuficiente && (
                      <DropdownMenuItem disabled className="text-orange-500">
                        Stock insuficiente
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {!["completada", "cancelada"].includes(orden.estado) && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => abrirDialog("cancelar", orden)}
                      >
                        Cancelar orden
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {ordenes.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No hay órdenes de producción registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogActivarOrden
        open={dialogAbierto === "activar"}
        orden={ordenSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onOrdenActualizada}
      />

      <DialogCancelarOrden
        open={dialogAbierto === "cancelar"}
        orden={ordenSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onOrdenActualizada}
      />
    </>
  )
}