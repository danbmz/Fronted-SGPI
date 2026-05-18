import { useState, useEffect } from "react"
import { getPigmentos } from "../services/pigmentoService"
import type { Pigmento } from "@/validations/pigmentosValidations"
import TablaPigmentos from "../components/pigmentos/TablaPigmentos"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import DialogCrearPigmento from "../components/pigmentos/DialogCrearPigmento"

export default function Pigmentos() {
  const [pigmentos, setPigmentos] = useState<Pigmento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)

  useEffect(() => {
    const fetchPigmentos = async () => {
      try {
        const data = await getPigmentos()
        setPigmentos(data)
      } catch {
        setError("Error al cargar pigmentos")
      } finally {
        setLoading(false)
      }
    }
    fetchPigmentos()
  }, [])

  const handlePigmentoCreado = (nuevoPigmento: Pigmento) => {
    setPigmentos(prev => [...prev, nuevoPigmento])
  }

  const handlePigmentoEditado = (pigmentoEditado: Pigmento) => {
    setPigmentos(prev =>
      prev.map(p => p.id === pigmentoEditado.id ? pigmentoEditado : p)
    )
  }

  const handlePigmentoDesactivado = (pigmentoDesactivado: Pigmento) => {
    setPigmentos(prev =>
      prev.map(p => p.id === pigmentoDesactivado.id ? { ...p, activo: false } : p)
    )
  }

  const handlePigmentoReactivado = (pigmentoReactivado: Pigmento) => {
    setPigmentos(prev =>
      prev.map(p => p.id === pigmentoReactivado.id ? { ...p, activo: true } : p)
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de pigmentos del sistema.
          </p>
        </div>
        <Button onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nuevo pigmento
        </Button>
      </div>

      {loading && <p className="text-muted-foreground">Cargando pigmentos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <TablaPigmentos
          pigmentos={pigmentos}
          onPigmentoEditado={handlePigmentoEditado}
          onPigmentoDesactivado={handlePigmentoDesactivado}
          onPigmentoReactivado={handlePigmentoReactivado}
        />
      )}

        <DialogCrearPigmento
            open={dialogCrearAbierto}
            onClose={() => setDialogCrearAbierto(false)}
            onSuccess={handlePigmentoCreado}
        />

    </div>
  )
}