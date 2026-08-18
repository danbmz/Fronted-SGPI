import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarColorSolidoSchema, type EditarColorSolidoInput, type ColorSolido } from "../../schemas/colorSolido";
import { useEditarColorSolido } from "../../hooks/useColorSolido";
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
  colorSolido: ColorSolido | null;
  onClose: () => void;
}

export function DialogEditarColorSolido({ open, colorSolido, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarColorSolidoInput>({
    resolver: zodResolver(editarColorSolidoSchema),
  });

  const editarMutation = useEditarColorSolido();

  useEffect(() => {
    if (colorSolido) {
      reset({ nombre: colorSolido.nombre });
    }
  }, [colorSolido]);

  const onSubmit = async (data: EditarColorSolidoInput) => {
    if (!colorSolido) return;
    try {
      await editarMutation.mutateAsync({ id: colorSolido.id, data });
      toast.success("Color sólido actualizado correctamente.");
      onClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar el color sólido.");
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
          <DialogTitle>Editar color sólido</DialogTitle>
          <DialogDescription>
            Modifica el nombre del color seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Rojo" />
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