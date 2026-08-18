import { useReactivarOperador } from "../../hooks/useOperador"
import type { Operador } from "../../schemas/operadores"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    operador: Operador | null
    onClose: () => void
}

export default function DialogReactivarOperador ({open, operador, onClose}: Props) {
    const reactivarMutation = useReactivarOperador()

    const handleConfirmar = async () => {
        if(!operador) return

        try {
            await reactivarMutation.mutateAsync(operador.id);
            toast.success(`Operador ${operador.nombre} Activado.`)
            onClose()
        } catch (error) {
            onClose();
            toast.error(error instanceof Error ? error.message : "Error al reactivar operador.")
        }
    }

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>¿Reactivar operador?</DialogTitle>
                <DialogDescription>
                    El operador volverá a estar disponible en el sistema.
                </DialogDescription>
                </DialogHeader>
                <p>¿Estás seguro que deseas reactivar a <strong>{operador?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={onClose}>Cancelar</Button>
                  <Button onClick={handleConfirmar} disabled={reactivarMutation.isPending}>
                    {reactivarMutation.isPending ? "Reactivando..." : "Reactivar"}
                  </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}