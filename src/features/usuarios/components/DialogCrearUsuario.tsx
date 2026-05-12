import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearUsuarioSchema, type CrearUsuarioForm } from "@/validations/usuarioValidations"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { crearUsuario } from "../usuariosServices"
import { useAuth } from "@/features/auth/hooks/useAuth"
import type { Role, User } from "@/types/usuario"
import { toast } from "sonner"


interface Props {
  open: boolean
  onClose: () => void
  onSucces: (Usuario: User) => void
}

export default function DialogCrearUsuario({ open, onClose, onSucces }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CrearUsuarioForm>({
    resolver: zodResolver(crearUsuarioSchema)
  })
  const { user } = useAuth()

  if (!user) return // Validamos que exista un sesion activa

  const onSubmit = async (data: CrearUsuarioForm) => {
    try {
        const nuevoUsuario = await crearUsuario(data, user); // Llamada a la API y a su vez registra el log
        toast.success("Usuario creado exitosamente.")
        onSucces(nuevoUsuario);
        reset()
        onClose()
    } catch (error) {
        toast.error("Error al crear usuario.")
    }
  }

  const handleClose = () => {
    reset() // limpia el form al cerrar
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
          <DialogDescription>
            Rellena los campos para crear un nuevo usuario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre completo</Label>
            <Input {...register("nombre")} placeholder="Juan Pérez" />
            {errors.nombre && (
              <p className="text-xs text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Usuario</Label>
            <Input {...register("usuario")} placeholder="admin01" />
              {errors.usuario && (
                <p className="text-xs text-red-500">{errors.usuario.message}</p>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Contraseña</Label>
            <Input {...register("password")} type="password" placeholder="••••••••" />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select
              value={watch("role") ?? ""} 
              onValueChange={(val) => setValue("role", val as Role, {shouldValidate: true})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear usuario</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}