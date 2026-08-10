import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Usuario } from "../../usuarios/schemas/usuario.schema";
import { useDesactivarUsuario, useReactivarUsuario } from "../../usuarios/hook/useUsuario";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
}

export default function DialogToggleEstadoUsuario({ open, usuario, onClose }: Props) {
  const esActivo = usuario?.activo ?? false;

  const desactivarMutation = useDesactivarUsuario();
  const reactivarMutation = useReactivarUsuario();

  const isLoading = desactivarMutation.isPending || reactivarMutation.isPending;

  const handleConfirmar = async () => {
    if (!usuario) return;

    try {
      if (esActivo) {
        await desactivarMutation.mutateAsync(usuario.id);
        toast.success("Usuario desactivado.");
      } else {
        await reactivarMutation.mutateAsync(usuario.id);
        toast.success("Usuario reactivado.");
      }
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : esActivo ? "Error al desactivar." : "Error al reactivar."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{esActivo ? "¿Desactivar usuario?" : "¿Reactivar usuario?"}</DialogTitle>
          <DialogDescription>
            {esActivo
              ? "El usuario ya no podrá iniciar sesión en el sistema."
              : "El usuario podrá volver a iniciar sesión en el sistema."}
          </DialogDescription>
        </DialogHeader>

        {usuario && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {usuario.nombre}</p>
            <p><span className="font-medium">Usuario:</span> {usuario.usuario}</p>
            <p><span className="font-medium">Rol:</span> {usuario.role}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant={esActivo ? "destructive" : "default"}
            onClick={handleConfirmar}
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Cambiar estado"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}