import { reactivarPigmento } from "../../services/pigmentoService"
import type { Pigmento } from "@/validations/pigmentosValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  pigmento: Pigmento | null
  onClose: () => void
  onSuccess: (pigmento: Pigmento) => void
}

export default function DialogReactivarPigmento({ open, pigmento, onClose, onSuccess }: Props) {
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !pigmento) return
    try {
      const pigmentoReactivado = await reactivarPigmento(pigmento, user)
      toast.success("Pigmento reactivado.")
      onSuccess(pigmentoReactivado)
      onClose()
    } catch {
      toast.error("Error al reactivar el pigmento.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reactivar pigmento?</DialogTitle>
          <DialogDescription>
            El pigmento volverá a aparecer en los formularios de fórmulas y órdenes de producción.
          </DialogDescription>
        </DialogHeader>

        {pigmento && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Color:</span> {pigmento.color}</p>
            <p><span className="font-medium">Categoría:</span> {pigmento.categoriaColor}</p>
            <p><span className="font-medium">Tipo:</span> {pigmento.tipo}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirmar}>Reactivar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}