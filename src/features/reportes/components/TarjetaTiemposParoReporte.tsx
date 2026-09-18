import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

interface Props {
  totalMinutos: number;
  porMotivo: { nombre: string; minutos: number }[];
}

function formatearHorasMinutos(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
}

export default function TarjetaTiemposParoReporte({ totalMinutos, porMotivo }: Props) {
  const alturaGrafica = Math.max(200, porMotivo.length * 40);

  const handleExportarSeccion = () => {
    const filas = porMotivo.map((m) => ({ Motivo: m.nombre, Minutos: m.minutos }));
    exportarSeccionAExcel("Tiempos de Paro", filas, "tiempos_paro");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Tiempos de paro por motivo</h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{formatearHorasMinutos(totalMinutos)}</span>
          <Button variant="outline" size="sm" onClick={handleExportarSeccion}>
            <Download size={14} className="mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      {porMotivo.length > 0 ? (
        <ResponsiveContainer width="100%" height={alturaGrafica}>
          <BarChart data={porMotivo} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" fontSize={12} />
            <YAxis type="category" dataKey="nombre" width={140} fontSize={12} />
            <Tooltip formatter={(value) => formatearHorasMinutos(Number(value ?? 0))} />
            <Bar dataKey="minutos" name="Minutos" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12">Sin tiempos de paro registrados.</p>
      )}
    </div>
  );
}