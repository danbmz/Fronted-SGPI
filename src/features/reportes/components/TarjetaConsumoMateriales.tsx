import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

interface Props {
  costoTotalGeneral: number;
  materiaPrima: { nombre: string; kgConsumidos: number; costoTotal: number }[];
  pigmento: { color: string; kgConsumidos: number; costoTotal: number }[];
}

function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function TarjetaConsumoMateriales({ costoTotalGeneral, materiaPrima, pigmento }: Props) {

  const handleExportarSeccion = () => {
    const filas = [
      ...materiaPrima.map((m) => ({ Tipo: "Materia prima", Nombre: m.nombre, "Kg consumidos": m.kgConsumidos, Costo: m.costoTotal })),
      ...pigmento.map((p) => ({ Tipo: "Pigmento", Nombre: p.color, "Kg consumidos": p.kgConsumidos, Costo: p.costoTotal })),
    ];
    exportarSeccionAExcel("Consumo Materiales", filas, "consumo_materiales");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Consumo de materiales</h3>
        <Button variant="outline" size="sm" onClick={handleExportarSeccion}>
          <Download size={14} className="mr-1" />
          Exportar
        </Button>
      </div>

      <div className="mb-4">
        <span className="text-xs text-muted-foreground">Costo total de consumo</span>
        <p className="text-2xl font-bold">{formatearMoneda(costoTotalGeneral)}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Materia prima</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Kg consumidos</TableHead>
                <TableHead>Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiaPrima.map((m) => (
                <TableRow key={m.nombre}>
                  <TableCell className="font-medium">{m.nombre}</TableCell>
                  <TableCell className="text-sm">{m.kgConsumidos.toFixed(3)}</TableCell>
                  <TableCell className="text-sm">{formatearMoneda(m.costoTotal)}</TableCell>
                </TableRow>
              ))}
              {materiaPrima.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    Sin consumo registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Pigmento</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Kg consumidos</TableHead>
                <TableHead>Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pigmento.map((p) => (
                <TableRow key={p.color}>
                  <TableCell className="font-medium">{p.color}</TableCell>
                  <TableCell className="text-sm">{p.kgConsumidos.toFixed(3)}</TableCell>
                  <TableCell className="text-sm">{formatearMoneda(p.costoTotal)}</TableCell>
                </TableRow>
              ))}
              {pigmento.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                    Sin consumo registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}