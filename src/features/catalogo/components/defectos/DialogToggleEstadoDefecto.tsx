import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DefectoProducto } from "../../schemas/defectos";
import { useDesactivarDefectoProducto, useReactivarDefectoProducto } from "../../hooks/useDefectosProducto";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  defecto: DefectoProducto | null;
  onClose: () => void;
}

export default function DialogToggleEstadoDefecto({ open, defecto, onClose }: Props) {
  const esActivo = defecto?.activo ?? false;

  const desactivarMutation = useDesactivarDefectoProducto();
  const reactivarMutation = useReactivarDefectoProducto();

  const isLoading = desactivarMutation.isPending || reactivarMutation.isPending;

  const handleConfirmar = async () => {
    if (!defecto) return;

    try {
      if (esActivo) {
        await desactivarMutation.mutateAsync(defecto.id);
        toast.success("Defecto desactivado.");
      } else {
        await reactivarMutation.mutateAsync(defecto.id);
        toast.success("Defecto reactivado.");
      }
      onClose();
    } catch (error) {
      onClose();
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
          <DialogTitle>{esActivo ? "¿Desactivar defecto?" : "¿Reactivar defecto?"}</DialogTitle>
          <DialogDescription>
            {esActivo
              ? "El defecto dejará de aparecer en los formularios de registro de avance."
              : "El defecto volverá a aparecer en los formularios de registro de avance."}
          </DialogDescription>
        </DialogHeader>

        {defecto && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {defecto.nombre}</p>
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