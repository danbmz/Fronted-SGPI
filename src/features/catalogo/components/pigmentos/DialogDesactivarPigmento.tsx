import { desactivarPigmento } from "../../services/pigmentoService"
import type { Pigmento } from "@/validations/catalogo/pigmentosValidations"
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

export default function DialogDesactivarPigmento({ open, pigmento, onClose, onSuccess }: Props) {
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !pigmento) return
    try {
      const pigmentoDesactivado = await desactivarPigmento(pigmento, user)
      toast.success("Pigmento desactivado.")
      onSuccess(pigmentoDesactivado)
      onClose()
    } catch {
      toast.error("Error al desactivar el pigmento.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar pigmento?</DialogTitle>
          <DialogDescription>
            El pigmento dejará de aparecer en los formularios de fórmulas y órdenes de producción.
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
          <Button variant="destructive" onClick={handleConfirmar}>Desactivar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}