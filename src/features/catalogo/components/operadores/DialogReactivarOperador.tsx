import { useAuth } from "@/features/auth/hooks/useAuth"
import type { Operador } from "@/types/operadoresCatalogo"
import { reactivarOperador } from "../../services/operadorService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    operador: Operador | null
    onClose: () => void
    onSuccess: (operador: Operador) => void
}

export default function DialogReactivarOperador ({open, operador, onClose, onSuccess}: Props) {
    const { user } = useAuth()

    const handleConfirmar = async () => {
        if(!operador || !user) return

        try {
            const operadorReactivado = await reactivarOperador(operador, user);
            onSuccess(operadorReactivado)
            toast.success(`Operador ${operador.nombre} desactivado.`)
            onClose()
        } catch (error) {
            onClose()
            toast.error("Error al intentar desactivar Operador.")
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
                <Button onClick={handleConfirmar}>Reactivar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}