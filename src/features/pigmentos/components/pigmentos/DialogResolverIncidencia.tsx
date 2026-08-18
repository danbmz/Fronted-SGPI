import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resolverIncidenciaSchema, type Incidencia, type ResolverIncidenciaInput } from "../../../avancesTurno/schemas/incidencia";
import { useResolverIncidencia } from "@/features/avancesTurno/hooks/useIncidencia";
import { TIPO_MATERIAL_SOLICITUD } from "@/types/enums";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectNativo from "@/components/ui/selectNativo";

interface Props {
  open: boolean;
  incidencia: Incidencia | null;
  onClose: () => void;
}

export default function DialogResolverIncidencia({ open, incidencia, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<ResolverIncidenciaInput>({
    resolver: zodResolver(resolverIncidenciaSchema), // forma que recibe el form
    defaultValues: {
      kgMaterialAgregado: 0,
      gramosPigmentoAgregado: 0,
    },
  });

  const resolverMutation = useResolverIncidencia();

  const onSubmit = async (data: ResolverIncidenciaInput) => {
    if (!incidencia) return;
    try {
      const payload = {
        tipoMaterialAgregado: data.tipoMaterialAgregado,
        kgMaterialAgregado: data.kgMaterialAgregado > 0 ? data.kgMaterialAgregado : undefined,
        gramosPigmentoAgregado: data.gramosPigmentoAgregado > 0 ? data.gramosPigmentoAgregado : undefined,
      }; // El form los hace obligatorios (number()) pero los transformamos a undefined si viene 0, y usamos un nuevo Type en useResolverIncidencia()
      await resolverMutation.mutateAsync({ id: incidencia.id, data: payload });
      toast.success("Incidencia resuelta.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al resolver la incidencia.");
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
          <DialogTitle>Resolver incidencia</DialogTitle>
          <DialogDescription>
            Indica qué material se agregó para corregir el pigmentado.
          </DialogDescription>
        </DialogHeader>

        {incidencia && (
          <div className="text-sm bg-muted px-3 py-2 rounded-md">
            <p><span className="font-medium">Orden:</span> {incidencia.ordenFolio}</p>
            <p><span className="font-medium">Materia prima:</span> {incidencia.materiaPrimaNombre}</p>
            <p><span className="font-medium">Pigmento:</span> {incidencia.pigmentoColor}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Tipo de material agregado (opcional)</Label>
            <SelectNativo
              value={watch("tipoMaterialAgregado") ?? ""}
              onValueChange={(val) =>
                setValue("tipoMaterialAgregado", val as (typeof TIPO_MATERIAL_SOLICITUD)[number], { shouldValidate: true })
              }
              opciones={TIPO_MATERIAL_SOLICITUD.map((t) => ({ value: t, label: t }))}
              placeholder="Ninguno"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Kg de material agregado (opcional)</Label>
            <Input type="number" step="0.001" {...register("kgMaterialAgregado", {valueAsNumber: true})} />
            {errors.kgMaterialAgregado && <p className="text-xs text-red-500">{errors.kgMaterialAgregado.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Gramos de pigmento agregado (opcional)</Label>
            <Input type="number" step="0.001" {...register("gramosPigmentoAgregado", {valueAsNumber: true})} />
            {errors.gramosPigmentoAgregado && <p className="text-xs text-red-500">{errors.gramosPigmentoAgregado.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || resolverMutation.isPending}>
              {isSubmitting || resolverMutation.isPending ? "Resolviendo..." : "Resolver"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}