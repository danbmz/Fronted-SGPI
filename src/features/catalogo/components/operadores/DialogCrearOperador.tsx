import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type CrearOperadorForm, crearOperadorSchema } from "@/validations/operadorValidations"
import { crearOperador } from "../../services/operadorService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import type { Operador } from "@/types/operadoresCatalogo"


interface Props{
    open: boolean
    onClose: () => void
    onSuccess: (operador: Operador) => void
}

export default function DialogCrearOperador({open, onClose, onSuccess}: Props) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CrearOperadorForm>({
    resolver: zodResolver(crearOperadorSchema)
    })
    const { user } = useAuth()

    const onSubmit = async (data: CrearOperadorForm) => {
      if(!user || !data) return
        try {
            const nuevoOperador = await crearOperador(data, user)
            toast.success("Operador creado exitosamente.")
            onSuccess(nuevoOperador)
            reset()
            onClose()
        } catch (error) {
            toast.error("Error al intentar crear Operador.")
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
                    <Label>Número de empleado</Label>
                    <Input {...register("numeroEmpleado")} placeholder="295-R" />
                      {errors.numeroEmpleado && (
                        <p className="text-xs text-red-500">{errors.numeroEmpleado.message}</p>
                      )}
                  </div>
        
                  <div className="flex flex-col gap-1">
                    <Label>Área</Label>
                    <Input {...register("area")} placeholder="Soplado" />
                    {errors.area && (
                      <p className="text-xs text-red-500">{errors.area.message}</p>
                    )}
                  </div>
        
                  <div className="flex flex-col gap-1">
                    <Label>Turno</Label>
                    <Select
                      value={watch("turnoHabitual") ?? ""} 
                      onValueChange={(val) => setValue("turnoHabitual", val as "Mañana" | "Tarde" | "Noche", {shouldValidate: true})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un turno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mañana">Mañana</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noche">Noche</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.turnoHabitual && (
                      <p className="text-xs text-red-500">{errors.turnoHabitual.message}</p>
                    )}
                  </div>
        
                  <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creando" : "Crear operador"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
    )
}