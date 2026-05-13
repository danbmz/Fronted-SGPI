// src/pages/admin/catalogos/Maquinas.tsx
import { useState, useEffect } from "react"
import { getMaquinas } from "../services/maquinasService"
import type { Maquina } from "@/types/maquinasCatalogo"
import TablaMaquinas from "../components/maquinas/TablaMaquinas"
import DialogCrearMaquina from "../components/maquinas/DialogCrearMaquina"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const data = await getMaquinas()
        setMaquinas(data)
      } catch {
        setError("Error al cargar máquinas")
      } finally {
        setLoading(false)
      }
    }
    fetchMaquinas()
  }, [])

  const handleMaquinaCreada = (nuevaMaquina: Maquina) => {
    setMaquinas(prev => [...prev, nuevaMaquina])
  }

  const handleMaquinaEditada = (maquinaEditada: Maquina) => {
    setMaquinas(prev =>
      prev.map(m => m.id === maquinaEditada.id ? maquinaEditada : m)
    )
  }

  const handleEstadoCambiado = (maquinaActualizada: Maquina) => {
    setMaquinas(prev =>
      prev.map(m => m.id === maquinaActualizada.id ? maquinaActualizada : m)
    )
  }

  return (
    <div className="flex flex-col gap-4 h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de máquinas y equipos de producción.
          </p>
        </div>
        <Button className="cursor-pointer bg-gray-800" onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nueva máquina
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Cargando máquinas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <TablaMaquinas
          maquinas={maquinas}
          onMaquinaEditada={handleMaquinaEditada}
          onEstadoCambiado={handleEstadoCambiado}
        />
      )}

      <DialogCrearMaquina
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
        onSuccess={handleMaquinaCreada}
      />
    </div>
  )
}