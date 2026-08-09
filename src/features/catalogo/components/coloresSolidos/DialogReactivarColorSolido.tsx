import { useReactivarColorSolido } from "../../hooks/useColorSolido";
import type { ColorSolido } from "../../schemas/colorSolido";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  colorSolido: ColorSolido | null;
  onClose: () => void;
}

export function DialogReactivarColorSolido({ open, colorSolido, onClose }: Props) {
  const reactivarMutation = useReactivarColorSolido();

  const handleConfirmar = async () => {
    if (!colorSolido) return;
    try {
      await reactivarMutation.mutateAsync(colorSolido.id);
      toast.success("Color sólido reactivado.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al reactivar el color sólido.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reactivar color sólido?</DialogTitle>
          <DialogDescription>
            El color volverá a aparecer en los formularios de pigmentos, molido y órdenes de mezcla.
          </DialogDescription>
        </DialogHeader>

        {colorSolido && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {colorSolido.nombre}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirmar} disabled={reactivarMutation.isPending}>
            {reactivarMutation.isPending ? "Reactivando..." : "Reactivar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}