import {
  PieChart, Pie, Sector, Tooltip, ResponsiveContainer
} from "recharts";
import type { PieSectorShapeProps } from "recharts";

interface Props {
  datos: { estado: string; total: number }[];
}

const COLOR_POR_ESTADO: Record<string, string> = {
  BORRADOR: "#9ca3af",
  ACTIVA: "#3b82f6",
  EN_PROGRESO: "#f59e0b",
  PAUSADA: "#fb923c",
  COMPLETADA: "#16a34a",
  CANCELADA: "#dc2626",
};

// Recharts nos da el índice del dato actual; con eso buscamos su estado real
// dentro de "payload" (el objeto de datos original de esa porción).
function ColorSector(props: PieSectorShapeProps & { payload?: { estado: string } }) {
  const color = COLOR_POR_ESTADO[props.payload?.estado ?? ""] ?? "#9ca3af";
  return <Sector {...props} fill={color} />;
}

export default function GraficaOrdenesPorEstado({ datos }: Props) {
  const hayDatos = datos.some((d) => d.total > 0);

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Órdenes por estado — últimos 7 días</h3>
      {hayDatos ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={datos}
              dataKey="total"
              nameKey="estado"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              shape={ColorSector}
            />
            <Tooltip />
            {/* <Legend /> */}
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-16">No hay órdenes registradas.</p>
      )}
    </div>
  );
}