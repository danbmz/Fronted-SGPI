import type { PedidoDetalle } from "../schemas/pedido.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";

interface Props {
  detalle: PedidoDetalle[];
}

export default function TablaDetallePedido({ detalle }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Solicitado</TableHead>
          <TableHead>Producido</TableHead>
          <TableHead>Entregado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detalle.map((linea) => (
          <TableRow key={linea.id}>
            <TableCell className="font-medium">{linea.productoNombre}</TableCell>
            <TableCell>{linea.pigmentoColor ?? <span className="text-muted-foreground">Sin especificar</span>}</TableCell>
            <TableCell>{linea.cantidadSolicitada}</TableCell>
            <TableCell>{linea.cantidadProducida}</TableCell>
            <TableCell>{linea.cantidadEntregada}</TableCell>
          </TableRow>
        ))}
        {detalle.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              Este pedido no tiene líneas de detalle todavía.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}