import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarMaquinaSchema, type EditarMaquinaForm } from "@/validations/catalogo/maquinaValidations"
import { editarMaquina } from "../../services/maquinasService"
import type { Maquina } from "@/types/maquinasCatalogo"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function DialogEditarMaquina({ open, maquina, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMaquinaForm>({
    resolver: zodResolver(editarMaquinaSchema)
  })

  useEffect(() => {
    if (maquina) {
      reset(maquina)
    }
  }, [maquina])

  const onSubmit = async (data: EditarMaquinaForm) => {
    if (!user || !maquina) return
    try {
      const maquinaEditada = await editarMaquina(maquina.id, data, maquina, user)
      toast.success("Máquina actualizada correctamente.")
      onSuccess(maquinaEditada)
      reset()
      onClose()
    } catch {
      toast.error("Error al actualizar la máquina.")
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
          <DialogTitle>Editar máquina</DialogTitle>
          <DialogDescription>
            Modifica los datos de la máquina seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="TX 268T" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Código</Label>
            <Input {...register("codigo")} placeholder="TX268T" />
            {errors.codigo && <p className="text-xs text-red-500">{errors.codigo.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Número de máquina</Label>
            <Input
              type="number"
              {...register("numero", { valueAsNumber: true })}
            />
            {errors.numero && <p className="text-xs text-red-500">{errors.numero.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo de proceso</Label>
            <Select
              value={watch("tipoProceso") ?? ""}
              onValueChange={val => setValue("tipoProceso", val as "Inyección" | "Soplado", { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inyección">Inyección</SelectItem>
                <SelectItem value="Soplado">Soplado</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoProceso && <p className="text-xs text-red-500">{errors.tipoProceso.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Capacidad (Ton) — opcional</Label>
            <Input
              type="number"
              {...register("capacidadTon", { valueAsNumber: true })}
            />
            {errors.capacidadTon && <p className="text-xs text-red-500">{errors.capacidadTon.message}</p>}
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