import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

interface Props {
  totalCompletados: number;
  aTiempo: number;
  conRetraso: number;
  sinFechaDefinida: number;
  porcentajeCumplimiento: number;
  detalle: {
    id: string;
    numeroPedido: string;
    cliente: string;
    fechaEntrega: string | null;
    completadoEn: string;
    diasDiferencia: number | null;
  }[];
}

function formatearFecha(fechaISO: string): string {
  const [año, mes, dia] = fechaISO.split("-").map(Number);
  return new Date(año, mes - 1, dia).toLocaleDateString("es-MX");
}

export default function TarjetaCumplimientoPedidos({
  totalCompletados,
  aTiempo,
  conRetraso,
  sinFechaDefinida,
  porcentajeCumplimiento,
  detalle,
}: Props) {

  const handleExportarSeccion = () => {
    const filas = detalle.map((p) => ({
      Pedido: p.numeroPedido,
      Cliente: p.cliente,
      "Fecha de entrega": p.fechaEntrega ?? "Sin definir",
      "Completado el": p.completadoEn,
      "Días de diferencia": p.diasDiferencia ?? "N/A",
    }));
    exportarSeccionAExcel("Cumplimiento", filas, "cumplimiento_pedidos");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Cumplimiento de pedidos</h3>
        <Button variant="outline" size="sm" onClick={handleExportarSeccion}>
          <Download size={14} className="mr-1" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Completados</span>
          <span className="text-lg font-bold">{totalCompletados}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">A tiempo</span>
          <span className="text-lg font-bold text-green-600">{aTiempo}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Con retraso</span>
          <span className="text-lg font-bold text-red-600">{conRetraso}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">% Cumplimiento</span>
          <span className="text-lg font-bold">{porcentajeCumplimiento.toFixed(1)}%</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Entrega</TableHead>
            <TableHead>Completado</TableHead>
            <TableHead>Diferencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detalle.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono font-medium">{p.numeroPedido}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.cliente}</TableCell>
              <TableCell className="text-sm">{p.fechaEntrega ? formatearFecha(p.fechaEntrega) : "—"}</TableCell>
              <TableCell className="text-sm">{formatearFecha(p.completadoEn)}</TableCell>
              <TableCell>
                {p.diasDiferencia === null ? (
                  <span className="text-xs text-muted-foreground">Sin fecha</span>
                ) : p.diasDiferencia <= 0 ? (
                  <Badge className="text-xs bg-green-100 text-green-700">A tiempo</Badge>
                ) : (
                  <Badge className="text-xs bg-red-100 text-red-700">{p.diasDiferencia}d tarde</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
          {detalle.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                No hay pedidos completados en este rango.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {sinFechaDefinida > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {sinFechaDefinida} pedido(s) completado(s) sin fecha de entrega definida, no incluidos en el % de cumplimiento.
        </p>
      )}
    </div>
  );
}