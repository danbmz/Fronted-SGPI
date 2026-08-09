import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearMotivoParoSchema ,type CrearMotivoParoInput } from "../../schemas/motivosParo"
import { useCrearMotivoParo } from "../../hooks/useMotivosParo"
import { CATEGORIA_MOTIVO_PARO } from "@/types/enums"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  open: boolean
  onClose: () => void
}

export default function DialogCrearMotivoParo({ open, onClose }: Props) {
  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting }
  } = useForm<CrearMotivoParoInput>({
    resolver: zodResolver(crearMotivoParoSchema)
  })

  const crearMutation = useCrearMotivoParo();

  const onSubmit = async (data: CrearMotivoParoInput) => {
    try {
      await crearMutation.mutateAsync(data)
      toast.success("Motivo de paro creado correctamente.")
      reset()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la motivo de paro.")
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

          <div className="flex flex-col gap-1">
            <Label>Categoría</Label>
            <Select
              value={watch("categoria") ?? ""}
              onValueChange={(val) =>
                setValue("categoria", val as (typeof CATEGORIA_MOTIVO_PARO)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIA_MOTIVO_PARO.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && <p className="text-xs text-red-500">{errors.categoria.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear motivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}