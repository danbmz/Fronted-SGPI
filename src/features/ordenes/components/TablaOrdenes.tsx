import { useNavigate } from "react-router-dom";
import type { Orden } from "../schemas/orden.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  ordenes: Orden[];
}

const estadoColor: Record<string, string> = {
  BORRADOR: "bg-gray-100 text-gray-700",
  ACTIVA: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
  PAUSADA: "bg-orange-100 text-orange-700",
  COMPLETADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export default function TablaOrdenes({ ordenes }: Props) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Folio</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Máquina</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Piezas</TableHead>
          <TableHead>Material</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordenes.map((orden) => (
          <TableRow
            key={orden.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`${orden.id}`)}
          >
            <TableCell className="font-mono font-medium">{orden.folio}</TableCell>
            <TableCell>{orden.productoNombre}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{orden.cliente}</TableCell>
            <TableCell className="text-sm">{orden.maquinaNombre}</TableCell>
            <TableCell>
              <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[orden.estado]}`}>
                {orden.estado}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{orden.totalPiezas}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{orden.tipoMaterial}</TableCell>
          </TableRow>
        ))}
        {ordenes.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              No hay órdenes que coincidan con el filtro.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}