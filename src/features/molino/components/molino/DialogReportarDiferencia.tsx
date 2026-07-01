import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reportarDiferenciaSchema, type ReportarDiferenciaForm, } from "@/validations/molino/moliendaValidations"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import { reportarDiferenciaMolino } from "../../services/moliendaService"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  avance: AvanceTurno | null
  onClose: () => void
  onSuccess: (avance: AvanceTurno) => void
}

export default function DialogReportarDiferencia({ open, avance, onClose, onSuccess }: Props) {
  const { user } = useAuth()

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ReportarDiferenciaForm>({
    resolver: zodResolver(reportarDiferenciaSchema),
    // Pre-rellena con los valores del avance para que solo modifique lo que difiere
    values: avance ? {
      kgMermaRecibida: avance.kgMerma,
      kgPlastaRecibida: avance.kgPlasta,
      piezasMalasRecibidas: avance.piezasDefectuosas,
      piezasCambioColorRecibidas: avance.piezasCambioColor
    } : undefined
  })

  const onSubmit = async (data: ReportarDiferenciaForm) => {
    if (!user || !avance) return
    try {
      const avanceActualizado = await reportarDiferenciaMolino(avance, data, user)
      toast.success("Diferencia reportada correctamente.")
      onSuccess(avanceActualizado)
      reset()
      onClose()
    } catch {
      toast.error("Error al reportar la diferencia.")
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
          <DialogTitle>Reportar diferencia en recepción</DialogTitle>
          <DialogDescription>
            {avance?.folio} — Turno {avance?.turno} · {avance?.supervisorNombre}
          </DialogDescription>
        </DialogHeader>

        {/* Referencia de lo reportado por el supervisor */}
        {avance && (
          <div className="text-xs bg-muted px-3 py-2 rounded-md flex flex-col gap-1">
            <p className="font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Lo que reportó el supervisor
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <span className="text-muted-foreground">Merma:</span>
              <span className="font-medium">{avance.kgMerma} kg</span>
              <span className="text-muted-foreground">Plasta:</span>
              <span className="font-medium">{avance.kgPlasta} kg</span>
              <span className="text-muted-foreground">Piezas defectuosas:</span>
              <span className="font-medium">{avance.piezasDefectuosas}</span>
              <span className="text-muted-foreground">Cambio de color:</span>
              <span className="font-medium">{avance.piezasCambioColor}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <p className="text-xs text-muted-foreground">
            Modifica solo los campos donde la cantidad recibida no coincide.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Kg merma recibida</Label>
              <Input
                type="number"
                step="0.1"
                {...register("kgMermaRecibida", { valueAsNumber: true })}
              />
              {errors.kgMermaRecibida && (
                <p className="text-xs text-red-500">{errors.kgMermaRecibida.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Kg plasta recibida</Label>
              <Input
                type="number"
                step="0.1"
                {...register("kgPlastaRecibida", { valueAsNumber: true })}
              />
              {errors.kgPlastaRecibida && (
                <p className="text-xs text-red-500">{errors.kgPlastaRecibida.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Piezas defectuosas recibidas</Label>
              <Input
                type="number"
                {...register("piezasMalasRecibidas", { valueAsNumber: true })}
              />
              {errors.piezasMalasRecibidas && (
                <p className="text-xs text-red-500">{errors.piezasMalasRecibidas.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Piezas cambio color recibidas</Label>
              <Input
                type="number"
                {...register("piezasCambioColorRecibidas", { valueAsNumber: true })}
              />
              {errors.piezasCambioColorRecibidas && (
                <p className="text-xs text-red-500">{errors.piezasCambioColorRecibidas.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>{isSubmitting ? "Guardando" : "Guardar diferencia"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}