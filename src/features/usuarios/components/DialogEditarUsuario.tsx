// DialogEditarUsuario.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editarUsuarioSchema, type EditarUsuarioForm } from "@/validations/usuarioValidations"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Role, User } from "@/types/usuario"
import { editarUsuario } from "../usuariosServices"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"

interface Props {
  open: boolean
  usuario: User | null
  onClose: () => void
  onSuccess: (usuario: User) => void
}

export default function DialogEditarUsuario({ open, usuario, onClose, onSuccess }: Props) {
  const { register, handleSubmit, reset, setValue, formState: {errors, isSubmitting, isDirty} } = useForm<EditarUsuarioForm>({
    resolver: zodResolver(editarUsuarioSchema)
  })
  const { user } = useAuth()

  // Rellena el form cuando se abre con los datos del usuario seleccionado
  useEffect(() => {
    if (usuario) {
      reset({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      role: usuario.role,
      password: "", // Baseline explícito para que isDirty lo considere
    });
    }
  }, [usuario])

  
const onSubmit = async (data: EditarUsuarioForm) => {
  if (!user || !usuario) return

  try {
    const usuarioEditado = await editarUsuario(
      String(usuario.id), // ← el id del usuario a editar
      data, // Los neuvos datos
      usuario, // El objeto del usuario a editar
      user // El objeto del usuario que esta editando
    )
    toast.success("Usuario editado.")
    onSuccess(usuarioEditado) // ← igual que en crear, para actualizar la tabla
    reset()
    onClose()
  } catch {
    toast.error("No se pudo editar el usuario.")
  }
}

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Actualiza la información del usuario
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
            <Label>Nueva contraseña</Label>
            <Input {...register("password")} type="password" placeholder="Dejar vacío para no cambiar"/>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Solo llena este campo si deseas cambiar la contraseña.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select
              value={usuario?.role ?? ""}
              onValueChange={(val) => setValue("role", val as Role, {shouldValidate: true, shouldDirty: true})}
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
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Guardando" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}