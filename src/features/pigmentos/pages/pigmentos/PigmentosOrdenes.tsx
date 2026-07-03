import { useState, useEffect } from "react"
import { getInfoMaquinas, type InfoMaquina } from "../../services/pigmentosOrdenesService"
import TarjetaMaquinaPigmentos from "../../components/TarjetaMaquinaPigmentos"

export default function PigmentosOrdenes() {
  const [infoMaquinas, setInfoMaquinas] = useState<InfoMaquina[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await getInfoMaquinas()
        setInfoMaquinas(data)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
    // Refresca cada 5 minutos para actualizar el semáforo
    const intervalo = setInterval(fetchDatos, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  console.log(infoMaquinas)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Producción en curso y siguiente orden por máquina.
        </p>
      </div>

      {/* Leyenda del semáforo */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Más de 4 hrs
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          1 a 4 hrs
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Menos de 1 hr
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
          Inactiva / sin orden
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando máquinas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {infoMaquinas.map(info => (
            <TarjetaMaquinaPigmentos key={info.maquina.id} info={info} />
          ))}
        </div>
      )}
    </div>
  )
}