import { desactivarMateriaPrima } from "../../services/materiasPrimasService"
import type { MateriaPrima } from "@/types/materiaPrima"
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
  materiaPrima: MateriaPrima | null
  onClose: () => void
  onSuccess: (materiaPrima: MateriaPrima) => void
}

export default function DialogDesactivarMateriaPrima({ open, materiaPrima, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !materiaPrima) return
    setIsLoading(true)

    try {
      const materiaPrimaDesactivada = await desactivarMateriaPrima(materiaPrima, user)
      toast.success("Materia prima desactivada.")
      onSuccess(materiaPrimaDesactivada)
      onClose()
    } catch {
      toast.error("Error al desactivar la materia prima.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar materia prima?</DialogTitle>
          <DialogDescription>
            La materia prima dejará de aparecer en los formularios de órdenes de producción.
          </DialogDescription>
        </DialogHeader>

        {materiaPrima && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {materiaPrima.nombre}</p>
            <p><span className="font-medium">Código:</span> {materiaPrima.codigoInterno}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Desactivando" : "Desactivar"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}