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

// Determina el turno según la hora actual — ajusta los cortes según tu operación real
function inferirTurno(): (typeof TURNO_TRABAJO)[number] {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 14) return "MANANA";
  if (hora >= 14 && hora < 22) return "TARDE";
  return "NOCHE";
}

export default function DialogAbrirAvance({ open, orden, onClose }: Props) {
  const {
    handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearAvanceTurnoInput>({
    resolver: zodResolver(crearAvanceTurnoSchema),
  });

  const crearMutation = useCrearAvanceTurno();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && orden) {
      const ahora = new Date();
      setValue("ordenId", orden.id);
      setValue("turno", inferirTurno());
      setValue("fecha", ahora.toISOString().split("T")[0]);
      setValue("horaInicio", ahora.toISOString());
    }
  }, [open, orden]);

  const onSubmit = async (data: CrearAvanceTurnoInput) => {
    try {
      const nuevoAvance = await crearMutation.mutateAsync(data);
      toast.success("Avance de turno iniciado.");
      handleClose();
      navigate(`../avances/${nuevoAvance.id}`);
    } catch (error) {
      handleClose();
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TURNO_TRABAJO.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.turno && <p className="text-xs text-red-500">{errors.turno.message}</p>}
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