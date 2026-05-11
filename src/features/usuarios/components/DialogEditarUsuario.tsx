// DialogEditarUsuario.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types/usuario"
import type { FormValues } from "@/types/userForm"
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
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()
  const { user } = useAuth()

  // Rellena el form cuando se abre con los datos del usuario seleccionado
  useEffect(() => {
    if (usuario) {
      setValue("nombre", usuario.nombre)
      setValue("usuario", usuario.usuario)
      setValue("role", usuario.role)
      // password lo dejamos vacío, solo se actualiza si el admin escribe algo nuevo
    }
  }, [usuario, setValue])

  
const onSubmit = async (data: FormValues) => {
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
          </div>

          <div className="flex flex-col gap-1">
            <Label>Usuario</Label>
            <Input {...register("usuario")} placeholder="admin01" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Nueva contraseña</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Dejar vacío para no cambiar"
            />
            <p className="text-xs text-muted-foreground">
              Solo llena este campo si deseas cambiar la contraseña.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select
              value={usuario?.role ?? ""}
              onValueChange={(val) => setValue("role", val as "admin" | "supervisor")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}