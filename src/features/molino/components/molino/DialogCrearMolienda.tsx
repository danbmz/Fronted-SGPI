import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearMoliendaSchema, type CrearMoliendaInput } from "../../schemas";
import { useCrearMolienda } from "../../hooks/useMolienda";
import { useColorSolido } from "@/features/catalogo/hooks/useColorSolido";
import { TIPO_MATERIAL } from "@/types/enums";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  open: boolean;
  avanceTurnoIds: string[];
  incidenciaIds: string[];
  onClose: () => void;
}

export default function DialogCrearMolienda({ open, avanceTurnoIds, incidenciaIds, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearMoliendaInput>({
    resolver: zodResolver(crearMoliendaSchema),
  });

  const crearMutation = useCrearMolienda();
  const { data: coloresSolidos } = useColorSolido();

  useEffect(() => {
    if (open) {
      setValue("avanceTurnoIds", avanceTurnoIds);
      setValue("incidenciaIds", incidenciaIds);
    }
  }, [open, avanceTurnoIds, incidenciaIds]);

  const onSubmit = async (data: CrearMoliendaInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success("Molienda registrada correctamente.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar la molienda.");
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
          <DialogTitle>Registrar molienda</DialogTitle>
          <DialogDescription>
            {avanceTurnoIds.length} avance(s) y {incidenciaIds.length} incidencia(s) seleccionados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Material</Label>
            <Select
              value={watch("tipoMaterial") ?? ""}
              onValueChange={(val) =>
                setValue("tipoMaterial", val as (typeof TIPO_MATERIAL)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {TIPO_MATERIAL.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color final</Label>
            <Select
              value={watch("colorSolidoId") ?? ""}
              onValueChange={(val) => setValue("colorSolidoId", val, { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {(coloresSolidos ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.colorSolidoId && <p className="text-xs text-red-500">{errors.colorSolidoId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Kilogramos resultantes</Label>
            <Input type="number" step="0.001" {...register("kgIngresados", { valueAsNumber: true })} placeholder="Ej. 12.5" />
            {errors.kgIngresados && <p className="text-xs text-red-500">{errors.kgIngresados.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Fecha</Label>
            <Input type="date" {...register("fecha")} />
            {errors.fecha && <p className="text-xs text-red-500">{errors.fecha.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Observaciones (opcional)</Label>
            <Textarea {...register("observaciones")} rows={2} />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Registrando..." : "Registrar molienda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}