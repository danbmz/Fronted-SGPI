import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sustituirMaterialPigmentadoSchema, type SustituirMaterialPigmentadoInput } from "../../../ordenes/schemas";
import { useSustituirMaterialPigmentado } from "@/features/ordenes/hooks/useOrdenes";
import { useInventarioMaterialPigmentado } from "@/features/inventory/hook/useInventario";
import type { Orden } from "../../../ordenes/schemas";
import { useMemo } from "react";
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

export default function DialogSustituirMaterialPigmentado({ open, orden, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<SustituirMaterialPigmentadoInput>({
    resolver: zodResolver(sustituirMaterialPigmentadoSchema),
  });

  const sustituirMutation = useSustituirMaterialPigmentado();
  const { data: materialPigmentado } = useInventarioMaterialPigmentado();

  // Solo mostramos combinaciones que coincidan con la materia prima de esta orden
  const combinacionesDisponibles = useMemo(() => {
    if (!orden || !materialPigmentado) return [];
      return materialPigmentado.filter(
        (m) => m.materiaPrimaId === orden.materiaPrimaId && m.pigmentoId === orden.pigmentoId
      );
  }, [materialPigmentado, orden]);

  const onSubmit = async (data: SustituirMaterialPigmentadoInput) => {
    if (!orden) return;
    try {
      await sustituirMutation.mutateAsync({ id: orden.id, data });
      toast.success("Material pigmentado sustituido correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al sustituir el material.");
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
          <DialogTitle>Sustituir material pigmentado</DialogTitle>
          <DialogDescription>
            {orden ? `Orden: ${orden.folio} — Requiere ${orden.materiaPrimaVirgenKg.toFixed(2)} kg virgen` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Combinación disponible</Label>
            <Select
              value={watch("combinacionMaterialPigmentadoId") ?? ""}
              onValueChange={(val) =>
                setValue("combinacionMaterialPigmentadoId", val, { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {combinacionesDisponibles.map((c) => (
                  <SelectItem key={c.combinacionId} value={c.combinacionId}>
                    {c.materiaPrimaNombre} — {c.pigmentoColor} ({c.cantidadActual} kg disponibles)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {combinacionesDisponibles.length === 0 && (
              <p className="text-xs text-amber-600">No hay material pigmentado disponible para esta orden.</p>
            )}
            {errors.combinacionMaterialPigmentadoId && (
              <p className="text-xs text-red-500">{errors.combinacionMaterialPigmentadoId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Kilogramos a sustituir</Label>
            <Input
              type="number"
              step="0.001"
              {...register("kgSustituidos", { valueAsNumber: true })}
              placeholder="Ej. 10"
            />
            {orden && (
              <p className="text-xs text-muted-foreground">
                Máximo: {orden.materiaPrimaVirgenKg.toFixed(2)} kg (total virgen requerido)
              </p>
            )}
            {errors.kgSustituidos && <p className="text-xs text-red-500">{errors.kgSustituidos.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || sustituirMutation.isPending}>
              {isSubmitting || sustituirMutation.isPending ? "Sustituyendo..." : "Sustituir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}