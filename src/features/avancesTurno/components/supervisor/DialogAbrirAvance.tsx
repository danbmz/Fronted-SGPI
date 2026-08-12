import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearAvanceTurnoSchema, type CrearAvanceTurnoInput } from "../../schemas/avanceTurno";
import { useCrearAvanceTurno } from "../../hooks/useAvanceTurno";
import { TURNO_TRABAJO } from "@/types/enums";
import type { Orden } from "@/features/ordenes/schemas/orden.schema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  orden: Orden | null;
  onClose: () => void;
}

export default function DialogAbrirAvance({ open, orden, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearAvanceTurnoInput>({
    resolver: zodResolver(crearAvanceTurnoSchema),
  });

  const crearMutation = useCrearAvanceTurno();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && orden) {
      setValue("ordenId", orden.id);
    }
  }, [open, orden]);

  const onSubmit = async (data: CrearAvanceTurnoInput) => {
    try {
      const payload = {
        ...data,
        horaInicio: new Date(data.horaInicio).toISOString(), // Ajustamos valor al formato esperado por el back
      };
      const nuevoAvance = await crearMutation.mutateAsync(payload);
      toast.success("Avance de turno iniciado.");
      reset();
      onClose();
      navigate(`/supervisor/avances/${nuevoAvance.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar el avance.");
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
          <DialogTitle>Iniciar avance de turno</DialogTitle>
          <DialogDescription>
            {orden ? `Orden: ${orden.folio} — ${orden.productoNombre}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Turno</Label>
            <Select
              value={watch("turno") ?? ""}
              onValueChange={(val) =>
                setValue("turno", val as (typeof TURNO_TRABAJO)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un turno" />
              </SelectTrigger>
              <SelectContent>
                {TURNO_TRABAJO.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.turno && <p className="text-xs text-red-500">{errors.turno.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Fecha</Label>
            <Input type="date" {...register("fecha")} />
            {errors.fecha && <p className="text-xs text-red-500">{errors.fecha.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Hora de inicio</Label>
            <Input type="datetime-local" {...register("horaInicio")} />
            {errors.horaInicio && <p className="text-xs text-red-500">{errors.horaInicio.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Iniciando..." : "Iniciar avance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}