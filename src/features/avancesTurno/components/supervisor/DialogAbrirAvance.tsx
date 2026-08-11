import { abrirAvance } from "../../services/avancesTurnoService"
import { activarOrden } from "@/features/ordenes/services/ordenService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AvanceTurno, Turno } from "@/validations/avancesTurno/avanceTurnoValidations"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  orden: OrdenProduccion | null
  turnoActual: Turno
  onClose: () => void
  onSuccess: (avance: AvanceTurno, orden: OrdenProduccion) => void
}

export default function DialogAbrirAvance({
  open, orden, turnoActual, onClose, onSuccess
}: Props) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
 
  const handleConfirmar = async () => {
    if (!user || !orden) return
    setIsLoading(true)

    try {
      const nuevoAvance = await abrirAvance(orden, user)

      // Si la orden estaba activa la pasa a en_progreso
      let ordenActualizada = orden
      if (orden.estado === "activa") {
        ordenActualizada = await activarOrden({
          ...orden,
          estado: "en_progreso",
          horaInicio: new Date().toISOString()
        } as any, user)
      }

      toast.success(`Avance de turno ${turnoActual} iniciado para ${orden.folio}.`)
      onSuccess(nuevoAvance, ordenActualizada)
      onClose()
    } catch {
      toast.error("Error al abrir el avance de turno.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar avance de turno</DialogTitle>
          <DialogDescription>
            Se registrará el inicio del turno {turnoActual} para esta orden.
          </DialogDescription>
        </DialogHeader>

        {orden && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Orden:</span> {orden.folio}</p>
            <p><span className="font-medium">Producto:</span> {orden.producto} — {orden.color}</p>
            <p><span className="font-medium">Máquina:</span> {orden.maquina}</p>
            <p><span className="font-medium">Turno:</span> {turnoActual}</p>
            {orden.estado === "activa" && (
              <p className="text-blue-600 text-xs mt-1">
                La orden pasará a estado "En progreso" al confirmar.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirmar} disabled={isLoading}>{isLoading ? "Iniciando" : "Confirmar inicio"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}