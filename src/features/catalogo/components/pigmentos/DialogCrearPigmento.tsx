import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  { crearPigmentoSchema, type Pigmento, type CrearPigmento, type CategoriaColor, type TipoPigmento } from "@/validations/pigmentosValidations"
import { crearPigmento } from "@/features/catalogo/services/pigmentoService"
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

export default function DialogCrearPigmento({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([])

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearPigmento>({
    resolver: zodResolver(crearPigmentoSchema)
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

  const onSubmit = async (data: CrearPigmento) => {
    if (!user) return
    try {
      const nuevoPigmento = await crearPigmento(data, user)
      toast.success("Pigmento creado correctamente.")
      onSuccess(nuevoPigmento)
      reset()
      onClose()
    } catch {
      toast.error("Error al crear el pigmento.")
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
          <DialogTitle>Nuevo pigmento</DialogTitle>
          <DialogDescription>
            Registra un nuevo pigmento en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <div className="flex flex-col gap-1">
            <Label>Material base</Label>
            <Select
              value={watch("materiaPrimaId") ?? ""}
              onValueChange={val => {
                setValue("materiaPrimaId", val, { shouldValidate: true })
                const material = materiasPrimas.find(m => m.id === val)
                if (material) setValue("aplicacion", material.nombre, { shouldValidate: true })
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
                onValueChange={val => setValue("categoriaColor", val as CategoriaColor, { shouldValidate: true })}
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
                onValueChange={val => setValue("tipo", val as TipoPigmento, { shouldValidate: true })}
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
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando" : "Crear pigmento"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}