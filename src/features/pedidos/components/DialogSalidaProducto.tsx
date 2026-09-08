import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salidaProductoSchema, type SalidaProductoInput } from "../../inventory/schemas";
import { useSalidaProducto } from "../../inventory/hook/useInventario";
import { useInventarioProducto } from "../../inventory/hook/useInventario";
import { usePedido } from "../hooks/usePedidos";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useEffect } from "react";
import SelectNativo from "@/components/ui/selectNativo";
import ComboboxProductoColor from "./ComboBoxProductoColor";

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
  const { data: pedidoCompleto } = usePedido(pedidoIdInicial);
  const { data: inventarioProducto } = useInventarioProducto();

  useEffect(() => {
    if (open) {
      setValue("motivo", pedidoIdInicial ? "ENTREGA_PEDIDO" : "VENTA");
      if (pedidoIdInicial) {
        setValue("pedidoId", pedidoIdInicial);
      }
    }
  }, [open, pedidoIdInicial]);

  const onSubmit = async (data: SalidaProductoInput) => {
    try {
      await salidaMutation.mutateAsync(data);
      toast.success("Salida registrada correctamente.");
      handleClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al registrar la salida.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar salida de producto</DialogTitle>
          <DialogDescription>
            Registra la entrega de un pedido o una venta directa.
          </DialogDescription>
        </DialogHeader>

        {pedidoIdInicial && pedidoCompleto && (
          <div className="border rounded-md p-3 flex flex-col gap-2">
            <p className="text-sm font-medium">Resumen del pedido {pedidoCompleto.numeroPedido}</p>
            {pedidoCompleto.detalle.map((linea) => (
              <div key={linea.id} className="flex justify-between text-sm text-muted-foreground">
                <span>{linea.productoNombre} — {linea.pigmentoColor ?? "Sin especificar"} {linea.categoriaColor}</span>
                <span>{linea.cantidadEntregada} / {linea.cantidadSolicitada} entregado</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo</Label>
            <SelectNativo
              value={watch("motivo") ?? ""}
              onValueChange={() => {}} // no aplica, el select está deshabilitado
              opciones={[
                { value: "VENTA", label: "Venta directa" },
                { value: "ENTREGA_PEDIDO", label: "Entrega de pedido" },
              ]}
              disabled
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Productos a entregar</Label>
            {fields.map((field, index) => {
              const productoIdActual = watch(`items.${index}.productoId`);
              const pigmentoIdActual = watch(`items.${index}.pigmentoId`);
              const cantidadActual = watch(`items.${index}.cantidad`);

              const itemInventario = (inventarioProducto ?? []).find(
                (i) => i.productoId === productoIdActual && i.pigmentoId === pigmentoIdActual
              );

              const excedeStock =
                itemInventario !== undefined &&
                !Number.isNaN(cantidadActual) &&
                cantidadActual > itemInventario.cantidadActual;
              return (
              <div key={field.id} className="flex gap-2 items-start border rounded-md p-3">
                <div className="flex-1 flex flex-col gap-2">
                  <ComboboxProductoColor
                    inventario={inventarioProducto ?? []}
                    value={{
                      productoId: watch(`items.${index}.productoId`) ?? "",
                      pigmentoId: watch(`items.${index}.pigmentoId`) ?? "",
                    }}
                    onSelect={(item) => {
                      setValue(`items.${index}.productoId`, item.productoId, { shouldValidate: true });
                      setValue(`items.${index}.pigmentoId`, item.pigmentoId, { shouldValidate: true });
                    }}
                  />

                  <Input
                    type="number"
                    placeholder="Cantidad"
                    {...register(`items.${index}.cantidad`, { valueAsNumber: true })}
                  />

                  {excedeStock && (
                    <p className="text-xs text-amber-600">
                      La cantidad excede el stock disponible ({itemInventario.cantidadActual} piezas).
                    </p>
                  )}

                  {errors.items?.[index] && (
                    <p className="text-xs text-red-500">Revisa este producto</p>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                )}
              </div>
              )
            })}

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