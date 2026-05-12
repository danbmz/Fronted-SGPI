import { useAuth } from "@/features/auth/hooks/useAuth"
import type { Operador } from "@/types/operadoresCatalogo"
import { desactivarOperador } from "../../services/operadorService"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    operador: Operador | null
    onClose: () => void
    onSuccess: (operador: Operador) => void
}

export default function DialogDesactivarOperador({open, operador, onClose, onSuccess}: Props) {
    const { user } = useAuth()

    const handleConfirmar = async () => {
        if(!operador || !user) return

        try {
            const operadorDesactivado = await desactivarOperador(operador, user)
            onSuccess(operadorDesactivado)
            toast.success("Operador desactivado.")
            onClose()
        } catch (error) {
            onClose()
            toast.success("Error al intentar desactivar Operador.")
        }
    }

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>¿Desactivar operador?</DialogTitle>
                <DialogDescription>
                    Esta acción desactivará al operador seleccionado
                </DialogDescription>
                </DialogHeader>
                    <p>¿Estás seguro que deseas desactivar a <strong>{operador?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button variant="destructive" onClick={handleConfirmar}>Desactivar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}