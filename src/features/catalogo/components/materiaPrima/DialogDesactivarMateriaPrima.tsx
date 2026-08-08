import { useDesactivarMateriaPrima } from "../../hooks/useMateriasPrimas";
import type { MateriaPrima } from "../../schemas/materiaPrima";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  materiaPrima: MateriaPrima | null;
  onClose: () => void;
}

export default function DialogDesactivarMateriaPrima({ open, materiaPrima, onClose }: Props) {
  const desactivarMutation = useDesactivarMateriaPrima();

  const handleConfirmar = async () => {
    if (!materiaPrima) return;

    try {
      await desactivarMutation.mutateAsync(materiaPrima.id);
      toast.success("Materia prima desactivada.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al desactivar la materia prima.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar materia prima?</DialogTitle>
          <DialogDescription>
            La materia prima dejará de aparecer en los formularios de órdenes de producción.
          </DialogDescription>
        </DialogHeader>

        {materiaPrima && (
          <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Nombre:</span> {materiaPrima.nombre}</p>
            <p><span className="font-medium">Código:</span> {materiaPrima.codigoInterno}</p>
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