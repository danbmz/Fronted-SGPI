import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearPedidoSchema, type CrearPedidoInput } from "../schemas";
import { useCrearPedido } from "../hooks/usePedidos";
import { useNavigate } from "react-router-dom";
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
  onClose: () => void;
}

export default function DialogCrearPedido({ open, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CrearPedidoInput>({
    resolver: zodResolver(crearPedidoSchema),
  });

  const crearMutation = useCrearPedido();
  const navigate = useNavigate();

  const onSubmit = async (data: CrearPedidoInput) => {
    try {
      const nuevoPedido = await crearMutation.mutateAsync(data);
      toast.success("Pedido creado correctamente.");
      reset();
      onClose();
      navigate(`/pedidos/${nuevoPedido.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el pedido.");
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
          <DialogTitle>Nuevo pedido</DialogTitle>
          <DialogDescription>
            Registra un nuevo pedido de cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Número de pedido</Label>
            <Input {...register("numeroPedido")} placeholder="Ej. PED-2026-001" />
            {errors.numeroPedido && <p className="text-xs text-red-500">{errors.numeroPedido.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Cliente</Label>
            <Input {...register("cliente")} placeholder="Ej. Comercializadora del Valle, o STOCK" />
            {errors.cliente && <p className="text-xs text-red-500">{errors.cliente.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Remisión (opcional)</Label>
            <Input {...register("remision")} placeholder="Ej. REM-4521" />
            {errors.remision && <p className="text-xs text-red-500">{errors.remision.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Descripción (opcional)</Label>
            <Textarea {...register("descripcion")} placeholder="Notas generales del pedido..." rows={3} />
            {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}