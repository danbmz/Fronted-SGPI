import { useState, useEffect } from "react"
import { getAvancesTurno, detectarTurnoActual, getFechaTurnoActual } from "../../services/avancesTurnoService"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import TablaAvancesTurno from "../../components/supervisor/TablaAvancesTurno"
import { Clock } from "lucide-react"

export default function AvancesTurno() {
    const [avances, setAvances] = useState<AvanceTurno[]>([])
    const [loading, setLoading] = useState(true)
    const turnoActual = detectarTurnoActual()
    const fechaTurnoActual = getFechaTurnoActual()

    useEffect(() => {
        const fetchDatos = async () => {
        try {
            const avancesData = await getAvancesTurno()
            setAvances(avancesData)
          } finally {
            setLoading(false)
          }
        }
        fetchDatos()
      }, [])
      
    const handleAvanceCerrado = (avanceCerrado: AvanceTurno) => {
        setAvances(prev =>
        prev.map(a => a.id === avanceCerrado.id ? avanceCerrado : a)
        )
    }

    const handleTiempoParoAgregado = (avanceActualizado: AvanceTurno) => {
        setAvances(prev =>
        prev.map(a => a.id === avanceActualizado.id ? avanceActualizado : a)
        )
    }

    const colorTurno: Record<string, string> = {
        Mañana: "bg-yellow-100 text-yellow-700",
        Tarde:  "bg-blue-100 text-blue-700",
        Noche:  "bg-purple-100 text-purple-700"
    }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header con turno actual */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Registra y consulta los avances de producción de tu turno.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorTurno[turnoActual]}`}>
            Turno {turnoActual}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando datos...</p>
      ) : (
        <>
          {/* Avances del turno actual */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Avances registrados hoy — Turno {turnoActual}
            </h3>
            <div className="overflow-y-auto">
                <TablaAvancesTurno
                avances={avances}
                turnoActual={turnoActual}
                fechaActual={fechaTurnoActual}
                onAvanceCerrado={handleAvanceCerrado}
                onTiempoParoAgregado={handleTiempoParoAgregado}
                />
            </div>
          </div>
        </>
      )}
    </div>
  )
}