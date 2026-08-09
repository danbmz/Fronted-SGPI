import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearDefectoProductoSchema, type CrearDefectoProductoInput } from "../../schemas/defectos";
import { useCrearDefectoProducto } from "../../hooks/useDefectosProducto";
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
  onClose: () => void;
}

export default function DialogCrearDefectoProducto({ open, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<CrearDefectoProductoInput>({
    resolver: zodResolver(crearDefectoProductoSchema),
  });

  const crearMutation = useCrearDefectoProducto();

  const onSubmit = async (data: CrearDefectoProductoInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success("Defecto creado correctamente.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el defecto.");
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
          <DialogTitle>Nuevo defecto de producto</DialogTitle>
          <DialogDescription>
            Registra un nuevo tipo de defecto en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Rebaba" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear defecto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}