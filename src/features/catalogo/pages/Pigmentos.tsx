import { useState } from "react"
import { usePigmento } from "../hooks/usePigmentos"
import TablaPigmentos from "../components/pigmentos/TablaPigmentos"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import DialogCrearPigmento from "../components/pigmentos/DialogCrearPigmento"

export default function Pigmentos() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
  const {data: pigmentos, isLoading, error} = usePigmento();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar materias primas: {error.message}</div>;

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

        <TablaPigmentos
          pigmentos={pigmentos ?? []}
        />

        <DialogCrearPigmento
            open={dialogCrearAbierto}
            onClose={() => setDialogCrearAbierto(false)}
        />

    </div>
  )
}