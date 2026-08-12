import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmarMolinoSchema, type ConfirmarMolinoInput } from "@/features/avancesTurno/schemas/avanceTurno";
import { useConfirmarMolino } from "@/features/avancesTurno/hooks/useAvanceTurno";
import type { AvanceTurno } from "@/features/avancesTurno/schemas/avanceTurno";
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
  avance: AvanceTurno | null;
  onClose: () => void;
}

export default function DialogConfirmarMolino({ open, avance, onClose }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmarMolinoInput>({
    resolver: zodResolver(confirmarMolinoSchema),
  });

  const confirmarMutation = useConfirmarMolino();

  // Precargamos con lo reportado por el supervisor — el encargado solo ajusta si hay diferencia
  useEffect(() => {
    if (avance) {
      reset({
        kgMermaRecibida: avance.kgMerma,
        kgPlastaRecibida: avance.kgPlasta,
        piezasMalasRecibidas: avance.piezasDefectuosas,
        piezasCambioColorRecibidas: avance.piezasCambioColor,
      });
    }
  }, [avance]);

  const onSubmit = async (data: ConfirmarMolinoInput) => {
    if (!avance) return;
    try {
      await confirmarMutation.mutateAsync({ id: avance.id, data });
      toast.success("Recepción confirmada.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al confirmar la recepción.");
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
          <DialogTitle>Confirmar recepción — {avance?.ordenFolio}</DialogTitle>
          <DialogDescription>
            Reportado por {avance?.supervisorNombre}. Ajusta si lo recibido es diferente.
          </DialogDescription>
        </DialogHeader>

        {avance && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md grid grid-cols-2 gap-2">
            <p><span className="font-medium">Merma reportada:</span> {avance.kgMerma} kg</p>
            <p><span className="font-medium">Plasta reportada:</span> {avance.kgPlasta} kg</p>
            <p><span className="font-medium">Piezas malas:</span> {avance.piezasDefectuosas}</p>
            <p><span className="font-medium">Cambio color:</span> {avance.piezasCambioColor}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Kg merma recibida</Label>
              <Input type="number" step="0.001" {...register("kgMermaRecibida", { valueAsNumber: true })} />
              {errors.kgMermaRecibida && <p className="text-xs text-red-500">{errors.kgMermaRecibida.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Kg plasta recibida</Label>
              <Input type="number" step="0.001" {...register("kgPlastaRecibida", { valueAsNumber: true })} />
              {errors.kgPlastaRecibida && <p className="text-xs text-red-500">{errors.kgPlastaRecibida.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Piezas malas recibidas</Label>
              <Input type="number" {...register("piezasMalasRecibidas", { valueAsNumber: true })} />
              {errors.piezasMalasRecibidas && <p className="text-xs text-red-500">{errors.piezasMalasRecibidas.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Piezas cambio color recibidas</Label>
              <Input type="number" {...register("piezasCambioColorRecibidas", { valueAsNumber: true })} />
              {errors.piezasCambioColorRecibidas && <p className="text-xs text-red-500">{errors.piezasCambioColorRecibidas.message}</p>}
            </div>
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