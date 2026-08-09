import { useState } from "react"
import { useMaquina } from "../hooks/useMaquina"
import TablaMaquinas from "../components/maquinas/TablaMaquinas"
import DialogCrearMaquina from "../components/maquinas/DialogCrearMaquina"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Maquinas() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
  const {data: maquinas, isLoading, error} = useMaquina();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar materias primas: {error.message}</div>;

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

      <TablaMaquinas
        maquinas={maquinas ?? []}
      />

    <DialogCrearMaquina
      open={dialogCrearAbierto}
      onClose={() => setDialogCrearAbierto(false)}
    />
    </div>
  )
}