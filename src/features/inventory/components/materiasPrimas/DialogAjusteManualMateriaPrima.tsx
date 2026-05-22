// src/components/inventario/materiasPrimas/DialogAjusteManualMateriaPrima.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ajusteManualSchema, type AjusteManualForm, type InventarioMateriaPrima } from "@/validations/inventario/inventarioValidations"
import { ajustarStockMateriaPrima } from "../../services/materiaPrima/inventarioMateriaPrimaService"
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
  materiaPrima: InventarioMateriaPrima | null
  onClose: () => void
  onSuccess: (actualizada: InventarioMateriaPrima) => void
}

export default function DialogAjusteManualMateriaPrima({ open, materiaPrima, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue,
    formState: { errors, isSubmitting }
  } = useForm<AjusteManualForm>({
    resolver: zodResolver(ajusteManualSchema)
  })

  useEffect(() => {
    if (materiaPrima) {
      setValue("stockNuevo", materiaPrima.stockActual)
    }
  }, [materiaPrima, setValue])

  const onSubmit = async (data: AjusteManualForm) => {
    if (!user || !materiaPrima) return
    try {
      const actualizada = await ajustarStockMateriaPrima(materiaPrima.id, data, materiaPrima, user)
      toast.success("Stock ajustado correctamente.")
      onSuccess(actualizada)
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
            Modifica el stock actual con una justificación del ajuste.
          </DialogDescription>
        </DialogHeader>

        {materiaPrima && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Material:</span> {materiaPrima.nombre}</p>
            <p><span className="font-medium">Stock actual:</span> {materiaPrima.stockActual} kg</p>
            <p><span className="font-medium">Stock mínimo:</span> {materiaPrima.stockMinimo} kg</p>
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