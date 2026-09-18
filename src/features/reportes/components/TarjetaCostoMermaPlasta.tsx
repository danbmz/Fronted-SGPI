import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

interface Props {
  costoTotalGeneral: number;
  porMaterial: { nombre: string; kgMerma: number; kgPlasta: number; costoTotal: number }[];
}

function formatearMoneda(valor: number): string {
  return valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function TarjetaCostoMermaPlasta({ costoTotalGeneral, porMaterial }: Props) {

  const handleExportarSeccion = () => {
    const filas = porMaterial.map((m) => ({
      Material: m.nombre,
      "Kg merma": m.kgMerma,
      "Kg plasta": m.kgPlasta,
      "Costo total": m.costoTotal,
    }));
    exportarSeccionAExcel("Costo Merma-Plasta", filas, "costo_merma_plasta");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Costo de merma y plasta</h3>
        <Button variant="outline" size="sm" onClick={handleExportarSeccion}>
          <Download size={14} className="mr-1" />
          Exportar
        </Button>
      </div>

      <div className="mb-4">
        <span className="text-xs text-muted-foreground">Costo total estimado</span>
        <p className="text-2xl font-bold text-red-600">{formatearMoneda(costoTotalGeneral)}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Kg merma</TableHead>
            <TableHead>Kg plasta</TableHead>
            <TableHead>Costo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {porMaterial.map((m) => (
            <TableRow key={m.nombre}>
              <TableCell className="font-medium">{m.nombre}</TableCell>
              <TableCell className="text-sm">{m.kgMerma.toFixed(3)}</TableCell>
              <TableCell className="text-sm">{m.kgPlasta.toFixed(3)}</TableCell>
              <TableCell className="font-medium">{formatearMoneda(m.costoTotal)}</TableCell>
            </TableRow>
          ))}
          {porMaterial.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                Sin merma o plasta registrada en este rango.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}