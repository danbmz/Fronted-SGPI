import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface Props {
  datos: { fecha: string; piezasBuenas: number; piezasDefectuosas: number }[];
}

function formatearFechaCorta(fechaISO: string): string {
  const [, mes, dia] = fechaISO.split("-").map(Number);
  return `${dia}/${mes}`;
}

export default function GraficaProduccionPorDia({ datos }: Props) {
  const datosFormateados = datos.map((d) => ({
    ...d,
    fechaCorta: formatearFechaCorta(d.fecha),
  }));

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Producción — últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datosFormateados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="fechaCorta" fontSize={12} />
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