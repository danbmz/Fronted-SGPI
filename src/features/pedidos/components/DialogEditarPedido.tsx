import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarPedidoSchema, type EditarPedidoInput } from "../schemas";
import type { Pedido } from "../schemas/pedido.schema";
import { useEditarPedido } from "../hooks/usePedidos";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  pedido: Pedido | null;
  onClose: () => void;
}

export default function DialogEditarPedido({ open, pedido, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarPedidoInput>({
    resolver: zodResolver(editarPedidoSchema),
  });

  const editarMutation = useEditarPedido();

  useEffect(() => {
    if (pedido) {
      reset({
        cliente: pedido.cliente,
        descripcion: pedido.descripcion ?? undefined,
      });
    }
  }, [pedido]);

  const onSubmit = async (data: EditarPedidoInput) => {
    if (!pedido) return;
    try {
      await editarMutation.mutateAsync({ id: pedido.id, data });
      toast.success("Pedido actualizado correctamente.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar el pedido.");
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
          <DialogTitle>Editar pedido</DialogTitle>
          <DialogDescription>
            Modifica los datos generales del pedido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {pedido && (
            <div className="flex flex-col gap-1">
              <Label>Número de pedido</Label>
              <Input value={pedido.numeroPedido} disabled />
              <p className="text-xs text-muted-foreground">No se puede modificar.</p>
            </div>
          )}

          {pedido?.remision && (
            <div className="flex flex-col gap-1">
              <Label>Remisión</Label>
              <Input value={pedido.remision} disabled />
              <p className="text-xs text-muted-foreground">No se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Cliente</Label>
            <Input {...register("cliente")} placeholder="Ej. Comercializadora del Valle" />
            {errors.cliente && <p className="text-xs text-red-500">{errors.cliente.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Descripción</Label>
            <Textarea {...register("descripcion")} placeholder="Notas generales del pedido..." rows={3} />
            {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty || editarMutation.isPending}>
              {isSubmitting || editarMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}