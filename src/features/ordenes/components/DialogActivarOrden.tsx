import { activarOrden } from "../services/ordenesProduccionService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
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
  orden: OrdenProduccion | null
  onClose: () => void
  onSuccess: (orden: OrdenProduccion) => void
}

export default function DialogActivarOrden({ open, orden, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!user || !orden) return
    setIsLoading(true)
    try {
      const ordenActivada = await activarOrden(orden, user)
      toast.success(`Orden ${orden.folio} activada correctamente.`)
      onSuccess(ordenActivada)
      onClose()
    } catch {
      toast.error("Error al activar la orden.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Activar orden de producción?</DialogTitle>
          <DialogDescription>
            La orden pasará a estado Activa y estará lista para iniciar producción.
          </DialogDescription>
        </DialogHeader>

        {orden && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Folio:</span> {orden.folio}</p>
            <p><span className="font-medium">Producto:</span> {orden.producto} — {orden.color}</p>
            <p><span className="font-medium">Piezas:</span> {orden.totalPiezas.toLocaleString()}</p>
            <p><span className="font-medium">Máquina:</span> {orden.maquina}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Activando" : "Activar orden"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}