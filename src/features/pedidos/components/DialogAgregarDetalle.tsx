import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearPedidoDetalleSchema, type CrearPedidoDetalleInput } from "../schemas";
import { useAgregarDetallePedido } from "../hooks/usePedidos";
import { useProducto } from "@/features/catalogo/hooks/useProducto";
import { usePigmento } from "@/features/catalogo/hooks/usePigmentos";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  pedidoId: string;
  onClose: () => void;
}

export default function DialogAgregarDetalle({ open, pedidoId, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearPedidoDetalleInput>({
    resolver: zodResolver(crearPedidoDetalleSchema),
  });

  const agregarMutation = useAgregarDetallePedido();
  const { data: productos } = useProducto();
  const { data: pigmentos } = usePigmento();

  const productosActivos = productos?.filter((p) => p.activo);
  const pigmentosActivos = pigmentos?.filter((p) => p.activo);

  const onSubmit = async (data: CrearPedidoDetalleInput) => {
    try {
      await agregarMutation.mutateAsync({ pedidoId, data });
      toast.success("Línea agregada correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al agregar la línea.");
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
          <DialogTitle>Agregar línea al pedido</DialogTitle>
          <DialogDescription>
            Especifica el producto y la cantidad solicitada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Producto</Label>
            <Select
              value={watch("productoId") ?? ""}
              onValueChange={(val) => setValue("productoId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {(productosActivos ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{`${p.nombre} - ${p.tipoMaterial.toLowerCase()}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productoId && <p className="text-xs text-red-500">{errors.productoId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color (opcional)</Label>
            <Select
              value={watch("pigmentoId") ?? ""}
              onValueChange={(val) => setValue("pigmentoId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin especificar" />
              </SelectTrigger>
              <SelectContent>
                {(pigmentosActivos ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{`${p.color} ${p.categoriaColor.toLowerCase()} - ${p.tipoMaterial.toLowerCase()}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Si no especificas color, se define al crear la orden.</p>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Cantidad solicitada</Label>
            <Input
              type="number"
              {...register("cantidadSolicitada", { valueAsNumber: true })}
              placeholder="Ej. 500"
            />
            {errors.cantidadSolicitada && <p className="text-xs text-red-500">{errors.cantidadSolicitada.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || agregarMutation.isPending}>
              {isSubmitting || agregarMutation.isPending ? "Agregando..." : "Agregar línea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}