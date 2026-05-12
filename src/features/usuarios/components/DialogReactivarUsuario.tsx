import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/usuario"
import { reactivarUsuario } from "../usuariosServices"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"

interface Props {
  open: boolean
  usuario: User | null
  onClose: () => void
  onSuccess: (usuario: User) => void
}

export default function DialogReactivarUsuario({ open, usuario, onClose, onSuccess }: Props) {
  const { user } = useAuth()

  const handleConfirmar = async () => {
    if (!usuario || !user) return
    try {
      const usuarioReactivado = await reactivarUsuario(usuario, user)
      toast.success("Usuario reactivado.")
      onSuccess(usuarioReactivado)
      onClose()
    } catch {
      toast.error("No se pudo reactivar el usuario.")
    }
}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reactivar usuario?</DialogTitle>
          <DialogDescription>
            El usuario volverá a tener acceso al sistema.
          </DialogDescription>
        </DialogHeader>
        <p>¿Estás seguro que deseas reactivar a <strong>{usuario?.nombre}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirmar}>Reactivar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}