import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarMaquinaSchema, type EditarMaquinaInput, type Maquina } from "../../schemas/maquina";
import { useEditarMaquina } from "../../hooks/useMaquina";
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
  maquina: Maquina | null;
  onClose: () => void;
}

export default function DialogEditarMaquina({ open, maquina, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarMaquinaInput>({
    resolver: zodResolver(editarMaquinaSchema),
  });

  const editarMutation = useEditarMaquina();

  useEffect(() => {
    if (maquina) {
      reset({
        nombre: maquina.nombre,
        capacidadTon: maquina.capacidadTon,
      });
    }
  }, [maquina]);

  const onSubmit = async (data: EditarMaquinaInput) => {
    if (!maquina) return;
    try {
      await editarMutation.mutateAsync({ id: maquina.id, data });
      toast.success("Máquina actualizada correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar la máquina.");
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
          <DialogTitle>Editar máquina</DialogTitle>
          <DialogDescription>
            Modifica los datos de la máquina seleccionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="TX 268T" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          {maquina && (
            <div className="flex flex-col gap-1">
              <Label>Código</Label>
              <Input value={maquina.codigo} disabled />
              <p className="text-xs text-muted-foreground">El código no se puede modificar.</p>
            </div>
          )}

          {maquina && (
            <div className="flex flex-col gap-1">
              <Label>Número de máquina</Label>
              <Input value={maquina.numero} disabled />
              <p className="text-xs text-muted-foreground">El número no se puede modificar.</p>
            </div>
          )}

          {maquina && (
            <div className="flex flex-col gap-1">
              <Label>Tipo de proceso</Label>
              <Input value={maquina.tipoProceso} disabled />
              <p className="text-xs text-muted-foreground">El tipo de proceso no se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Capacidad (Ton)</Label>
            <Input
              type="number"
              {...register("capacidadTon", { valueAsNumber: true })}
            />
            {errors.capacidadTon && <p className="text-xs text-red-500">{errors.capacidadTon.message}</p>}
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