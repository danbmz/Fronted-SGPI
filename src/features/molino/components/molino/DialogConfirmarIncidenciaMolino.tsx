import { useConfirmarIncidenciaMolino } from "@/features/avancesTurno/hooks/useIncidencia";
import type { Incidencia } from "@/features/avancesTurno/schemas/incidencia";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  incidencia: Incidencia | null;
  onClose: () => void;
}

export default function DialogConfirmarIncidenciaMolino({ open, incidencia, onClose }: Props) {
  const confirmarMutation = useConfirmarIncidenciaMolino();

  const confirmar = async (confirmado: boolean) => {
    if (!incidencia) return;
    try {
      await confirmarMutation.mutateAsync({ id: incidencia.id, data: { confirmado } });
      toast.success(confirmado ? "Recepción confirmada." : "Diferencia registrada.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al confirmar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar recepción de material</DialogTitle>
          <DialogDescription>
            Piezas mal pigmentadas enviadas a molino desde un avance de turno.
          </DialogDescription>
        </DialogHeader>

        {incidencia && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Piezas reportadas:</span> {incidencia.piezasAfectadas}</p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          ¿Confirmas que recibiste correctamente el material indicado?
        </p>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={confirmarMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={() => confirmar(false)}
            disabled={confirmarMutation.isPending}
          >
            Hay diferencia
          </Button>
          <Button onClick={() => confirmar(true)} disabled={confirmarMutation.isPending}>
            {confirmarMutation.isPending ? "Confirmando..." : "Todo correcto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}