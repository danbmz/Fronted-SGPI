import { useState, useEffect } from "react"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avanceTurnoService"
import { getMoliendas } from "../../services/moliendaService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { Molienda } from "@/validations/molino/moliendaValidations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TarjetaMermaOrden from "../../components/admin/TarjetaMermaOrden"
import TablaHistorialMolino from "../../components/admin/TablaHistorialMolino"


export default function MolinoAdmin() {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [avances, setAvances] = useState<AvanceTurno[]>([])
  const [moliendas, setMoliendas] = useState<Molienda[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [ordenesData, avancesData, moliendasData] = await Promise.all([
          getOrdenesProduccion(),
          getAvancesTurno(),
          getMoliendas()
        ])
        // Solo órdenes en progreso — las activas aún no generan merma
        setOrdenes(ordenesData.filter(o => o.estado === "en_progreso"))
        setAvances(avancesData)
        setMoliendas(moliendasData)
      } finally {
        setLoading(false)
      }
    }
    fetchDatos()
  }, [])

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Seguimiento de merma y molienda por orden de producción.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando datos...</p>
      ) : (
        <Tabs defaultValue="merma">
          <TabsList>
            <TabsTrigger value="merma">Merma por orden</TabsTrigger>
            <TabsTrigger value="historial">Historial de molienda</TabsTrigger>
          </TabsList>

          <TabsContent value="merma" className="flex flex-col gap-4 mt-4">
            {ordenes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay órdenes en progreso con merma registrada.
              </p>
            ) : (
              ordenes.map(orden => (
                <TarjetaMermaOrden
                  key={orden.id}
                  orden={orden}
                  avances={avances.filter(a => a.ordenId === orden.id)}
                  moliendas={moliendas.filter(m => m.ordenesIds.includes(orden.id))}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="historial" className="mt-4">
            <TablaHistorialMolino moliendas={moliendas} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}