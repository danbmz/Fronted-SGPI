import type { Operador } from "../../schemas/operadores"
import { useDesactivarOperador } from "../../hooks/useOperador"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    operador: Operador | null
    onClose: () => void
}

export default function DialogDesactivarOperador({open, operador, onClose}: Props) {
    const desactivarMutation = useDesactivarOperador();

    const handleConfirmar = async () => {
        if(!operador) return
            try {
                await desactivarMutation.mutateAsync(operador.id);
                toast.success("Operador desactivado.");
                onClose();
            } catch (error) {
                onClose();
                toast.error(error instanceof Error ? error.message : "Error al desactivar al operador.");
            }
    }

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>¿Desactivar operador?</DialogTitle>
                <DialogDescription>
                    El operador dejará de aparecer en los formularios de registro de avance.
                </DialogDescription>
                </DialogHeader>
                    <p>¿Estás seguro que deseas desactivar a <strong>{operador?.nombre}</strong>?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleConfirmar} disabled={desactivarMutation.isPending}>
                        {desactivarMutation.isPending ? "Desactivando..." : "Desactivar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}