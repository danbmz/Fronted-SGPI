import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarPigmentoSchema, type EditarPigmento, type CategoriaColor, type TipoPigmento, type Pigmento } from "@/validations/pigmentosValidations"
import { editarPigmento } from "../../services/pigmentoService"
import type { MateriaPrima } from "@/types/materiaPrima"
import { getMateriasPrimas } from "../../services/materiasPrimasService"
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
  pigmento: Pigmento | null
  onClose: () => void
  onSuccess: (pigmento: Pigmento) => void
}

const categoriasColor: CategoriaColor[] = [
  "Sólidos",
  "Sólidos Pasteles",
  "Neón Traslucidos",
  "Jarra Neón Pastel"
]

const tiposPigmento: TipoPigmento[] = ["master", "polvo"]

export default function DialogEditarPigmento({ open, pigmento, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([])

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarPigmento>({
    resolver: zodResolver(editarPigmentoSchema)
  })

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await getMateriasPrimas()
        setMateriasPrimas(data.filter(m => m.activo))
      } catch {
        toast.error("Error al cargar materias primas.")
      }
    }
    fetchMateriales()
  }, [])

  useEffect(() => {
    if (pigmento) {
      reset(pigmento)
    }
  }, [pigmento, setValue])

  const onSubmit = async (data: EditarPigmento) => {
    if (!user || !pigmento) return
    try {
      const pigmentoEditado = await editarPigmento(pigmento.id, data, pigmento, user)
      toast.success("Pigmento actualizado correctamente.")
      onSuccess(pigmentoEditado)
      reset()
      onClose()
    } catch {
      toast.error("Error al actualizar el pigmento.")
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
          <DialogTitle>Editar pigmento</DialogTitle>
          <DialogDescription>
            Modifica los datos del pigmento seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <div className="flex flex-col gap-1">
            <Label>Material base</Label>
            <Select
              value={watch("materiaPrimaId") ?? ""}
              onValueChange={val => {
                setValue("materiaPrimaId", val, { shouldValidate: true, shouldDirty: true })
                const material = materiasPrimas.find(m => m.id === val)
                if (material) setValue("aplicacion", material.nombre, { shouldValidate: true, shouldDirty: true })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un material" />
              </SelectTrigger>
              <SelectContent>
                {materiasPrimas.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.materiaPrimaId && <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color</Label>
            <Input {...register("color")} placeholder="Ej. Amarillo" />
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Categoría</Label>
              <Select
                value={watch("categoriaColor") ?? ""}
                onValueChange={val => setValue("categoriaColor", val as CategoriaColor, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
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
              <Label>Tipo</Label>
              <Select
                value={watch("tipo") ?? ""}
                onValueChange={val => setValue("tipo", val as TipoPigmento, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPigmento.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
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