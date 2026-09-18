import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

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

export default function TarjetaDesempenoOperadoresReporte({ datos }: Props) {

  const handleExportarSeccion = () => {
    const filas = datos.map((op) => ({
      Operador: op.operadorNombre,
      "Piezas buenas": op.piezasBuenas,
      "Piezas defectuosas": op.piezasDefectuosas,
      "% Defectos": op.porcentajeDefectos,
    }));
    exportarSeccionAExcel("Desempeño Operadores", filas, "desempeno_operadores");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Desempeño por operador</h3>
        <Button variant="outline" size="sm">
          <Download size={14} className="mr-1" onClick={handleExportarSeccion}/>
          Exportar
        </Button>
      </div>
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
                Sin datos de producción en este rango.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}