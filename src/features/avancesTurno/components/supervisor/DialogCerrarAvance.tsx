import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type CerrarAvanceForm, type AvanceTurno, cerrarAvanceSchema } from "@/validations/avancesTurno/avanceTurnoValidations"
import { cerrarAvance, guardarBorradorAvance } from "../../services/avanceTurnoService"
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
import { useEffect, useState } from "react"
import { CheckCircle, Save } from "lucide-react"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"

interface Props {
  open: boolean
  avance: AvanceTurno | null
  orden: OrdenProduccion | null        // ← necesario para calcular piezas extra
  avancesAnteriores: AvanceTurno[]     // ← para sumar piezas ya producidas
  onClose: () => void
  onSuccess: (avance: AvanceTurno) => void
}

export default function DialogCerrarAvance({ open, avance, orden, avancesAnteriores, onClose, onSuccess }: Props) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register, handleSubmit, reset, getValues,
    formState: { errors, isSubmitting, isDirty}
  } = useForm<CerrarAvanceForm>({
    resolver: zodResolver(cerrarAvanceSchema),
    defaultValues: {
        piezasBuenas: 0,
        piezasDefectuosas: 0,
        kgMerma: undefined,
        kgPlasta: undefined,
        kgSobrante: undefined,
        piezasCambioColor: undefined,
        observaciones: ""
    }
  })

    // console.log({
    //     values: watch(),
    //     isDirty,
    //     dirtyFields
    // });

    // Si hay borrador guardado, rellena el form con esos datos
    useEffect(() => {
        if (avance?.borradorGuardado) {
        reset({
            piezasBuenas: avance.piezasBuenas,
            piezasDefectuosas: avance.piezasDefectuosas,
            kgMerma: avance.kgMerma,
            kgPlasta: avance.kgPlasta,
            kgSobrante: avance.kgSobrante || undefined,
            piezasCambioColor: avance.piezasCambioColor || undefined,
            observaciones: avance.observaciones ?? ""
        })
        }
    }, [avance, reset])

    // Funcion que guarda el borrador
    const handleGuardarBorrador = async () => {
        if (!user || !avance || !isDirty) return
        setIsLoading(true)
        try {
            const datosActuales = getValues()
            const avanceActualizado = await guardarBorradorAvance(avance, datosActuales, user)
            toast.success("Borrador guardado correctamente.")
            onSuccess(avanceActualizado)
            onClose()
        } catch {
            toast.error("Error al guardar el borrador.")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: CerrarAvanceForm) => {
    if (!user || !avance || !orden) return
    try {
        const avanceCerrado = await cerrarAvance(avance, data, orden, avancesAnteriores, user)
        console.log(`Avance creado: `, avanceCerrado)
        toast.success("Avance de turno cerrado correctamente.")
        onSuccess(avanceCerrado)
        reset()
        onClose()
    } catch {
        toast.error("Error al cerrar el avance.")
    }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{avance?.borradorGuardado ? "Editar avance de turno" : "Registrar avance de turno"}</DialogTitle>
          <DialogDescription>
            Registra los resultados del turno {avance?.turno} — {avance?.folio}
          </DialogDescription>
        </DialogHeader>

        {/* Muestra los datos de la orden */}
        {avance && (
          <div className="text-sm flex items-center gap-3 bg-muted px-3 py-2 rounded-md">
            <span className="font-medium">{avance.producto}</span>
            <span className="text-muted-foreground">—</span>
            <span>{avance.color}</span>
            <span className="text-muted-foreground">—</span>
            <span>{avance.maquina}</span>
          </div>
        )}

        {/* Muestra un mensaje para especificar el usuario que puede seguir editando */}
        {avance?.borradorGuardado && (
          <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-2 rounded-md">
            <Save size={14} />
            <span>Tienes un borrador guardado. Puedes modificarlo o cerrarlo definitivamente.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

            {/* Producción */}
            <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Producción
            </p>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                <Label>Piezas buenas</Label>
                <Input
                    type="number"
                    {...register("piezasBuenas", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                    placeholder="0"
                />
                {errors.piezasBuenas && <p className="text-xs text-red-500">{errors.piezasBuenas.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                <Label>Piezas defectuosas</Label>
                <Input
                    type="number"
                    {...register("piezasDefectuosas", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                    placeholder="0"
                />
                {errors.piezasDefectuosas && <p className="text-xs text-red-500">{errors.piezasDefectuosas.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                <Label>Piezas por Cambio de color</Label>
                <Input
                    type="number"
                    {...register("piezasCambioColor", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                    placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Piezas de transición entre colores — van a molino.</p>
                {errors.piezasCambioColor && <p className="text-xs text-red-500">{errors.piezasCambioColor.message}</p>}
                </div>
            </div>
            </div>

            {/* Merma */}
            <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Merma
            </p>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                <Label>Kg de merma</Label>
                <Input
                    type="number"
                    step="0.1"
                    {...register("kgMerma", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                    placeholder="0"
                />
                {errors.kgMerma && <p className="text-xs text-red-500">{errors.kgMerma.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                <Label>Kg de plasta</Label>
                <Input
                    type="number"
                    step="0.1"
                    {...register("kgPlasta", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                    placeholder="0"
                />
                {errors.kgPlasta && <p className="text-xs text-red-500">{errors.kgPlasta.message}</p>}
                </div>
            </div>
            </div>

            {/* Material */}
            <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Material
            </p>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                <Label>Kg sobrantes</Label>
                <Input
                    type="number"
                    step="0.1"
                    {...register("kgSobrante", { 
                        setValueAs: v => v === "" || isNaN(v) ? undefined : Number(v)
                     })}
                     placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Pendiente confirmación de pigmentos.</p>
                {errors.kgSobrante && <p className="text-xs text-red-500">{errors.kgSobrante.message}</p>}
                </div>
            </div>
            </div>

            {/* Observaciones */}
            <div className="flex flex-col gap-1">
            <Label>Observaciones <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
                {...register("observaciones")}
                placeholder="Notas adicionales del turno..."
                rows={2}
            />
            </div>

            {/* Botones */}
            <div className="flex justify-between mt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
                </Button>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGuardarBorrador}
                        disabled={isLoading || !isDirty}
                    >
                        <Save size={14} className="mr-1" />
                        {isLoading ? "Guardando" : "Guardar borrador"}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <CheckCircle size={14} className="mr-1" />
                        {isSubmitting ? "Cerrando" : "Cerrar turno"}
                    </Button>
                </div>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}