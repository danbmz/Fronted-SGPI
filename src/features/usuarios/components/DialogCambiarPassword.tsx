import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cambiarPasswordFormSchema, type CambiarPasswordFormInput } from "../../usuarios/schemas/usuario.validation";
import type { Usuario } from "../../usuarios/schemas/usuario.schema";
import { useCambiarPasswordUsuario } from "../../usuarios/hook/useUsuario";
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
  usuario: Usuario | null;
  onClose: () => void;
}

export default function DialogCambiarPassword({ open, usuario, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CambiarPasswordFormInput>({
    resolver: zodResolver(cambiarPasswordFormSchema),
  });

  const cambiarPasswordMutation = useCambiarPasswordUsuario();

  const onSubmit = async (data: CambiarPasswordFormInput) => {
    if (!usuario) return;
    try {
      // Solo mandamos "password" al backend — "confirmarPassword" nunca sale de aquí
      await cambiarPasswordMutation.mutateAsync({
        id: usuario.id,
        data: { password: data.password },
      });
      toast.success("Contraseña actualizada correctamente.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar la contraseña.");
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
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para {usuario?.nombre ?? "este usuario"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nueva contraseña</Label>
            <Input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Confirmar contraseña</Label>
            <Input
              {...register("confirmarPassword")}
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
            />
            {errors.confirmarPassword && (
              <p className="text-xs text-red-500">{errors.confirmarPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || cambiarPasswordMutation.isPending}>
              {isSubmitting || cambiarPasswordMutation.isPending ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}