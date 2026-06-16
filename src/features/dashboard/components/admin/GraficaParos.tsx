import {
  PieChart, Pie, Sector, Tooltip,
  Legend, ResponsiveContainer
} from "recharts"

interface Props {
  datos: { motivo: string; minutos: number; fill: string }[]
}

export default function GraficaParos({ datos }: Props) {
  const totalMinutos = datos.reduce((acc, d) => acc + d.minutos, 0)

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div>
        <p className="font-medium text-sm">Paros por motivo</p>
        <p className="text-xs text-muted-foreground">
          {totalMinutos} minutos totales esta semana
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="minutos"
            nameKey="motivo"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            shape={(props) => (
                <Sector
                    {...props}
                    fill={props.payload.fill}
                />
            )}
          />
          <Tooltip
            formatter={(value) => [`${value} min`, ""]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--color-border-secondary)"
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}