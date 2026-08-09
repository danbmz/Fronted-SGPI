import { useDesactivarMotivoParo } from "../../hooks/useMotivosParo";
import type { MotivoParo } from "../../schemas/motivosParo";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  motivo: MotivoParo | null;
  onClose: () => void;
}

export default function DialogDesactivarMotivoParo({ open, motivo, onClose }: Props) {
  const desactivarMutation = useDesactivarMotivoParo();

  const handleConfirmar = async () => {
    if (!motivo) return;

    try {
      await desactivarMutation.mutateAsync(motivo.id);
      toast.success("Motivo de paro desactivado.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al desactivar el motivo de paro.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Desactivar motivo de paro?</DialogTitle>
          <DialogDescription>
            El motivo dejará de aparecer en los formularios de registro de paro.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm">
          ¿Estás seguro que deseas desactivar <strong>{motivo?.nombre}</strong>?
        </p>

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