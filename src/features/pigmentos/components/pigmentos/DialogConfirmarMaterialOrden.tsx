import { useConfirmarMaterialOrden } from "@/features/ordenes/hooks/useOrdenes";
import type { Orden } from "@/features/ordenes/schemas";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  orden: Orden | null;
  onClose: () => void;
}

export default function DialogConfirmarMaterialOrden({ open, orden, onClose }: Props) {
  const confirmarMutation = useConfirmarMaterialOrden();

  const handleConfirmar = async () => {
    if (!orden) return;
    try {
      await confirmarMutation.mutateAsync(orden.id);
      toast.success("Material confirmado correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al confirmar el material.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar material preparado?</DialogTitle>
          <DialogDescription>
            Confirma que ya preparaste el material virgen y pigmento necesarios para esta orden.
          </DialogDescription>
        </DialogHeader>

        {orden && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md grid grid-cols-2 gap-2">
            <p><span className="font-medium">Orden:</span> {orden.folio}</p>
            <p><span className="font-medium">Producto:</span> {orden.productoNombre}</p>
            <p><span className="font-medium">Virgen:</span> {orden.materiaPrimaVirgenKg.toFixed(2)} kg</p>
            <p><span className="font-medium">Pigmento:</span> {orden.pigmentoRequeridoKg.toFixed(3)} kg</p>
            {orden.tipoMaterial !== "VIRGEN" && (
              <p><span className="font-medium">Molido:</span> {orden.materialMolidoKg.toFixed(2)} kg</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={confirmarMutation.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={confirmarMutation.isPending}>
            {confirmarMutation.isPending ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}