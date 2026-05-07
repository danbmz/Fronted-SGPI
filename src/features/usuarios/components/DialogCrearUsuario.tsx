import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { crearUsuario } from "../usuariosServices"
import type { Role } from "@/types/usuario"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface Props {
  open: boolean
  onClose: () => void
}

interface FormValues {
  nombre: string
  usuario: string
  password: string
  role: Role
}

export default function DialogCrearUsuario({ open, onClose }: Props) {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>()
  const { user } = useAuth()


  if (!user) return // Validamos que exista un sesion activa

  const onSubmit = async (data: FormValues) => {
    console.log("Nuevo usuario:", data)
    await crearUsuario(data, user); // Llamada a la API y a su vez registra el log
    reset()
    onClose()
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
          </div>

          <div className="flex flex-col gap-1">
            <Label>Usuario</Label>
            <Input {...register("usuario")} placeholder="admin01" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Contraseña</Label>
            <Input {...register("password")} type="password" placeholder="••••••••" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Rol</Label>
            <Select onValueChange={(val) => setValue("role", val as Role)}>
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
            <Button type="submit">Crear usuario</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}