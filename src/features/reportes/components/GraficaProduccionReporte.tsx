import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarSeccionAExcel } from "@/lib/exportarReportesExcel";

interface Props {
  granularidad: "dia" | "semana" | "mes";
  porPeriodo: { periodo: string; piezasBuenas: number; piezasDefectuosas: number }[];
  totalPiezasBuenas: number;
  totalPiezasDefectuosas: number;
  totalKgMerma: number;
  totalKgPlasta: number;
}

function formatearPeriodo(periodo: string, granularidad: "dia" | "semana" | "mes"): string {
  if (granularidad === "mes") {
    const [año, mes] = periodo.split("-").map(Number);
    return new Date(año, mes - 1, 1).toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
  }
  // "dia" y "semana" comparten formato de fecha corta (semana muestra el lunes de inicio)
  const [año, mes, dia] = periodo.split("-").map(Number);
  return new Date(año, mes - 1, dia).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export default function GraficaProduccionReporte({
  granularidad,
  porPeriodo,
  totalPiezasBuenas,
  totalPiezasDefectuosas,
  totalKgMerma,
  totalKgPlasta,
}: Props) {
  const datosFormateados = porPeriodo.map((p) => ({
    ...p,
    periodoCorto: formatearPeriodo(p.periodo, granularidad),
  }));

  const handleExportarSeccion = () => {
    const filas = porPeriodo.map((p) => ({
      Periodo: p.periodo,
      "Piezas buenas": p.piezasBuenas,
      "Piezas defectuosas": p.piezasDefectuosas,
    }));
    exportarSeccionAExcel("Producción", filas, "produccion");
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Producción</h3>
        <Button variant="outline" size="sm" onClick={handleExportarSeccion}>
          <Download size={14} className="mr-1" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Piezas buenas</span>
          <span className="text-lg font-bold">{totalPiezasBuenas}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Piezas defectuosas</span>
          <span className="text-lg font-bold text-red-600">{totalPiezasDefectuosas}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Kg merma</span>
          <span className="text-lg font-bold">{totalKgMerma.toFixed(1)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Kg plasta</span>
          <span className="text-lg font-bold">{totalKgPlasta.toFixed(1)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datosFormateados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="periodoCorto" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="piezasBuenas" name="Piezas buenas" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="piezasDefectuosas" name="Piezas defectuosas" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}