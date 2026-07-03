import { useState } from "react"
import type { InfoMaquina } from "../services/pigmentosOrdenesService"
import { Factory, ChevronDown, ChevronUp } from "lucide-react"

interface Props {
  info: InfoMaquina
}

const colorSemaforo = {
  verde:    { icon: "text-green-500",  border: "border-green-200 dark:border-green-900",  bg: "bg-green-50 dark:bg-green-950/20"  },
  amarillo: { icon: "text-yellow-500", border: "border-yellow-200 dark:border-yellow-900", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  rojo:     { icon: "text-red-500",    border: "border-red-200 dark:border-red-900",     bg: "bg-red-50 dark:bg-red-950/20"      },
  inactiva: { icon: "text-gray-400",   border: "border-gray-200 dark:border-gray-800",   bg: "bg-gray-50 dark:bg-gray-900/20"    }
}

export default function TarjetaMaquinaPigmentos({ info }: Props) {
  const [expandida, setExpandida] = useState(false)
  const { maquina, ordenEnCurso, siguienteOrden, tiempoRestanteHrs, colorSemaforo: semaforo } = info
  const estilos = colorSemaforo[semaforo]

//   const formatTiempo = (hrs: number) => {
//     if (hrs < 1) return `${Math.round(hrs * 60)} min`
//     return `${hrs.toFixed(1)} hrs`
//   }

  return (
    <div className={`border rounded-lg overflow-hidden ${estilos.border}`}>

      {/* Header — nombre de máquina e ícono */}
      <div className={`flex flex-col items-center gap-1 px-3 py-3 ${estilos.bg}`}>
        <Factory size={28} className={estilos.icon} />
        <span className="text-sm font-semibold">{maquina.nombre}</span>
        <span className="text-xs text-muted-foreground">#{maquina.numero}</span>
      </div>

      {/* Orden en curso */}
      <div className="px-3 py-3 flex flex-col gap-1">
        {ordenEnCurso ? (
          <>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              En curso
            </p>
            <p className="text-sm font-medium font-mono">{ordenEnCurso.folio}</p>
            <p className="text-sm">{ordenEnCurso.producto}</p>
            <p className="text-xs text-muted-foreground">{ordenEnCurso.color}</p>

            {tiempoRestanteHrs !== null && (
              <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${
                semaforo === "rojo"
                  ? "text-red-600"
                  : semaforo === "amarillo"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>  
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">
            {maquina.estado === "activa" ? "Sin orden asignada" : "Máquina inactiva"}
          </p>
        )}
      </div>

      {/* Siguiente orden — desplegable */}
      {siguienteOrden && (
        <>
          <button
            onClick={() => setExpandida(prev => !prev)}
            className="w-full flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            <span>Siguiente orden</span>
            {expandida ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandida && (
            <div className="px-3 py-3 border-t flex flex-col gap-2 bg-muted/30">
                <p className="text-sm font-medium font-mono">{siguienteOrden.folio}</p>
                <p className="text-sm font-medium">{siguienteOrden.producto}</p>
                <p className="text-xs text-muted-foreground">{siguienteOrden.color}</p>

                {/* Material */}
                <div className="flex flex-col gap-0.5 mt-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Material
                </p>
                {siguienteOrden.tipoMaterial === "mezcla" ? (
                    <>
                    <p className="text-xs">
                        {siguienteOrden.materiaPrima} —{" "}
                        <span className="font-medium">
                        {((siguienteOrden.materiaPrimaTotalKg * siguienteOrden.porcentajeVirgen) / 100).toFixed(1)} kg
                        </span>{" "}
                        ({siguienteOrden.porcentajeVirgen}% virgen)
                    </p>
                    <p className="text-xs">
                        Molido {siguienteOrden.color} —{" "}
                        <span className="font-medium">
                        {((siguienteOrden.materiaPrimaTotalKg * siguienteOrden.porcentajeMolido) / 100).toFixed(1)} kg
                        </span>{" "}
                        ({siguienteOrden.porcentajeMolido}% molido)
                    </p>
                    </>
                ) : (
                    <p className="text-xs">
                    {siguienteOrden.materiaPrima} —{" "}
                    <span className="font-medium">{siguienteOrden.materiaPrimaTotalKg} kg</span>{" "}
                    (100% virgen)
                    </p>
                )}
                </div>

                {/* Pigmento */}
                <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pigmento
                </p>
                <p className="text-xs">
                    {siguienteOrden.pigmento} — {siguienteOrden.categoriaPigmento} — {siguienteOrden.tipoPigmento}
                </p>
                <p className="text-xs">
                    Dosis: <span className="font-medium">{siguienteOrden.dosisGrPorKg} gr/kg</span>
                </p>
                <p className="text-xs">
                    Total pigmento:{" "}
                    <span className="font-medium">
                    {((siguienteOrden.materiaPrimaTotalKg * siguienteOrden.dosisGrPorKg)).toFixed(0)} gr
                    </span>
                </p>
                </div>
            </div>
            )}
        </>
      )}
    </div>
  )
}