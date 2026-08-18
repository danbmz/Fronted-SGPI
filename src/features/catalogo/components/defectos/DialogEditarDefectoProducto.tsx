import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarDefectoProductoSchema, type EditarDefectoProductoInput, type DefectoProducto } from "../../schemas/defectos";
import { useEditarDefectoProducto } from "../../hooks/useDefectosProducto";
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
  defecto: DefectoProducto | null;
  onClose: () => void;
}

export default function DialogEditarDefectoProducto({ open, defecto, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarDefectoProductoInput>({
    resolver: zodResolver(editarDefectoProductoSchema),
  });

  const editarMutation = useEditarDefectoProducto();

  useEffect(() => {
    if (defecto) {
      reset({ nombre: defecto.nombre });
    }
  }, [defecto]);

  const onSubmit = async (data: EditarDefectoProductoInput) => {
    if (!defecto) return;
    try {
      await editarMutation.mutateAsync({ id: defecto.id, data });
      toast.success("Defecto actualizado correctamente.");
      handleClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar el defecto.");
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
          <DialogTitle>Editar defecto de producto</DialogTitle>
          <DialogDescription>
            Modifica el nombre del defecto seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Rebaba" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
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