import { useState, useEffect } from "react";
import TablaOrdenesActivas from "../../components/supervisor/TablaOrdenesActivas";
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations";
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations";
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService";
import { detectarTurnoActual, getAvancesTurno } from "../../services/avancesTurnoService";
import { Clock } from "lucide-react";

export default function Ordenes () {
    const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
    const [avances, setAvances] = useState<AvanceTurno[]>([])
    const [loading, setLoading] = useState(true)
    const turnoActual = detectarTurnoActual()

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [ordenesData, avancesData] = await Promise.all([
                getOrdenesProduccion(),
                getAvancesTurno()
                ])
                // Solo muestra órdenes activas y en progreso
                setOrdenes(ordenesData.filter(o =>
                o.estado === "activa" || o.estado === "en_progreso"
                ))
                setAvances(avancesData)
            } finally {
                setLoading(false)
            }
        }
        fetchDatos()
    }, [])

    const handleAvanceAbierto = (nuevoAvance: AvanceTurno, ordenActualizada: OrdenProduccion) => {
        setAvances(prev => [nuevoAvance, ...prev])
        setOrdenes(prev =>
            prev.map(o => o.id === ordenActualizada.id ? ordenActualizada : o)
        )
    }

    const colorTurno: Record<string, string> = {
        Mañana: "bg-yellow-100 text-yellow-700",
        Tarde:  "bg-blue-100 text-blue-700",
        Noche:  "bg-purple-100 text-purple-700"
    }

    return (
        <div className="flex flex-col gap-6 p-6">

        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">
                    Visualiza las órdenes activas y en progreso para comenzar un avance.
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
                {/* Órdenes disponibles */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Órdenes activas y en progreso
                    </h3>
                    <TablaOrdenesActivas
                    ordenes={ordenes}
                    avances={avances}
                    turnoActual={turnoActual}
                    onAvanceAbierto={handleAvanceAbierto}
                    />
                </div>
            </>
        )}
        </div>
    )
}