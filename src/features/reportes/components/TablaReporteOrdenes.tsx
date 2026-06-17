import type { ReporteOrden } from "../services/reportesService"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Props {
  ordenes: ReporteOrden[]
  onExportar: () => void
}

export default function TablaReporteOrdenes({ ordenes, onExportar }: Props) {
  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <p className="font-medium text-sm">Reporte de órdenes completadas</p>
          <p className="text-xs text-muted-foreground">
            {ordenes.length} {ordenes.length === 1 ? "orden" : "órdenes"} en el período
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onExportar}>
          <Download size={14} className="mr-1" />
          Exportar Excel
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Material (kg)</TableHead>
            <TableHead>Pigmento (gr)</TableHead>
            <TableHead>Piezas plan.</TableHead>
            <TableHead>Piezas prod.</TableHead>
            <TableHead>% Cumpl.</TableHead>
            <TableHead>Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No hay órdenes completadas en este período.
              </TableCell>
            </TableRow>
          ) : (
            ordenes.map(o => (
              <TableRow key={o.folio}>
                <TableCell className="font-mono text-xs font-medium">{o.folio}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatFecha(o.fechaCreacion)}
                </TableCell>
                <TableCell className="text-sm">{o.producto}</TableCell>
                <TableCell>{o.materiaPrimaTotalKg.toLocaleString()}</TableCell>
                <TableCell>{o.pigmentoRequeridoGr.toLocaleString()}</TableCell>
                <TableCell>{o.totalPiezas.toLocaleString()}</TableCell>
                <TableCell>{o.piezasProducidas.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    o.cumplimiento >= 100
                      ? "bg-green-100 text-green-700"
                      : o.cumplimiento >= 80
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {o.cumplimiento}%
                  </span>
                </TableCell>
                <TableCell className="text-sm">{o.clienteDestino}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}