import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts"

interface Props {
  datos: { turno: string; piezasBuenas: number; piezasDefectuosas: number }[]
}

export default function GraficaProduccion({ datos }: Props) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div>
        <p className="font-medium text-sm">Producción por turno</p>
        <p className="text-xs text-muted-foreground">Semana actual</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis
            dataKey="turno"
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--color-border-secondary)"
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="piezasBuenas"      name="Piezas buenas"  fill="#378ADD" radius={[4, 4, 0, 0]} />
          <Bar dataKey="piezasDefectuosas" name="Piezas malas"   fill="#F09595" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}