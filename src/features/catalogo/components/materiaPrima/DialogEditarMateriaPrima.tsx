import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarMateriaPrimaSchema, type EditarMateriaPrimaInput, type MateriaPrima } from "../../schemas/materiaPrima";
import { useEditarMateriaPrima } from "../../hooks/useMateriasPrimas";
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
  materiaPrima: MateriaPrima | null;
  onClose: () => void;
}

export default function DialogEditarMateriaPrima({ open, materiaPrima, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMateriaPrimaInput>({
    resolver: zodResolver(editarMateriaPrimaSchema),
  });

  const editarMutation = useEditarMateriaPrima();

  useEffect(() => {
    if (materiaPrima) {
      reset({
        nombre: materiaPrima.nombre,
        proveedor: materiaPrima.proveedor ?? undefined,
        costoUnitario: materiaPrima.costoUnitario ?? undefined,
        stockMinimo: materiaPrima.stockMinimo,
      });
    }
  }, [materiaPrima]);

  const onSubmit = async (data: EditarMateriaPrimaInput) => {
    if (!materiaPrima) return;
    try {
      await editarMutation.mutateAsync({ id: materiaPrima.id, data });
      toast.success("Materia prima actualizada correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar la materia prima.");
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
          <DialogTitle>Editar materia prima</DialogTitle>
          <DialogDescription>
            Modifica los datos de la materia prima seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Polipropileno Virgen" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          {materiaPrima && (
            <div className="flex flex-col gap-1">
              <Label>Código interno</Label>
              <Input value={materiaPrima.codigoInterno} disabled />
              <p className="text-xs text-muted-foreground">El código interno no se puede modificar.</p>
            </div>
          )}

          {materiaPrima && (
            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <Input value={materiaPrima.tipo} disabled />
              <p className="text-xs text-muted-foreground">El tipo no se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Proveedor</Label>
            <Input {...register("proveedor")} placeholder="Ej. Braskem" />
            {errors.proveedor && <p className="text-xs text-red-500">{errors.proveedor.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {materiaPrima && (
              <div className="flex flex-col gap-1">
                <Label>Unidad de medida</Label>
                <Input value={materiaPrima.unidadMedida} disabled />
                <p className="text-xs text-muted-foreground">La unidad de medida no se puede modificar.</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Label>Costo unitario</Label>
              <Input
                type="number"
                step="0.01"
                {...register("costoUnitario", { valueAsNumber: true })}
              />
              {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Stock mínimo</Label>
            <Input
              type="number"
              step="0.001"
              {...register("stockMinimo", { valueAsNumber: true })}
            />
            {errors.stockMinimo && <p className="text-xs text-red-500">{errors.stockMinimo.message}</p>}
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