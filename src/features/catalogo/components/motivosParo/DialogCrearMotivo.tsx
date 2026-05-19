import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearMotivoParoSchema, type CrearMotivoParoForm } from "@/validations/catalogo/motivosValidations"
import { crearMotivoParo } from "../../services/motivosService"
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
  onClose: () => void
  onSuccess: (motivo: MotivoParo) => void
}

export default function DialogCrearMotivoParo({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CrearMotivoParoForm>({
    resolver: zodResolver(crearMotivoParoSchema)
  })

  const onSubmit = async (data: CrearMotivoParoForm) => {
    if (!user) return
    try {
      const nuevoMotivo = await crearMotivoParo(data, user)
      toast.success("Motivo de paro creado correctamente.")
      onSuccess(nuevoMotivo)
      reset()
      onClose()
    } catch {
      toast.error("Error al crear el motivo de paro.")
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
          <DialogTitle>Nuevo motivo de paro</DialogTitle>
          <DialogDescription>
            Agrega una nueva categoría de motivo de paro al catálogo.
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando" : "Crear motivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}