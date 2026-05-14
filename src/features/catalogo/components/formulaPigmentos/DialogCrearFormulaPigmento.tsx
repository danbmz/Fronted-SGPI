// src/components/catalogos/formulasPigmento/DialogCrearFormulaPigmento.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearFormulaPigmentoSchema, type CrearFormulaPigmentoForm } from "@/validations/formulasValidations"
import { crearFormulaPigmento } from "../../services/formulasPigmentosService"
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

export default function DialogCrearFormulaPigmento({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearFormulaPigmentoForm>({
    resolver: zodResolver(crearFormulaPigmentoSchema)
  })

  const onSubmit = async (data: CrearFormulaPigmentoForm) => {
    if (!user) return
    try {
      const nuevaFormula = await crearFormulaPigmento(data, user)
      toast.success("Fórmula de pigmento creada correctamente.")
      onSuccess(nuevaFormula)
      reset()
      onClose()
    } catch {
      toast.error("Error al crear la fórmula de pigmento.")
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
          <DialogTitle>Nueva fórmula de pigmento</DialogTitle>
          <DialogDescription>
            Define la dosis de pigmento para una combinación de material base y color.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          {/* Material base */}
          <div className="flex flex-col gap-1">
            <Label>Material base</Label>
            <Select
              value={watch("materiaPrimaId") ?? ""}
              onValueChange={val => {
                setValue("materiaPrimaId", val, { shouldValidate: true })
                const material = materialesBases.find(m => m.id === val)
                if (material) setValue("materialBase", material.nombre, { shouldValidate: true })
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

          {/* Categoría de color */}
          <div className="flex flex-col gap-1">
            <Label>Categoría de color</Label>
            <Select
              value={watch("categoriaColor") ?? ""}
              onValueChange={val => setValue("categoriaColor", val as CategoriaColor, { shouldValidate: true })}
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

          {/* Color */}
          <div className="flex flex-col gap-1">
            <Label>Color</Label>
            <Input {...register("color")} placeholder="Ej. Amarillo" />
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          {/* Tipo de pigmento */}
          <div className="flex flex-col gap-1">
            <Label>Tipo de pigmento</Label>
            <Select
              value={watch("tipoPigmento") ?? ""}
              onValueChange={val => setValue("tipoPigmento", val as TipoPigmento, { shouldValidate: true })}
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

          {/* Dosis */}
          <div className="flex flex-col gap-1">
            <Label>Dosis (gr / kg de material)</Label>
            <Input
              type="number"
              step="0.1"
              {...register("dosisGrPorKg", { valueAsNumber: true })}
              placeholder="Ej. 5"
            />
            {errors.dosisGrPorKg && <p className="text-xs text-red-500">{errors.dosisGrPorKg.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando" : "Crear fórmula"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}