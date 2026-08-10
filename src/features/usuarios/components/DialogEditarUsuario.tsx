import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarUsuarioSchema, type EditarUsuarioInput } from "../../usuarios/schemas/usuario.validation";
import type { Usuario } from "../../usuarios/schemas/usuario.schema";
import { useEditarUsuario } from "../../usuarios/hook/useUsuario";
import { ROL_USUARIO } from "@/types/enums";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
}

export default function DialogEditarUsuario({ open, usuario, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<EditarUsuarioInput>({
    resolver: zodResolver(editarUsuarioSchema),
  });

  const editarMutation = useEditarUsuario();

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        role: usuario.role,
      });
    }
  }, [usuario]);

  const onSubmit = async (data: EditarUsuarioInput) => {
    if (!usuario) return;
    try {
      await editarMutation.mutateAsync({ id: usuario.id, data });
      toast.success("Usuario actualizado correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el usuario.");
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
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {usuario && (
            <div className="flex flex-col gap-1">
              <Label>Usuario (login)</Label>
              <Input value={usuario.usuario} disabled />
              <p className="text-xs text-muted-foreground">El usuario de acceso no se puede modificar.</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label>Nombre completo</Label>
            <Input {...register("nombre")} placeholder="Juan Pérez" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select
              value={watch("role") ?? ""}
              onValueChange={(val) =>
                setValue("role", val as (typeof ROL_USUARIO)[number], { shouldValidate: true, shouldDirty: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROL_USUARIO.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
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