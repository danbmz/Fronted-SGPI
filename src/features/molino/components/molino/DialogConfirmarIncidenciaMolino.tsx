import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirmarIncidenciaMolino } from "@/features/avancesTurno/hooks/useIncidencia";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmarIncidenciaMolinoSchema, type ConfirmarIncidenciaMolinoInput, type Incidencia } from "@/features/avancesTurno/schemas/incidencia";

interface Props {
  open: boolean;
  incidencia: Incidencia | null;
  onClose: () => void;
}

export default function DialogConfirmarIncidenciaMolino({ open, incidencia, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmarIncidenciaMolinoInput>({
    resolver: zodResolver(confirmarIncidenciaMolinoSchema),
    values: incidencia ? { piezasRecibidas: incidencia.piezasAfectadas } : undefined,
  });

  const confirmarMutation = useConfirmarIncidenciaMolino();

  const onSubmit = async (data: ConfirmarIncidenciaMolinoInput) => {
    if (!incidencia) return;
    try {
      await confirmarMutation.mutateAsync({ id: incidencia.id, data });
      toast.success("Recepción confirmada.");
      handleClose();
    } catch (error) {
      onClose();
      toast.error(error instanceof Error ? error.message : "Error al confirmar.");
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
          <DialogTitle>Confirmar recepción de material</DialogTitle>
          <DialogDescription>
            Piezas mal pigmentadas enviadas a molino desde un avance de turno.
          </DialogDescription>
        </DialogHeader>

        {incidencia && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Orden:</span> {incidencia.ordenFolio}</p>
            <p><span className="font-medium">Supervisor:</span> {incidencia.supervisorNombre}</p>
            <p><span className="font-medium">Piezas reportadas:</span> {incidencia.piezasAfectadas}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Piezas recibidas realmente</Label>
            <Input type="number" {...register("piezasRecibidas", { valueAsNumber: true })} />
            {errors.piezasRecibidas && <p className="text-xs text-red-500">{errors.piezasRecibidas.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || confirmarMutation.isPending}>
              {isSubmitting || confirmarMutation.isPending ? "Confirmando..." : "Confirmar recepción"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}