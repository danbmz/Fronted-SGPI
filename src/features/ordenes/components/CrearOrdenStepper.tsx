import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { OrdenProduccion, Paso1Form, Paso2Form, Paso3Form } from "@/validations/ordenes/ordenProduccionValidations"
import { crearOrden, calcularCampos as calcular } from "@/features/ordenes/services/ordenesProduccionService"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import Paso1Producto from "./stepper/Paso1Producto"
import Paso2Materiales from "./stepper/Paso2Materiales"
import Paso3Produccion from "./stepper/Paso3Produccion"
import Paso4Resumen from "./stepper/Paso4Resumen"

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (orden: OrdenProduccion) => void
}

const PASOS = ["Producto", "Materiales", "Producción", "Resumen"]

export default function CrearOrdenStepper({ open, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const [pasoActual, setPasoActual] = useState(0)
  const [paso1, setPaso1] = useState<Paso1Form | null>(null)
  const [paso2, setPaso2] = useState<Paso2Form | null>(null)
  const [paso3, setPaso3] = useState<Paso3Form | null>(null)
  const [guardando, setGuardando] = useState(false)

  const handleClose = () => {
    setPasoActual(0)
    setPaso1(null)
    setPaso2(null)
    setPaso3(null)
    onClose()
  }

  const handlePaso1 = (data: Paso1Form) => {
    console.log(data)
    setPaso1(data)
    setPasoActual(1)
  }

  const handlePaso2 = (data: Paso2Form) => {
    setPaso2(data)
    setPasoActual(2)
  }

  const handlePaso3 = (data: Paso3Form) => {
    setPaso3(data)
    setPasoActual(3)
  }

  const handleGuardar = async () => {
    if (!user || !paso1 || !paso2 || !paso3) return
    setGuardando(true)
    try {
      // Necesitamos la dosis del pigmento para calcular — por ahora usamos 5 como placeholder
      // Cuando conectes el backend este valor vendrá de la fórmula de pigmento
      const dosisGrPorKg = 5
      const calculos = calcular(
        paso1.totalPiezas,
        paso1.pesoUnitarioGr,
        paso3.cicloEstandarSeg,
        dosisGrPorKg
      )
      const nuevaOrden = await crearOrden(paso1, paso2, paso3, calculos, user)
      toast.success(`Orden ${nuevaOrden.folio} creada como borrador.`)
      onSuccess(nuevaOrden)
      handleClose()
    } catch {
      toast.error("Error al crear la orden.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva orden de producción</DialogTitle>
          <DialogDescription>
            Paso {pasoActual + 1} de {PASOS.length} — {PASOS[pasoActual]}
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2 mb-2">
          {PASOS.map((paso, index) => (
            <div key={paso} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                index < pasoActual
                  ? "bg-green-500 text-white"
                  : index === pasoActual
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {index < pasoActual ? "✓" : index + 1}
              </div>
              <span className={`text-xs hidden sm:block ${
                index === pasoActual ? "font-medium" : "text-muted-foreground"
              }`}>
                {paso}
              </span>
              {index < PASOS.length - 1 && (
                <div className={`flex-1 h-px ${index < pasoActual ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Contenido del paso activo */}
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {pasoActual === 0 && (
            <Paso1Producto
              defaultValues={paso1}
              onNext={handlePaso1}
              onCancel={handleClose}
            />
          )}
          {pasoActual === 1 && (
            <Paso2Materiales
              paso1={paso1!}
              defaultValues={paso2}
              onNext={handlePaso2}
              onBack={() => setPasoActual(0)}
            />
          )}
          {pasoActual === 2 && (
            <Paso3Produccion
              paso1={paso1!}
              defaultValues={paso3}
              onNext={handlePaso3}
              onBack={() => setPasoActual(1)}
            />
          )}
          {pasoActual === 3 && (
            <Paso4Resumen
              paso1={paso1!}
              paso2={paso2!}
              paso3={paso3!}
              guardando={guardando}
              onGuardar={handleGuardar}
              onBack={() => setPasoActual(2)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}