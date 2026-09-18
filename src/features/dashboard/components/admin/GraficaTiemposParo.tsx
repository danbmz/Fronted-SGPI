import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface Props {
  totalMinutos: number;
  porMotivo: { nombre: string; minutos: number }[];
}

function formatearHorasMinutos(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
}

export default function GraficaTiemposParo({ totalMinutos, porMotivo }: Props) {
  const motivoPrincipal = porMotivo[0];

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Tiempos de paro — últimos 7 días</h3>
        <div className="text-right">
          <p className="text-lg font-bold">{formatearHorasMinutos(totalMinutos)}</p>
          {motivoPrincipal && (
            <p className="text-xs text-muted-foreground">Principal: {motivoPrincipal.nombre}</p>
          )}
        </div>
      </div>

      {porMotivo.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
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