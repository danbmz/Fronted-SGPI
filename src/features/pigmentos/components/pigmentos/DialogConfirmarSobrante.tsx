import { useConfirmarSobrante } from "@/features/avancesTurno/hooks/useAvanceTurno";
import type { AvanceTurno } from "@/features/avancesTurno/schemas/avanceTurno";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  avance: AvanceTurno | null;
  onClose: () => void;
}

export default function DialogConfirmarSobrante({ open, avance, onClose }: Props) {
  const confirmarMutation = useConfirmarSobrante();

  const confirmar = async (confirmado: boolean) => {
    if (!avance) return;
    try {
      await confirmarMutation.mutateAsync({ id: avance.id, data: { confirmado } });
      toast.success(confirmado ? "Recepción confirmada." : "Diferencia registrada.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al confirmar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar recepción de sobrante</DialogTitle>
          <DialogDescription>
            {avance ? `Orden: ${avance.ordenFolio} — Reportado por ${avance.supervisorNombre}` : ""}
          </DialogDescription>
        </DialogHeader>

        {avance && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Kg sobrante:</span> {avance.kgSobrante}</p>
            <p><span className="font-medium">Tipo:</span> {avance.tipoMaterialSobrante}</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          ¿Confirmas que recibiste correctamente el material indicado?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={confirmarMutation.isPending}>
            Cancelar
          </Button>
          <Button onClick={() => confirmar(true)} disabled={confirmarMutation.isPending}>
            {confirmarMutation.isPending ? "Confirmando..." : "Confirmar recepción"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}