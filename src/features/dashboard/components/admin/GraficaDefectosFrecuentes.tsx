import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface Props {
  datos: { nombre: string; total: number }[];
}

export default function GraficaDefectosFrecuentes({ datos }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Defectos más frecuentes — últimos 7 días</h3>
      {datos.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={datos} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" fontSize={12} />
            <YAxis type="category" dataKey="nombre" width={120} fontSize={12} />
            <Tooltip />
            <Bar dataKey="total" name="Piezas afectadas" fill="#dc2626" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-16">Sin defectos registrados en este periodo.</p>
      )}
    </div>
  );
}