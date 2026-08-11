import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salidaProductoSchema, type SalidaProductoInput } from "../../inventory/schemas";
import { useSalidaProducto } from "../../inventory/hook/useInventario";
import { usePedidos } from "../hooks/usePedidos";
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
import { Trash2, Plus } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  pedidoIdInicial?: string;
}

export default function DialogSalidaProducto({ open, onClose, pedidoIdInicial }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch, control,
    formState: { errors, isSubmitting }
  } = useForm<SalidaProductoInput>({
    resolver: zodResolver(salidaProductoSchema),
    defaultValues: {
      motivo: pedidoIdInicial ? "ENTREGA_PEDIDO" : "VENTA",
      pedidoId: pedidoIdInicial,
      items: [{ productoId: "", pigmentoId: "", cantidad: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const salidaMutation = useSalidaProducto();
  const { data: pedidos } = usePedidos();
  const { data: productos } = useProducto();
  const { data: pigmentos } = usePigmento();

  const motivo = watch("motivo");

  const onSubmit = async (data: SalidaProductoInput) => {
    try {
      await salidaMutation.mutateAsync(data);
      toast.success("Salida registrada correctamente.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar la salida.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar salida de producto</DialogTitle>
          <DialogDescription>
            Registra la entrega de un pedido o una venta directa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo</Label>
            <Select
              value={motivo ?? ""}
              onValueChange={(val) => {
                setValue("motivo", val as "ENTREGA_PEDIDO" | "VENTA", { shouldValidate: true });
                if (val === "VENTA") setValue("pedidoId", undefined);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTREGA_PEDIDO">Entrega de pedido</SelectItem>
                <SelectItem value="VENTA">Venta directa</SelectItem>
              </SelectContent>
            </Select>
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          {motivo === "ENTREGA_PEDIDO" && (
            <div className="flex flex-col gap-1">
              <Label>Pedido</Label>
              <Select
                value={watch("pedidoId") ?? ""}
                onValueChange={(val) => setValue("pedidoId", val, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un pedido" />
                </SelectTrigger>
                <SelectContent>
                  {(pedidos ?? [])
                    .filter((p) => p.estado !== "CANCELADO")
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.numeroPedido} — {p.cliente}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.pedidoId && <p className="text-xs text-red-500">{errors.pedidoId.message}</p>}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Productos a entregar</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start border rounded-md p-3">
                <div className="flex-1 flex flex-col gap-2">
                  <Select
                    value={watch(`items.${index}.productoId`) ?? ""}
                    onValueChange={(val) =>
                      setValue(`items.${index}.productoId`, val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {(productos ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={watch(`items.${index}.pigmentoId`) ?? ""}
                    onValueChange={(val) =>
                      setValue(`items.${index}.pigmentoId`, val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {(pigmentos ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Cantidad"
                    {...register(`items.${index}.cantidad`, { valueAsNumber: true })}
                  />
                  {errors.items?.[index] && (
                    <p className="text-xs text-red-500">Revisa este producto</p>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productoId: "", pigmentoId: "", cantidad: 1 })}
            >
              <Plus size={14} className="mr-1" />
              Agregar producto
            </Button>
            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-xs text-red-500">{errors.items.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Descripción (opcional)</Label>
            <Input {...register("descripcion")} placeholder="Notas adicionales..." />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || salidaMutation.isPending}>
              {isSubmitting || salidaMutation.isPending ? "Registrando..." : "Registrar salida"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}