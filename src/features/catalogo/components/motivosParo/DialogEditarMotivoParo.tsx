import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarMotivoParoSchema, type EditarMotivoParoForm } from "@/validations/catalogo/motivosValidations"
import { editarMotivoParo } from "../../services/motivosService"
import type { MotivoParo } from "@/types/motivosCatalogo"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  motivo: MotivoParo | null
  onClose: () => void
  onSuccess: (motivo: MotivoParo) => void
}

export default function DialogEditarMotivoParo({ open, motivo, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMotivoParoForm>({
    resolver: zodResolver(editarMotivoParoSchema)
  })

  useEffect(() => {
    if (motivo) {
      reset(motivo)
    }
  }, [motivo, setValue])

  const onSubmit = async (data: EditarMotivoParoForm) => {
    if (!user || !motivo) return
    try {
      const motivoEditado = await editarMotivoParo(motivo.id, data, motivo, user)
      toast.success("Motivo de paro actualizado correctamente.")
      onSuccess(motivoEditado)
      reset()
      onClose()
    } catch {
      toast.error("Error al actualizar el motivo de paro.")
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
          <DialogTitle>Editar motivo de paro</DialogTitle>
          <DialogDescription>
            Modifica el nombre del motivo de paro seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Falla de máquina" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Guardando" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}