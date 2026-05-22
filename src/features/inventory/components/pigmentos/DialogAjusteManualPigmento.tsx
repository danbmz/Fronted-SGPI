import { useAuth } from "@/features/auth/hooks/useAuth"
import { ajusteManualSchema, type AjusteManualForm, type InventarioPigmento } from "@/validations/inventario/inventarioValidations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { ajustarStockPigmento } from "../../services/pigmentos/inventarioPigmentoService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    pigmento: InventarioPigmento | null
    onClose: () => void
    onSuccess: (pigmento: InventarioPigmento) => void    
}

export default function DialogAjusteManualPigmento({open, pigmento, onClose, onSuccess}: Props) {
    const { user } = useAuth()
    const { register, handleSubmit, reset, setValue,
        formState: { errors, isSubmitting}
    } = useForm<AjusteManualForm>({
        resolver: zodResolver(ajusteManualSchema)
    })

    useEffect(() => {
        if(pigmento) {
            setValue("stockNuevo", pigmento.stockActual)
        }
    }, [])

    const onSubmit = async (data: AjusteManualForm) => {
        if(!user || !pigmento) return
        try {
            const actualizado = await ajustarStockPigmento(pigmento.id, data, pigmento, user)
            toast.success("Stock ajustado correctamente")
            onSuccess(actualizado)
            reset()
            onClose()
        } catch (error) {
            toast.error("Error al ajustar el stock")
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return(
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Ajuste manual de stock</DialogTitle>
                <DialogDescription>
                    Modifica el stock actual con una justificación del ajuste.
                </DialogDescription>
                </DialogHeader>

                {pigmento && (
                <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
                    <p><span className="font-medium">Material:</span> {pigmento.color}</p>
                    <p><span className="font-medium">Stock actual:</span> {pigmento.stockActual} kg</p>
                    <p><span className="font-medium">Stock mínimo:</span> {pigmento.stockMinimo} kg</p>
                </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                    <Label>Nuevo stock (kg)</Label>
                    <Input
                    type="number"
                    step="0.01"
                    {...register("stockNuevo", { valueAsNumber: true })}
                    />
                    {errors.stockNuevo && <p className="text-xs text-red-500">{errors.stockNuevo.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Motivo del ajuste</Label>
                    <Textarea
                    {...register("motivo")}
                    placeholder="Describe el motivo del ajuste..."
                    rows={3}
                    />
                    {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando" : "Guardar ajuste"}</Button>
                </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}