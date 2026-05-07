// DialogDesactivarUsuario.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/usuario"

interface Props {
  open: boolean
  usuario: User | null
  onClose: () => void
}

export default function DialogDesactivarUsuario({ open, usuario, onClose }: Props) {
  const handleConfirmar = () => {
    // lógica de desactivar
    console.log("Desactivando:", usuario?.nombre)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar usuario?</DialogTitle>
          <DialogDescription>
            Esta acción desactivará al usuario seleccionado
          </DialogDescription>
        </DialogHeader>
        <p>¿Estás seguro que deseas desactivar a <strong>{usuario?.nombre}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmar}>Desactivar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}