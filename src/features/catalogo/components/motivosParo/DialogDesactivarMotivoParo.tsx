import { desactivarMotivoParo } from "../../services/motivosService"
import type { MotivoParo } from "@/types/motivosCatalogo"
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
  motivo: MotivoParo | null
  onClose: () => void
  onSuccess: (motivo: MotivoParo) => void
}

export default function DialogDesactivarMotivoParo({ open, motivo, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !motivo) return
    setIsLoading(true)

    try {
      const motivoDesactivado = await desactivarMotivoParo(motivo, user)
      toast.success("Motivo de paro desactivado.")
      onSuccess(motivoDesactivado)
      onClose()
    } catch {
      toast.error("Error al desactivar el motivo de paro.")
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar motivo de paro?</DialogTitle>
          <DialogDescription>
            El motivo dejará de aparecer en los formularios de registro de paro.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm">
          ¿Estás seguro que deseas desactivar <strong>{motivo?.nombre}</strong>?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Desactivando" : "Desactivar"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}