import { useDesactivarPigmento } from "../../hooks/usePigmentos";
import type { Pigmento } from "../../schemas/pigmento";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  pigmento: Pigmento | null;
  onClose: () => void;
}

export default function DialogDesactivarPigmento({ open, pigmento, onClose }: Props) {
  const desactivarMutation = useDesactivarPigmento();

  const handleConfirmar = async () => {
    if (!pigmento) return;

    try {
      await desactivarMutation.mutateAsync(pigmento.id);
      toast.success("Pigmento desactivado.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al desactivar el pigmento.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar pigmento?</DialogTitle>
          <DialogDescription>
            El pigmento dejará de aparecer en los formularios de fórmulas y órdenes de producción.
          </DialogDescription>
        </DialogHeader>

        {pigmento && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Color:</span> {pigmento.color}</p>
            <p><span className="font-medium">Categoría:</span> {pigmento.categoriaColor}</p>
            <p><span className="font-medium">Tipo:</span> {pigmento.tipo}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirmar} disabled={desactivarMutation.isPending}>
            {desactivarMutation.isPending ? "Desactivando..." : "Desactivar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}