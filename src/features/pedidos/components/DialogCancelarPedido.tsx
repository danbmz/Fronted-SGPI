import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelarPedidoSchema, type CancelarPedidoInput } from "../schemas";
import type { Pedido } from "../schemas/pedido.schema";
import { useCancelarPedido } from "../hooks/usePedidos";
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
  pedido: Pedido | null;
  onClose: () => void;
}

export default function DialogCancelarPedido({ open, pedido, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CancelarPedidoInput>({
    resolver: zodResolver(cancelarPedidoSchema),
  });

  const cancelarMutation = useCancelarPedido();

  const onSubmit = async (data: CancelarPedidoInput) => {
    if (!pedido) return;
    try {
      await cancelarMutation.mutateAsync({ id: pedido.id, data });
      toast.success("Pedido cancelado.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cancelar el pedido.");
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
          <DialogTitle>¿Cancelar pedido?</DialogTitle>
          <DialogDescription>
            Esta acción cancelará el pedido y todas sus órdenes en borrador o activas. No se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {pedido && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Pedido:</span> {pedido.numeroPedido}</p>
            <p><span className="font-medium">Cliente:</span> {pedido.cliente}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo de cancelación</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe por qué se cancela este pedido..."
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