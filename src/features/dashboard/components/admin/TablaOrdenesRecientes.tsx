import type { OrdenProduccion, EstadoOrden } from "@/validations/ordenes/ordenProduccionValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"

interface Props {
  ordenes: OrdenProduccion[]
  avances: AvanceTurno[]
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

export default function TablaOrdenesRecientes({ ordenes, avances }: Props) {
  
  const piezasProducidas = (ordenId: string) =>
    avances
      .filter(a => a.ordenId === ordenId)
      .reduce((acc, a) => acc + a.piezasBuenas, 0)


  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b">
        <p className="font-medium text-sm">Órdenes recientes</p>
        <p className="text-xs text-muted-foreground">Últimas 5 órdenes</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Progreso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.map(orden => {

            const producidas = piezasProducidas(orden.id)
            const porcentaje = Math.round((producidas / orden.totalPiezas) * 100)

            return (
              <TableRow key={orden.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {orden.folio}
                </TableCell>
                <TableCell className="text-sm">
                  {orden.producto} {orden.color}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorEstado[orden.estado]}`}>
                    {etiquetaEstado[orden.estado]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, porcentaje)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.min(100, porcentaje)}% ({orden.totalPiezas.toLocaleString()})
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}