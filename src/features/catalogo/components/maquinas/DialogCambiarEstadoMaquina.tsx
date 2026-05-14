// src/components/catalogos/maquinas/DialogCambiarEstadoMaquina.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cambiarEstadoSchema, type CambiarEstadoForm } from "@/validations/maquinaValidations"
import { cambiarEstadoMaquina } from "../../services/maquinasService"
import type { Maquina, EstadoMaquina } from "@/types/maquinasCatalogo"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  open: boolean
  maquina: Maquina | null
  onClose: () => void
  onSuccess: (maquina: Maquina) => void
}

const estadoColors: Record<EstadoMaquina, string> = {
  "activa":           "text-green-600",
  "en mantenimiento": "text-yellow-600",
  "inactiva":         "text-red-600"
}

export default function DialogCambiarEstadoMaquina({ open, maquina, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CambiarEstadoForm>({
    resolver: zodResolver(cambiarEstadoSchema)
  })

  // Rellena el form cuando se abre con los datos de la maquina seleccionada
  useEffect(() => {
    if (maquina) {
      reset({
        estado: maquina.estado,
        motivo: "", // Baseline explícito para que isDirty lo considere
      })
    }
  }, [maquina])

  const onSubmit = async (data: CambiarEstadoForm) => {
    if (!user || !maquina) return
    try {
      const maquinaActualizada = await cambiarEstadoMaquina(maquina, data, user)
      toast.success("Estado actualizado correctamente.")
      onSuccess(maquinaActualizada)
      reset()
      onClose()
    } catch {
      toast.error("Error al cambiar el estado.")
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
          <DialogTitle>Cambiar estado</DialogTitle>
          <DialogDescription>
            Actualiza el estado operativo de la máquina.
          </DialogDescription>
        </DialogHeader>

        {maquina && (
          <div className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md">
            <span className="font-medium">{maquina.nombre}</span>
            <span className="text-muted-foreground">—</span>
            <span className={`font-medium ${estadoColors[maquina.estado]}`}>
              {maquina.estado}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nuevo estado</Label>
            <Select
              value={watch("estado") ?? ""}
              onValueChange={val => setValue("estado", val as EstadoMaquina, { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="en mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && <p className="text-xs text-red-500">{errors.estado.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo del cambio</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe el motivo del cambio de estado..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Guardando" : "Guardar cambio"}    
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}