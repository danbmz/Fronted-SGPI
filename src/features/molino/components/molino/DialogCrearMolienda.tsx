import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearMoliendaSchema, type AvancePendiente, type CrearMoliendaInput, type CrearMoliendaPayload, type IncidenciaPendiente } from "../../schemas";
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
import { Badge } from "@/components/ui/badge";
import SelectNativo from "@/components/ui/selectNativo";

interface Props {
  open: boolean;
  avanceTurnoIds: string[];
  incidenciaIds: string[];
  avancesSeleccionados: AvancePendiente[];
  incidenciasSeleccionadas: IncidenciaPendiente[];
  materialSugerido?: string;
  onClose: () => void;
}

export default function DialogCrearMolienda({ open, avanceTurnoIds, incidenciaIds, avancesSeleccionados, incidenciasSeleccionadas, materialSugerido, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearMoliendaInput>({
    resolver: zodResolver(crearMoliendaSchema),
  });

  const crearMutation = useCrearMolienda();
  const { data: coloresSolidos } = useColorSolido();
  const coloresSolidosActivos = (coloresSolidos ?? []).filter((c) => c.activo);

  useEffect(() => {
    if (open) {
      setValue("avanceTurnoIds", avanceTurnoIds);
      setValue("incidenciaIds", incidenciaIds);
      if (materialSugerido) {
        setValue("tipoMaterial", materialSugerido as (typeof TIPO_MATERIAL)[number]);
      }
    }
  }, [open, avanceTurnoIds, incidenciaIds, materialSugerido]);

  const onSubmit = async (data: CrearMoliendaInput) => {
    // materialSugerido es un valor externo al formulario, por ello validamos aqui y no en zod.
    if (materialSugerido && data.tipoMaterial !== materialSugerido) {
      toast.error("El material no coincide con lo seleccionado en la lista de pendientes.");
      return;
    }

    try {
      const payload: CrearMoliendaPayload = { 
        ...data, 
        fecha: new Date().toISOString().split("T")[0] 
      };
      await crearMutation.mutateAsync(payload);
      toast.success("Molienda registrada correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
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
          {(avancesSeleccionados.length > 0 || incidenciasSeleccionadas.length > 0) && (() => {
            const colores = Array.from(
              new Set([
                ...avancesSeleccionados.map((a) => a.pigmentoColor),
                ...incidenciasSeleccionadas.map((i) => i.pigmentoColor),
              ])
            );
            const hayVariosColores = colores.length > 1;

            return (
              <div className={`flex flex-col gap-1 px-3 py-2 rounded-md text-sm ${hayVariosColores ? "bg-amber-50" : "bg-muted"}`}>
                <p className="font-medium">
                  Colores incluidos en esta molienda{hayVariosColores ? " — revisa antes de continuar" : ""}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {colores.map((color) => (
                    <Badge key={color} variant={hayVariosColores ? "destructive" : "outline"}>{color}</Badge>
                  ))}
                </div>
              </div>
            );
          })()}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Material</Label>
            <SelectNativo
              value={watch("tipoMaterial") ?? ""}
              onValueChange={(val) => setValue("tipoMaterial", val as (typeof TIPO_MATERIAL)[number], { shouldValidate: true })}
              opciones={TIPO_MATERIAL.map((t) => ({ value: t, label: t }))}
              placeholder="Selecciona"
              disabled={!!materialSugerido}
            />
            {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color final</Label>
            <SelectNativo
              value={watch("colorSolidoId") ?? ""}
              onValueChange={(val) => setValue("colorSolidoId", val, { shouldValidate: true })}
              opciones={coloresSolidosActivos.map((c) => ({ value: c.id, label: c.nombre }))}
              placeholder="Selecciona"
            />
            {errors.colorSolidoId && <p className="text-xs text-red-500">{errors.colorSolidoId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Kilogramos resultantes</Label>
            <Input type="number" step="0.001" {...register("kgIngresados", { valueAsNumber: true })} placeholder="Ej. 12.5" />
            {errors.kgIngresados && <p className="text-xs text-red-500">{errors.kgIngresados.message}</p>}
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