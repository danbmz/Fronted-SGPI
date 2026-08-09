import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarProductoSchema, type EditarProductoInput, type Producto } from "../../schemas/productos";
import { useEditarProducto } from "../../hooks/useProducto";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  producto: Producto | null;
  onClose: () => void;
}

export default function DialogEditarProducto({ open, producto, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarProductoInput>({
    resolver: zodResolver(editarProductoSchema),
  });

  const editarMutation = useEditarProducto();

  useEffect(() => {
    if (producto) {
      reset({
        nombre: producto.nombre,
        tipo: producto.tipo,
        cavidades: producto.cavidades,
        ciclo: producto.ciclo,
        peso: producto.peso,
        piezasPorEmpaque: producto.piezasPorEmpaque,
        precio: producto.precio,
        descripcion: producto.descripcion,
      });
    }
  }, [producto]);

  const onSubmit = async (data: EditarProductoInput) => {
    if (!producto) return;
    try {
      await editarMutation.mutateAsync({ id: producto.id, data });
      toast.success("Producto actualizado correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el producto.");
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
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>
            Modifica los datos del producto seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {producto && (
            <div className="flex flex-col gap-1">
              <Label>Código de producto</Label>
              <Input value={producto.codigo} disabled />
              <p className="text-xs text-muted-foreground">El código no se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Jarra 3L" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Descripción</Label>
            <Input {...register("descripcion")} placeholder="Ej. Jarra de plástico con tapa" />
            {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
                <Label>Tipo</Label>
                <Input {...register("tipo")} placeholder="Ej. Jarra" />
                {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
            </div>

            {producto && (
              <div className="flex flex-col gap-1">
                <Label>Material</Label>
                <Input value={producto.tipoMaterial} disabled />
                <p className="text-xs text-muted-foreground">No se puede modificar.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Cavidades</Label>
              <Input
                type="number"
                {...register("cavidades", { valueAsNumber: true })}
              />
              {errors.cavidades && <p className="text-xs text-red-500">{errors.cavidades.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Ciclo estándar (seg)</Label>
              <Input
                type="number"
                {...register("ciclo", { valueAsNumber: true })}
              />
              {errors.ciclo && <p className="text-xs text-red-500">{errors.ciclo.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Peso unitario (gr)</Label>
              <Input
                type="number"
                step="0.01"
                {...register("peso", { valueAsNumber: true })}
              />
              {errors.peso && <p className="text-xs text-red-500">{errors.peso.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Piezas por empaque</Label>
              <Input
                type="number"
                {...register("piezasPorEmpaque", { valueAsNumber: true })}
              />
              {errors.piezasPorEmpaque && <p className="text-xs text-red-500">{errors.piezasPorEmpaque.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Precio</Label>
            <Input
              type="number"
              step="0.01"
              {...register("precio", { valueAsNumber: true })}
            />
            {errors.precio && <p className="text-xs text-red-500">{errors.precio.message}</p>}
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