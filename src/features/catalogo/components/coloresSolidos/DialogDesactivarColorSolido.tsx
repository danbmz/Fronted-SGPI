import { useDesactivarColorSolido } from "../../hooks/useColorSolido";
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

export function DialogDesactivarColorSolido({ open, colorSolido, onClose }: Props) {
  const desactivarMutation = useDesactivarColorSolido();

  const handleConfirmar = async () => {
    if (!colorSolido) return;
    try {
      await desactivarMutation.mutateAsync(colorSolido.id);
      toast.success("Color sólido desactivado.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al desactivar el color sólido.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar color sólido?</DialogTitle>
          <DialogDescription>
            El color dejará de aparecer en los formularios de pigmentos, molido y órdenes de mezcla.
          </DialogDescription>
        </DialogHeader>

        {colorSolido && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {colorSolido.nombre}</p>
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