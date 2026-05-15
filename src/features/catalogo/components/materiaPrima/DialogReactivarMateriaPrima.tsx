import { reactivarMateriaPrima } from "../../services/materiasPrimasService"
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

export default function DialogReactivarMateriaPrima({ open, materiaPrima, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)  
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !materiaPrima) return
    setIsLoading(true)

    try {
      const materiaPrimaReactivada = await reactivarMateriaPrima(materiaPrima, user)
      toast.success("Materia prima reactivada.")
      onSuccess(materiaPrimaReactivada)
      onClose()
    } catch {
      toast.error("Error al reactivar la materia prima.")
    } finally{
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reactivar materia prima?</DialogTitle>
          <DialogDescription>
            La materia prima volverá a aparecer en los formularios de órdenes de producción.
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
          <Button onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Reactivando" : "Reactivar"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}