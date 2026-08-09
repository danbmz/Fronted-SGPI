import { useState } from "react"
import { useMateriasPrimas } from "../hooks/useMateriasPrimas"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TablaMateriasPrimas from "../components/materiaPrima/TablaMateriasPrimas"
import DialogCrearMateriaPrima from "../components/materiaPrima/DialogCrearMateriaPrima"

export default function MateriasPrimas() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const { data: materiasPrimas, isLoading, error } = useMateriasPrimas();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar materias primas: {error.message}</div>;

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

        <TablaMateriasPrimas
          materiasPrimas={materiasPrimas ?? []}
        />

      <DialogCrearMateriaPrima
        open={dialogCrearAbierto}
        onClose={() => { setDialogCrearAbierto(false)}}
      />

    </div>
  )
}