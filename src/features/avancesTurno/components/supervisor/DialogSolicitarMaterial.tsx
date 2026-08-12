import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  solicitarMaterialSchema, type SolicitarMaterialForm, type AvanceTurno
} from "@/validations/avancesTurno/avanceTurnoValidations"
import { solicitarMaterial } from "../../services/avanceTurnoService"
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

interface Props {
  open: boolean
  avance: AvanceTurno | null
  onClose: () => void
  onSuccess: (avance: AvanceTurno) => void
}

export default function DialogSolicitarMaterial({ open, avance, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<SolicitarMaterialForm>({
    resolver: zodResolver(solicitarMaterialSchema)
  })

  const onSubmit = async (data: SolicitarMaterialForm) => {
    if (!user || !avance) return
    try {
      const nuevaSolicitud = await solicitarMaterial(avance, data, user)
      const avanceActualizado: AvanceTurno = {
        ...avance,
        solicitudesMaterial: [...avance.solicitudesMaterial, nuevaSolicitud]
      }
      toast.success(`Solicitud de ${data.kgSolicitados}kg enviada al encargado de pigmentos.`)
      onSuccess(avanceActualizado)
      reset()
      onClose()
    } catch {
      toast.error("Error al enviar la solicitud.")
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
          <DialogTitle>Solicitar material adicional</DialogTitle>
          <DialogDescription>
            {avance?.folio} — {avance?.producto} {avance?.color}
          </DialogDescription>
        </DialogHeader>

        {avance && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Material:</span> {avance.producto}</p>
            <p><span className="font-medium">Máquina:</span> {avance.maquina}</p>
            <p><span className="font-medium">Turno:</span> {avance.turno}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Kg adicionales requeridos</Label>
            <Input
              type="number"
              step="0.1"
              {...register("kgSolicitados", { valueAsNumber: true })}
              placeholder="10"
            />
            {errors.kgSolicitados && (
              <p className="text-xs text-red-500">{errors.kgSolicitados.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              {...register("motivo")}
              placeholder="Ej. Mayor merma de lo estimado..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enviando" : "Enviar solicitud"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}