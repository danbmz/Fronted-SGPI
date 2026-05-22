// src/components/inventario/materiasPrimas/DialogAjusteManualMolido.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ajusteManualSchema, type AjusteManualForm, type InventarioMolido } from "@/validations/inventario/inventarioValidations"
import { ajustarStockMolido } from "../../services/materiaPrima/inventarioMolidoService"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  open: boolean
  molido: InventarioMolido | null
  onClose: () => void
  onSuccess: (actualizado: InventarioMolido) => void
}

export default function DialogAjusteManualMolido({ open, molido, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue,
    formState: { errors, isSubmitting }
  } = useForm<AjusteManualForm>({
    resolver: zodResolver(ajusteManualSchema)
  })

  useEffect(() => {
    if (molido) {
      setValue("stockNuevo", molido.stockActual)
    }
  }, [molido, setValue])

  const onSubmit = async (data: AjusteManualForm) => {
    if (!user || !molido) return
    try {
      const actualizado = await ajustarStockMolido(molido.id, data, molido, user)
      toast.success("Stock de molido ajustado correctamente.")
      onSuccess(actualizado)
      reset()
      onClose()
    } catch {
      toast.error("Error al ajustar el stock.")
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
          <DialogTitle>Ajuste manual de stock</DialogTitle>
          <DialogDescription>
            Modifica el stock actual de molido con una justificación.
          </DialogDescription>
        </DialogHeader>

        {molido && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Material:</span> {molido.materialBase}</p>
            <p><span className="font-medium">Color:</span> {molido.colorAproximado}</p>
            <p><span className="font-medium">Stock actual:</span> {molido.stockActual} kg</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nuevo stock (kg)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("stockNuevo", { valueAsNumber: true })}
            />
            {errors.stockNuevo && <p className="text-xs text-red-500">{errors.stockNuevo.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo del ajuste</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe el motivo del ajuste..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando" : "Guardar ajuste"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}