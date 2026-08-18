import { useReactivarMotivoParo } from "../../hooks/useMotivosParo";
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

export default function DialogReactivarMotivoParo({ open, motivo, onClose }: Props) {
  const reactivarMutation = useReactivarMotivoParo();

  const handleConfirmar = async () => {
    if (!motivo) return;

    try {
      await reactivarMutation.mutateAsync(motivo.id);
      toast.success("Motivo de paro reactivado.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al reactivar el motivo de paro.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Reactivar motivo de paro?</DialogTitle>
          <DialogDescription>
            El motivo volverá a aparecer en los formularios de registro de paro.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm">
          ¿Estás seguro que deseas reactivar <strong>{motivo?.nombre}</strong>?
        </p>

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