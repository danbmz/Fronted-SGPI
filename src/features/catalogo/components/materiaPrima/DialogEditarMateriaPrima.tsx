import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarMateriaPrimaSchema, type EditarMateriaPrimaForm } from "@/validations/materiaPrimaValisations"
import { editarMateriaPrima } from "../../services/materiasPrimasService"
import type { MateriaPrima, TipoMateriaPrima, SubtipoMateriaPrima } from "@/types/materiaPrima"
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
  materiaPrima: MateriaPrima | null
  onClose: () => void
  onSuccess: (materiaPrima: MateriaPrima) => void
}

const tiposMateriaPrima: TipoMateriaPrima[] = [
  "Polipropileno",
  "Poliestireno-Cristal",
]

const subtipos: SubtipoMateriaPrima[] = ["virgen", "reciclado"]
const unidadesMedida = ["kg", "lt", "pza"]

export default function DialogEditarMateriaPrima({ open, materiaPrima, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMateriaPrimaForm>({
    resolver: zodResolver(editarMateriaPrimaSchema)
  })

  useEffect(() => {
    if (materiaPrima) {
      reset(materiaPrima)
    }
  }, [materiaPrima, setValue])

  const onSubmit = async (data: EditarMateriaPrimaForm) => {
    if (!user || !materiaPrima) return
    try {
      const materiaPrimaEditada = await editarMateriaPrima(materiaPrima.id, data, materiaPrima, user)
      toast.success("Materia prima actualizada correctamente.")
      onSuccess(materiaPrimaEditada)
      reset()
      onClose()
    } catch {
      toast.error("Error al actualizar la materia prima.")
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
          <DialogTitle>Editar materia prima</DialogTitle>
          <DialogDescription>
            Modifica los datos de la materia prima seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Polipropileno Virgen" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Código interno</Label>
            <Input {...register("codigoInterno")} placeholder="Ej. JU-PVL1" />
            {errors.codigoInterno && <p className="text-xs text-red-500">{errors.codigoInterno.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <Select
                value={watch("tipo") ?? ""}
                onValueChange={val => setValue("tipo", val as TipoMateriaPrima, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMateriaPrima.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Subtipo</Label>
              <Select
                value={watch("subtipo") ?? ""}
                onValueChange={val => setValue("subtipo", val as SubtipoMateriaPrima, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {subtipos.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subtipo && <p className="text-xs text-red-500">{errors.subtipo.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Proveedor</Label>
            <Input {...register("proveedor")} placeholder="Ej. Braskem" />
            {errors.proveedor && <p className="text-xs text-red-500">{errors.proveedor.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Unidad de medida</Label>
              <Select
                value={watch("unidadMedida") ?? ""}
                onValueChange={val => setValue("unidadMedida", val as "kg" | "lt" | "pza", { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesMedida.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unidadMedida && <p className="text-xs text-red-500">{errors.unidadMedida.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Costo unitario</Label>
              <Input
                type="number"
                step="0.01"
                {...register("costoUnitario", { valueAsNumber: true })}
              />
              {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
            </div>
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