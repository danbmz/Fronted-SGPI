import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearUsuarioSchema, type CrearUsuarioInput } from "@/features/usuarios/schemas/usuario.validation";
import { useCrearUsuario } from "../../usuarios/hook/useUsuario";
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
  onClose: () => void;
}

export default function DialogCrearUsuario({ open, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearUsuarioInput>({
    resolver: zodResolver(crearUsuarioSchema),
  });

  const crearMutation = useCrearUsuario();

  const onSubmit = async (data: CrearUsuarioInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success("Usuario creado correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al crear el usuario.");
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
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Registra un nuevo usuario del sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre completo</Label>
            <Input {...register("nombre")} placeholder="Juan Pérez" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Usuario (login)</Label>
            <Input {...register("usuario")} placeholder="jperez01" />
            {errors.usuario && <p className="text-xs text-red-500">{errors.usuario.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Contraseña</Label>
            <Input {...register("password")} type="password" placeholder="Mínimo 8 caracteres" />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select
              value={watch("role") ?? ""}
              onValueChange={(val) =>
                setValue("role", val as (typeof ROL_USUARIO)[number], { shouldValidate: true })
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
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}