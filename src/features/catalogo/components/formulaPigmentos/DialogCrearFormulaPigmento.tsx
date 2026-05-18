import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearFormulaPigmentoSchema, type CrearFormulaPigmento } from "@/validations/formulasValidations"
import { crearFormulaPigmento } from "../../services/formulasPigmentosService"
import { getMateriasPrimas } from "../../services/materiasPrimasService"
import { getPigmentos } from "../../services/pigmentoService"
import type { FormulaPigmento } from "@/validations/formulasValidations"
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
import type { MateriaPrima } from "@/types/materiaPrima"
import type { Pigmento } from "@/validations/pigmentosValidations"

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (formula: FormulaPigmento) => void
}

export default function DialogCrearFormulaPigmento({ open, onClose, onSuccess }: Props) {
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([])
  const [pigmento, setPigmento] = useState<Pigmento[]>([])
  const { user } = useAuth()
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearFormulaPigmento>({
    resolver: zodResolver(crearFormulaPigmentoSchema)
  })

  // Obtenemos los catalogos de Materias Primas y Pigmentos
  useEffect(() => {
    const fetchDatos = async () => {
      const [materias, pigs] = await Promise.all([
        getMateriasPrimas(),
        getPigmentos()
      ])
      setMateriaPrima(materias.filter(m=>m.activo))
      setPigmento(pigs.filter(p=>p.activo))
    }
    fetchDatos()
  },[])

  const onSubmit = async (data: CrearFormulaPigmento) => {
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

  // Obtienes el pigmento actualmente seleccionado
  const pigmentoActual = pigmento.find(p => p.id === watch("pigmentoId"))

  // Filtras los materiales base
  const materialesFiltrados = pigmentoActual
    ? materiaPrima.filter(m => m.tipo === pigmentoActual.aplicacion)
    : materiaPrima // Si no hay pigmento seleccionado, muestra todos

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

          {/* Pigmento */}
          <div className="flex flex-col gap-1">
            <Label>Pigmento</Label>
            <Select
              value={watch("pigmentoId") ?? ""}
              onValueChange={val => {
                const pigmentoSeleccionado = pigmento.find(p => p.id === val)
                setValue("pigmentoId", val, { shouldValidate: true, shouldDirty: true })
                if (pigmentoSeleccionado) {
                  setValue("color", pigmentoSeleccionado.color, { shouldValidate: true, shouldDirty: true })
                  // Setear el material base automáticamente según el pigmento
                  setValue("materialBase", pigmentoSeleccionado.aplicacion, { shouldValidate: true, shouldDirty: true })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un pigmento" />
              </SelectTrigger>
              <SelectContent>
                {pigmento.map(p => (
                  <SelectItem key={p.id} value={p.id}>{`${p.color} ${p.categoriaColor} ${p.tipo}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          {/* Material base */}
          <div className="flex flex-col gap-1">
            <Label>Material base</Label>
            <Select
              value={watch("materialBase") ?? ""}
              onValueChange={val => { setValue("materialBase", val, { shouldValidate: true })}}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un material" />
              </SelectTrigger>
              <SelectContent>
                {materialesFiltrados.map(m => (
                  <SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.materialBase && <p className="text-xs text-red-500">{errors.materialBase.message}</p>}
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