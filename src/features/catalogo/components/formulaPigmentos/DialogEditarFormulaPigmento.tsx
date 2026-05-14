import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarFormulaPigmentoSchema, type EditarFormulaPigmentoForm } from "@/validations/formulasValidations"
import { editarFormulaPigmento } from "../../services/formulasPigmentosService"
import type { FormulaPigmento, TipoPigmento, CategoriaColor } from "@/types/formulasPigmentosCatalogo"
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
  formula: FormulaPigmento | null
  onClose: () => void
  onSuccess: (formula: FormulaPigmento) => void
}

const materialesBases = [
  { id: "1", nombre: "Polipropileno Virgen" },
  { id: "3", nombre: "Poliestireno-Cristal Virgen" }
]

const categoriasColor: CategoriaColor[] = [
  "Sólidos",
  "Sólidos Pasteles",
  "Neón Traslucidos",
  "Jarra Neón Pastel"
]

const tiposPigmento: TipoPigmento[] = ["master", "polvo"]

export default function DialogEditarFormulaPigmento({ open, formula, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarFormulaPigmentoForm>({
    resolver: zodResolver(editarFormulaPigmentoSchema)
  })

  useEffect(() => {
    if (formula) {
      reset(formula)
    }
  }, [formula])

  const onSubmit = async (data: EditarFormulaPigmentoForm) => {
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
            <Label>Material base</Label>
            <Select
              value={watch("materiaPrimaId") ?? ""}
              onValueChange={val => {
                setValue("materiaPrimaId", val, { shouldValidate: true, shouldDirty: true })
                const material = materialesBases.find(m => m.id === val)
                if (material) setValue("materialBase", material.nombre, { shouldValidate: true, shouldDirty: true })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un material" />
              </SelectTrigger>
              <SelectContent>
                {materialesBases.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.materiaPrimaId && <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Categoría de color</Label>
            <Select
              value={watch("categoriaColor") ?? ""}
              onValueChange={val => setValue("categoriaColor", val as CategoriaColor, { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categoriasColor.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoriaColor && <p className="text-xs text-red-500">{errors.categoriaColor.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color</Label>
            <Input {...register("color")} placeholder="Ej. Amarillo" />
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo de pigmento</Label>
            <Select
              value={watch("tipoPigmento") ?? ""}
              onValueChange={val => setValue("tipoPigmento", val as TipoPigmento, { shouldValidate: true, shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposPigmento.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoPigmento && <p className="text-xs text-red-500">{errors.tipoPigmento.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Dosis (gr / kg de material)</Label>
            <Input
              type="number"
              step="0.1"
              {...register("dosisGrPorKg", { valueAsNumber: true })}
            />
            {errors.dosisGrPorKg && <p className="text-xs text-red-500">{errors.dosisGrPorKg.message}</p>}
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