import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TablaInventarioMateriasPrimas from "../components/materiasPrimas/TablaInventarioMateriasPrimas"
import TablaInventarioMolido from "../components/materiasPrimas/TablaInventarioMolido"
import type { InventarioMateriaPrima, InventarioMolido} from "@/validations/inventario/inventarioValidations"
import { getInventarioMateriasPrimas } from "../services/materiaPrima/inventarioMateriaPrimaService"
import { getInventarioMolido } from "../services/materiaPrima/inventarioMolidoService"

export default function MateriasPrimasInventario() {
  const [materiasPrimas, setMateriasPrimas] = useState<InventarioMateriaPrima[]>([])
  const [molido, setMolido] = useState<InventarioMolido[]>([])
  const [loadingMateriales, setLoadingMateriales] = useState(true)
  const [loadingMolido, setLoadingMolido] = useState(true)

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await getInventarioMateriasPrimas()
        setMateriasPrimas(data)
      } finally {
        setLoadingMateriales(false)
      }
    }
    fetchMateriales()
  }, [])

  useEffect(() => {
    const fetchMolido = async () => {
      try {
        const data = await getInventarioMolido()
        setMolido(data)
      } finally {
        setLoadingMolido(false)
      }
    }
    fetchMolido()
  }, [])

  const handleMateriaPrimaActualizada = (actualizada: InventarioMateriaPrima) => {
    setMateriasPrimas(prev =>
      prev.map(m => m.id === actualizada.id ? actualizada : m)
    )
  }

  const handleMolidoActualizado = (actualizado: InventarioMolido) => {
    setMolido(prev =>
      prev.map(m => m.id === actualizado.id ? actualizado : m)
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Consulta y gestiona el stock de materias primas y material molido.
        </p>
      </div>

      <Tabs defaultValue="materias-primas">
        <TabsList>
          <TabsTrigger value="materias-primas">Materias Primas</TabsTrigger>
          <TabsTrigger value="molido">Molido Colores</TabsTrigger>
        </TabsList>

        <TabsContent value="materias-primas">
          {loadingMateriales ? (
            <p className="text-muted-foreground py-4">Cargando materias primas...</p>
          ) : (
            <TablaInventarioMateriasPrimas
              materiasPrimas={materiasPrimas}
              onActualizada={handleMateriaPrimaActualizada}
            />
          )}
        </TabsContent>

        <TabsContent value="molido">
          {loadingMolido ? (
            <p className="text-muted-foreground py-4">Cargando molido colores...</p>
          ) : (
            <TablaInventarioMolido
              molido={molido}
              onActualizado={handleMolidoActualizado}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}