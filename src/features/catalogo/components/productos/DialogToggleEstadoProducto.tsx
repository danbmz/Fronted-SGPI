import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Producto } from "../../schemas/productos";
import { useDesactivarProducto, useReactivarProducto } from "../../hooks/useProducto";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  producto: Producto | null;
  onClose: () => void;
}

export default function DialogToggleEstadoProducto({ open, producto, onClose }: Props) {
  const esActivo = producto?.activo ?? false;

  const desactivarMutation = useDesactivarProducto();
  const reactivarMutation = useReactivarProducto();

  const isLoading = desactivarMutation.isPending || reactivarMutation.isPending;

  const handleConfirmar = async () => {
    if (!producto) return;

    try {
      if (esActivo) {
        await desactivarMutation.mutateAsync(producto.id);
        toast.success("Producto desactivado.");
      } else {
        await reactivarMutation.mutateAsync(producto.id);
        toast.success("Producto reactivado.");
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
          <DialogTitle>{esActivo ? "¿Desactivar producto?" : "¿Reactivar producto?"}</DialogTitle>
          <DialogDescription>
            {esActivo
              ? "El producto dejará de aparecer en los formularios de órdenes de producción."
              : "El producto volverá a aparecer en los formularios de órdenes de producción."}
          </DialogDescription>
        </DialogHeader>

        {producto && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {producto.nombre}</p>
            <p><span className="font-medium">Código:</span> {producto.codigo}</p>
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