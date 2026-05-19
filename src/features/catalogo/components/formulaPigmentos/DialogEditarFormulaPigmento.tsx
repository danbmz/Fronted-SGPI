import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarFormulaPigmentoSchema, type EditarFormulaPigmento, type FormulaPigmento } from "@/validations/catalogo/formulasValidations"
import { editarFormulaPigmento } from "../../services/formulasPigmentosService"
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
  formula: FormulaPigmento | null
  onClose: () => void
  onSuccess: (formula: FormulaPigmento) => void
}

export default function DialogEditarFormulaPigmento({ open, formula, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarFormulaPigmento>({
    resolver: zodResolver(editarFormulaPigmentoSchema)
  })

  // Para rellenar los inputs del form con los datos del registro
  useEffect(() => {
    if (formula) {
      reset(formula)
    }
  }, [formula])

  const onSubmit = async (data: EditarFormulaPigmento) => {
    if (!user || !formula) return
    try {
      const formulaEditada = await editarFormulaPigmento(formula.id, data, formula, user)
      toast.success("Fórmula actualizada correctamente.")
      onSuccess(formulaEditada)
      reset()
      onClose()
    } catch {
      toast.error("Error al actualizar la fórmula.")
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
          <DialogTitle>Editar fórmula de pigmento</DialogTitle>
          <DialogDescription>
            Modifica los datos de la fórmula seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <div className="flex flex-col gap-1">
            <Label>Dosis (gr / kg de material)</Label>
            <Input
              type="number"
              step="0.1"
              {...register("dosisGrPorKg", { valueAsNumber: true })}
            />
            {errors.dosisGrPorKg && <p className="text-xs text-red-500">{errors.dosisGrPorKg.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo del cambio</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe el motivo del cambio de dosis..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Guardando" : "Guardar cambios"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}