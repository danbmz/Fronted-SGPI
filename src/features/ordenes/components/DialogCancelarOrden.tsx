import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cancelarOrden } from "../services/ordenesProduccionService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  open: boolean
  orden: OrdenProduccion | null
  onClose: () => void
  onSuccess: (orden: OrdenProduccion) => void
}

const cancelarSchema = z.object({
  motivo: z
    .string()
    .min(1, "El motivo es requerido")
    .min(10, "El motivo debe tener al menos 10 caracteres")
})

type CancelarForm = z.infer<typeof cancelarSchema>

export default function DialogCancelarOrden({ open, orden, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CancelarForm>({
    resolver: zodResolver(cancelarSchema)
  })

  const onSubmit = async (data: CancelarForm) => {
    if (!user || !orden) return
    try {
      const ordenCancelada = await cancelarOrden(orden, data.motivo, user)
      toast.success(`Orden ${orden.folio} cancelada.`)
      onSuccess(ordenCancelada)
      reset()
      onClose()
    } catch {
      toast.error("Error al cancelar la orden.")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cancelar orden de producción?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La orden quedará registrada como cancelada.
          </DialogDescription>
        </DialogHeader>

        {orden && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Folio:</span> {orden.folio}</p>
            <p><span className="font-medium">Producto:</span> {orden.producto} — {orden.color}</p>
            <p><span className="font-medium">Estado actual:</span> {orden.estado}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo de cancelación</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe el motivo de la cancelación..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>Volver</Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>{isSubmitting ? "Cancelando" : "Cancelar orden"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}