import type { ReactNode } from "react"

interface Props {
  titulo: string
  valor: string
  subtitulo: string
  icono: ReactNode
  color: "blue" | "green" | "orange" | "red"
}

const colores = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20",   icon: "text-blue-600",   border: "border-blue-100 dark:border-blue-900" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20", icon: "text-green-600",  border: "border-green-100 dark:border-green-900" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", icon: "text-orange-600", border: "border-orange-100 dark:border-orange-900" },
  red:    { bg: "bg-red-50 dark:bg-red-950/20",     icon: "text-red-600",    border: "border-red-100 dark:border-red-900" }
}

export default function CardResumen({ titulo, valor, subtitulo, icono, color }: Props) {
  const c = colores[color]
  return (
    <div className={`border rounded-lg px-4 py-3 flex flex-col gap-2 ${c.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{titulo}</span>
        <span className={`${c.icon} ${c.bg} p-1.5 rounded-md`}>{icono}</span>
      </div>
      <p className="text-2xl font-semibold">{valor}</p>
      <p className="text-xs text-muted-foreground">{subtitulo}</p>
    </div>
  )
}