import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarOperadorSchema, type EditarOperadorInput, type Operador } from "../../schemas/operadores";
import { useEditarOperador } from "../../hooks/useOperador";
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
  operador: Operador | null;
  onClose: () => void;
}

export default function DialogEditarOperador({ open, operador, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarOperadorInput>({
    resolver: zodResolver(editarOperadorSchema),
  });

  const editarMutation = useEditarOperador();

  useEffect(() => {
    if (operador) {
      reset({ nombre: operador.nombre });
    }
  }, [operador]);

  const onSubmit = async (data: EditarOperadorInput) => {
    if (!operador) return;
    try {
      await editarMutation.mutateAsync({ id: operador.id, data });
      toast.success("Operador actualizado correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al actualizar el operador.");
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
          <DialogTitle>Editar operador</DialogTitle>
          <DialogDescription>
            Actualiza la información del operador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre completo</Label>
            <Input {...register("nombre")} placeholder="Juan Pérez" />
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