import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { crearMaquinaSchema, type CrearMaquinaInput } from "../../schemas/maquina";
import { useCrearMaquina } from "../../hooks/useMaquina";
import { TIPO_PROCESO } from "@/types/enums";
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
  onClose: () => void
}

export default function DialogCrearMaquina({ open, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearMaquinaInput>({
    resolver: zodResolver(crearMaquinaSchema)
  })

  const crearMutation = useCrearMaquina();

  const onSubmit = async (data: CrearMaquinaInput) => {
    try {
      await crearMutation.mutateAsync(data)
      toast.success("Máquina registrada correctamente.")
      reset()
      onClose()
    } catch(error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar la máquina.");
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
          <DialogTitle>Nueva máquina</DialogTitle>
          <DialogDescription>
            Registra una nueva máquina o equipo de producción.
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
              placeholder="1"
            />
            {errors.numero && <p className="text-xs text-red-500">{errors.numero.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo de proceso</Label>
            <Select
              value={watch("tipoProceso") ?? ""}
              onValueChange={(val) =>
                setValue("tipoProceso", val as (typeof TIPO_PROCESO)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proceso" />
              </SelectTrigger>
              <SelectContent>
                {TIPO_PROCESO.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoProceso && <p className="text-xs text-red-500">{errors.tipoProceso.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Capacidad (Ton)</Label>
            <Input
              type="number"
              {...register("capacidadTon", { valueAsNumber: true })}
              placeholder="268"
            />
            {errors.capacidadTon && <p className="text-xs text-red-500">{errors.capacidadTon.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}