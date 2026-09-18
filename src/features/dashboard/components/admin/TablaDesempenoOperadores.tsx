import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  datos: {
    operadorId: string;
    operadorNombre: string;
    piezasBuenas: number;
    piezasDefectuosas: number;
    porcentajeDefectos: number;
  }[];
}

function colorPorPorcentaje(porcentaje: number): string {
  if (porcentaje >= 15) return "bg-red-100 text-red-700";
  if (porcentaje >= 5) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}

export default function TablaDesempenoOperadores({ datos }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Desempeño por operador — últimos 7 días</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operador</TableHead>
            <TableHead>Piezas buenas</TableHead>
            <TableHead>Piezas defectuosas</TableHead>
            <TableHead>% Defectos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datos.map((op) => (
            <TableRow key={op.operadorId}>
              <TableCell className="font-medium">{op.operadorNombre}</TableCell>
              <TableCell className="text-sm">{op.piezasBuenas}</TableCell>
              <TableCell className="text-sm">{op.piezasDefectuosas}</TableCell>
              <TableCell>
                <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorPorPorcentaje(op.porcentajeDefectos)}`}>
                  {op.porcentajeDefectos.toFixed(1)}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {datos.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                Sin datos de producción en este periodo.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}