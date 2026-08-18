import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelarOrdenSchema, type CancelarOrdenInput } from "../schemas";
import type { Orden } from "../schemas/orden.schema";
import { useCancelarOrden } from "../hooks/useOrdenes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  orden: Orden | null;
  onClose: () => void;
}

export default function DialogCancelarOrden({ open, orden, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CancelarOrdenInput>({
    resolver: zodResolver(cancelarOrdenSchema),
  });

  const cancelarMutation = useCancelarOrden();
  const navigate = useNavigate();

  const onSubmit = async (data: CancelarOrdenInput) => {
    if (!orden) return;
    try {
      await cancelarMutation.mutateAsync({ id: orden.id, data });
      toast.success("Orden cancelada.");
      handleClose();
      navigate("/ordenes");
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al cancelar la orden.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cancelar orden?</DialogTitle>
          <DialogDescription>
            Esta acción revertirá el inventario reservado por esta orden. No se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {orden && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Folio:</span> {orden.folio}</p>
            <p><span className="font-medium">Producto:</span> {orden.productoNombre}</p>
            <p><span className="font-medium">Piezas:</span> {orden.totalPiezas}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo de cancelación</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe por qué se cancela esta orden..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting || cancelarMutation.isPending}>
              {isSubmitting || cancelarMutation.isPending ? "Cancelando..." : "Confirmar cancelación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}