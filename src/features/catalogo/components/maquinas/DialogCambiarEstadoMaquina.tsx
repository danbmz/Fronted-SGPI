import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cambiarEstadoMaquinaSchema, type CambiarEstadoMaquinaInput, type Maquina } from "../../schemas/maquina";
import { useCambiarEstadoMaquina } from "../../hooks/useMaquina";
import { ESTADO_MAQUINA } from "@/types/enums";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  maquina: Maquina | null;
  onClose: () => void;
}

const estadoColors: Record<string, string> = {
  ACTIVA: "text-green-600",
  MANTENIMIENTO: "text-yellow-600",
  INACTIVA: "text-red-600",
};

export default function DialogCambiarEstadoMaquina({ open, maquina, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<CambiarEstadoMaquinaInput>({
    resolver: zodResolver(cambiarEstadoMaquinaSchema),
  });

  const cambiarEstadoMutation = useCambiarEstadoMaquina();

  useEffect(() => {
    if (maquina) {
      reset({ estado: maquina.estado, motivo: "" });
    }
  }, [maquina]);

  const onSubmit = async (data: CambiarEstadoMaquinaInput) => {
    if (!maquina) return;
    try {
      await cambiarEstadoMutation.mutateAsync({ id: maquina.id, data });
      toast.success("Estado actualizado correctamente.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar el estado.");
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
          <DialogTitle>Cambiar estado</DialogTitle>
          <DialogDescription>
            Actualiza el estado operativo de la máquina.
          </DialogDescription>
        </DialogHeader>

        {maquina && (
          <div className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md">
            <span className="font-medium">{maquina.nombre}</span>
            <span className="text-muted-foreground">—</span>
            <span className={`font-medium ${estadoColors[maquina.estado]}`}>
              {maquina.estado}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nuevo estado</Label>
            <Select
              value={watch("estado") ?? ""}
              onValueChange={(val) =>
                setValue("estado", val as (typeof ESTADO_MAQUINA)[number], { shouldValidate: true, shouldDirty: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADO_MAQUINA.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.estado && <p className="text-xs text-red-500">{errors.estado.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo del cambio</Label>
            <Textarea
              {...register("motivo")}
              placeholder="Describe el motivo del cambio de estado..."
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !isDirty || cambiarEstadoMutation.isPending}>
              {isSubmitting || cambiarEstadoMutation.isPending ? "Guardando..." : "Guardar cambio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}