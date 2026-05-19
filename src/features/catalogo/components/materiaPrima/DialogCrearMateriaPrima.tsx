import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearMateriaPrimaSchema, type CrearMateriaPrimaForm } from "@/validations/catalogo/materiaPrimaValidations"
import { crearMateriaPrima } from "../../services/materiasPrimasService"
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
  onClose: () => void
  onSuccess: (materiaPrima: MateriaPrima) => void
}

const tiposMateriaPrima: TipoMateriaPrima[] = [
  "Polipropileno",
  "Poliestireno-Cristal",
]
const subtipos: SubtipoMateriaPrima[] = ["virgen", "reciclado"]
const unidadesMedida = ["kg", "lt", "pza"]

export default function DialogCrearMateriaPrima({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearMateriaPrimaForm>({
    resolver: zodResolver(crearMateriaPrimaSchema)
  })

  const onSubmit = async (data: CrearMateriaPrimaForm) => {
    if (!user) return
    try {
      const nuevaMateriaPrima = await crearMateriaPrima(data, user)
      toast.success("Materia prima creada correctamente.")
      onSuccess(nuevaMateriaPrima)
      reset()
      onClose()
    } catch(error) {
      toast.error("Error al crear la materia prima.")
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
          <DialogTitle>Nueva materia prima</DialogTitle>
          <DialogDescription>
            Registra una nueva materia prima en el catálogo.
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
                onValueChange={val => setValue("tipo", val as TipoMateriaPrima, { shouldValidate: true })}
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
                onValueChange={val => setValue("subtipo", val as SubtipoMateriaPrima, { shouldValidate: true })}
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
                onValueChange={val => setValue("unidadMedida", val as "kg" | "lt" | "pza", { shouldValidate: true })}
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
                placeholder="0.00"
              />
              {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando" : "Crear materia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}