import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { crearOperadorSchema ,type CrearOperadorInput } from "../../schemas/operadores"
import { useCrearOperador } from "../../hooks/useOperador"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props{
    open: boolean
    onClose: () => void
}

export default function DialogCrearOperador({open, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CrearOperadorInput>({
  resolver: zodResolver(crearOperadorSchema)
  })

  const crearMutation = useCrearOperador();

  const onSubmit = async (data: CrearOperadorInput) => {
      try {
          await crearMutation.mutateAsync(data);
          toast.success("Operador creado exitosamente.");
          reset();
          onClose();
      } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error al crear nuevo operador.")
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
          <DialogTitle>Crear nuevo operador</DialogTitle>
          <DialogDescription>
            Registra un nuevo operador en el catálogo.
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
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear operador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}