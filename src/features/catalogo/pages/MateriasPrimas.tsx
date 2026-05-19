import { useState, useEffect } from "react"
import { getMateriasPrimas } from "../services/materiasPrimasService"
import type { MateriaPrima } from "@/types/materiaPrima"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TablaMateriasPrimas from "../components/materiaPrima/TablaMateriasPrimas"
import DialogCrearMateriaPrima from "../components/materiaPrima/DialogCrearMateriaPrima"

export default function MateriasPrimas() {
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)

  useEffect(() => {
    const fetchMateriasPrimas = async () => {
      try {
        const data = await getMateriasPrimas()
        setMateriasPrimas(data)
      } catch {
        setError("Error al cargar materias primas")
      } finally {
        setLoading(false)
      }
    }
    fetchMateriasPrimas()
  }, [])

  const handleMateriaPrimaCreada = (nuevaMateriaPrima: MateriaPrima) => {
    setMateriasPrimas(prev => [...prev, nuevaMateriaPrima])
  }

  const handleMateriaPrimaEditada = (materiaPrimaEditada: MateriaPrima) => {
    setMateriasPrimas(prev =>
      prev.map(m => m.id === materiaPrimaEditada.id ? materiaPrimaEditada : m)
    )
  }

  const handleMateriaPrimaDesactivada = (materiaPrimaDesactivada: MateriaPrima) => {
    setMateriasPrimas(prev =>
      prev.map(m => m.id === materiaPrimaDesactivada.id ? { ...m, activo: false } : m)
    )
  }

  const handleMateriaPrimaReactivada = (materiaPrimaReactivada: MateriaPrima) => {
    setMateriasPrimas(prev =>
      prev.map(m => m.id === materiaPrimaReactivada.id ? { ...m, activo: true } : m)
    )
  }

  return (
    <div className="flex flex-col gap-4 h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de materias primas del sistema.
          </p>
        </div>
        <Button onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nueva materia prima
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Cargando materias primas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <TablaMateriasPrimas
          materiasPrimas={materiasPrimas}
          onMateriaPrimaEditada={handleMateriaPrimaEditada}
          onMateriaPrimaDesactivada={handleMateriaPrimaDesactivada}
          onMateriaPrimaReactivada={handleMateriaPrimaReactivada}
        />
      )}

      <DialogCrearMateriaPrima
        open={dialogCrearAbierto}
        onClose={() => { setDialogCrearAbierto(false)}}
        onSuccess={handleMateriaPrimaCreada}
      />

    </div>
  )
}