import { useNavigate } from "react-router-dom";
import type { Pedido } from "../schemas/pedido.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  pedidos: Pedido[];
}

const estadoColor: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-700",
  EN_PROCESO: "bg-blue-100 text-blue-700",
  COMPLETADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export default function TablaPedidos({ pedidos }: Props) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Progreso</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pedidos.map((pedido) => (
          <TableRow
            key={pedido.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/pedidos/${pedido.id}`)}
          >
            <TableCell className="font-mono font-medium">{pedido.numeroPedido}</TableCell>
            <TableCell>{pedido.cliente}</TableCell>
            <TableCell>
              <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[pedido.estado]}`}>
                {pedido.estado}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {pedido.ordenesCompletadas} / {pedido.totalOrdenes} órdenes
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(pedido.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
        {pedidos.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No hay pedidos registrados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}