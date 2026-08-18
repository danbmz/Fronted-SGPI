import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarMotivoParoSchema, type EditarMotivoParoInput, type MotivoParo } from "../../schemas/motivosParo";
import { useEditarMotivoParo } from "../../hooks/useMotivosParo";
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
  motivo: MotivoParo | null;
  onClose: () => void;
}

export default function DialogEditarMotivoParo({ open, motivo, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMotivoParoInput>({
    resolver: zodResolver(editarMotivoParoSchema),
  });

  const editarMutation = useEditarMotivoParo();

  useEffect(() => {
    if (motivo) {
      reset({ nombre: motivo.nombre });
    }
  }, [motivo]);

  const onSubmit = async (data: EditarMotivoParoInput) => {
    if (!motivo) return;
    try {
      await editarMutation.mutateAsync({ id: motivo.id, data });
      toast.success("Motivo de paro actualizado correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar el motivo de paro.");
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
          <DialogTitle>Editar motivo de paro</DialogTitle>
          <DialogDescription>
            Modifica el nombre del motivo de paro seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Falla de máquina" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          {motivo && (
            <div className="flex flex-col gap-1">
              <Label>Categoría</Label>
              <Input value={motivo.categoria} disabled />
              <p className="text-xs text-muted-foreground">La categoría no se puede modificar.</p>
            </div>
          )}

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