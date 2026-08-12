import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registrarParoSchema, type RegistrarParo, type AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import { agregarTiempoParo } from "../../services/avanceTurnoService"
import { getMotivosParo } from "@/features/catalogo/services/motivosService"
import type { MotivoParo } from "@/types/motivosCatalogo"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  open: boolean
  avance: AvanceTurno | null
  onClose: () => void
  onSuccess: (avance: AvanceTurno) => void
}

export default function DialogRegistrarParo({ open, avance, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const [motivosParo, setMotivosParo] = useState<MotivoParo[]>([])

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<RegistrarParo>({
    resolver: zodResolver(registrarParoSchema)
  })

  useEffect(() => {
    const fetchMotivos = async () => {
      try {
        const data = await getMotivosParo()
        setMotivosParo(data.filter(m => m.activo))
      } catch {
        console.error("Error al cargar motivos de paro")
      }
    }
    fetchMotivos()
  }, [])

  const onSubmit = async (data: RegistrarParo) => {
    if (!user || !avance) return
    try {
      const nuevoParo = await agregarTiempoParo(avance.id, data, user)
      const avanceActualizado: AvanceTurno = {
        ...avance,
        tiemposParo: [...avance.tiemposParo, nuevoParo]
      }
      toast.success("Tiempo de paro registrado.")
      onSuccess(avanceActualizado)
      reset()
      onClose()
    } catch {
      toast.error("Error al registrar el tiempo de paro.")
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
          <DialogTitle>Registrar tiempo de paro</DialogTitle>
          <DialogDescription>
            {avance?.folio} — {avance?.producto} {avance?.color}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <div className="flex flex-col gap-1">
            <Label>Motivo de paro</Label>
            <Select
              value={watch("motivoId") ?? ""}
              onValueChange={val => {
                const motivo = motivosParo.find(m => m.id === val)
                if (!motivo) return
                setValue("motivoId", val, { shouldValidate: true })
                setValue("motivo", motivo.nombre)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivosParo.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.motivoId && <p className="text-xs text-red-500">{errors.motivoId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Duración (minutos)</Label>
            <Input
              type="number"
              {...register("minutos", { valueAsNumber: true })}
              placeholder="35"
            />
            {errors.minutos && <p className="text-xs text-red-500">{errors.minutos.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Observaciones <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              {...register("observaciones")}
              placeholder="Describe brevemente el paro..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando" : "Registrar paro"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}