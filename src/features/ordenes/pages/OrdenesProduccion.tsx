import { useState, useEffect } from "react"
import { getOrdenesProduccion } from "../services/ordenesProduccionService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import TablaOrdenesProduccion from "../components/TablaOrdenesProduccion"
import CrearOrdenStepper from "../components/CrearOrdenStepper"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function OrdenesProduccion() {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [loading, setLoading] = useState(true)
  const [stepperAbierto, setStepperAbierto] = useState(false)

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const data = await getOrdenesProduccion()
        setOrdenes(data)
      } finally {
        setLoading(false)
      }
    }
    fetchOrdenes()
  }, [])

  const handleOrdenCreada = (nuevaOrden: OrdenProduccion) => {
    setOrdenes(prev => [nuevaOrden, ...prev])
  }

  const handleOrdenActualizada = (ordenActualizada: OrdenProduccion) => {
    setOrdenes(prev =>
      prev.map(o => o.id === ordenActualizada.id ? ordenActualizada : o)
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona y monitorea las órdenes de producción.
          </p>
        </div>
        <Button onClick={() => setStepperAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nueva orden
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando órdenes...</p>
      ) : (
        <TablaOrdenesProduccion
          ordenes={ordenes}
          onOrdenActualizada={handleOrdenActualizada}
        />
      )}

      <CrearOrdenStepper
        open={stepperAbierto}
        onClose={() => setStepperAbierto(false)}
        onSuccess={handleOrdenCreada}
      />
    </div>
  )
}