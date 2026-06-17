import type { ReporteOrden } from "../services/reportesService"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

interface Props {
  ordenes: ReporteOrden[]
}

export default function TablaEficienciaOrdenes({ ordenes }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b">
        <p className="font-medium text-sm">Eficiencia por orden</p>
        <p className="text-xs text-muted-foreground">Piezas producidas vs objetivo</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Meta</TableHead>
            <TableHead>Producido</TableHead>
            <TableHead>% Cumpl.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                Sin órdenes completadas en este período.
              </TableCell>
            </TableRow>
          ) : (
            ordenes.map(o => (
              <TableRow key={o.folio}>
                <TableCell className="font-mono text-xs font-medium">{o.folio}</TableCell>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}