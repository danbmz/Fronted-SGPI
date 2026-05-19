import { eliminarFormulaPigmento } from "@/features/catalogo/services/formulasPigmentosService"
import type { FormulaPigmento } from "@/validations/catalogo/formulasValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  formula: FormulaPigmento | null
  onClose: () => void
  onSuccess: (id: string) => void
}

export default function DialogEliminarFormulaPigmento({ open, formula, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !formula) return
    setIsLoading(true)

    try {
      const id = await eliminarFormulaPigmento(formula, user)
      toast.success("Fórmula eliminada correctamente.")
      onSuccess(id)
      onClose()
    } catch {
      toast.error("Error al eliminar la fórmula.")
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar fórmula?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {formula && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Material:</span> {formula.materialBase}</p>
            <p><span className="font-medium">Color:</span> {formula.color}</p>
            <p><span className="font-medium">Categoría:</span> {formula.categoriaColor}</p>
            <p><span className="font-medium">Dosis:</span> {formula.dosisGrPorKg} gr/kg</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Eliminando" : "Eliminar"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}