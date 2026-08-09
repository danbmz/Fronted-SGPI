import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarPigmentoSchema, type EditarPigmentoInput, type Pigmento } from "../../schemas/pigmento";
import { useEditarPigmento } from "../../hooks/usePigmentos";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColorSolido } from "../../hooks/useColorSolido";

interface Props {
  open: boolean;
  pigmento: Pigmento | null;
  onClose: () => void;
}

export default function DialogEditarPigmento({ open, pigmento, onClose }: Props) {
  const { data: coloresSolidos } = useColorSolido();
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarPigmentoInput>({
    resolver: zodResolver(editarPigmentoSchema),
  });

  const editarMutation = useEditarPigmento();

  useEffect(() => {
    if (pigmento) {
      reset({
        color: pigmento.color,
        dosisGrPorKg: pigmento.dosisGrPorKg,
        costoUnitario: pigmento.costoUnitario ?? undefined,
        stockMinimo: pigmento.stockMinimo,
        colorSolidoId: pigmento.colorSolidoId ?? undefined, 
      });
    }
  }, [pigmento]);

  const onSubmit = async (data: EditarPigmentoInput) => {
    if (!pigmento) return;
    try {
      await editarMutation.mutateAsync({ id: pigmento.id, data });
      toast.success("Pigmento actualizado correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el pigmento.");
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
          <DialogTitle>Editar pigmento</DialogTitle>
          <DialogDescription>
            Modifica los datos del pigmento seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {pigmento && (
            <div className="flex flex-col gap-1">
              <Label>Material base</Label>
              <Input value={pigmento.tipoMaterial} disabled />
              <p className="text-xs text-muted-foreground">El material base no se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Color</Label>
            <Input {...register("color")} placeholder="Ej. Amarillo" />
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pigmento && (
              <div className="flex flex-col gap-1">
                <Label>Categoría</Label>
                <Input value={pigmento.categoriaColor} disabled />
                <p className="text-xs text-muted-foreground">No se puede modificar.</p>
              </div>
            )}

            {pigmento && (
              <div className="flex flex-col gap-1">
                <Label>Tipo</Label>
                <Input value={pigmento.tipo} disabled />
                <p className="text-xs text-muted-foreground">No se puede modificar.</p>
              </div>
            )}
          </div>

          {pigmento?.categoriaColor === "SOLIDO" && (
            <div className="flex flex-col gap-1">
              <Label>Color sólido (para uso con molido)</Label>
              <Select
                value={watch("colorSolidoId") ?? ""}
                onValueChange={(val) => setValue("colorSolidoId", val, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {(coloresSolidos ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.colorSolidoId && <p className="text-xs text-red-500">{errors.colorSolidoId.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Dosis (gr/kg)</Label>
              <Input
                type="number"
                step="0.001"
                {...register("dosisGrPorKg", { valueAsNumber: true })}
              />
              {errors.dosisGrPorKg && <p className="text-xs text-red-500">{errors.dosisGrPorKg.message}</p>}
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
          </div>

          <div className="flex flex-col gap-1">
            <Label>Costo unitario</Label>
            <Input
              type="number"
              step="0.01"
              {...register("costoUnitario", { valueAsNumber: true })}
            />
            {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
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