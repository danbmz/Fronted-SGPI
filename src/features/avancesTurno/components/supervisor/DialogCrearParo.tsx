import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearTiempoParoSchema, type CrearTiempoParoInput } from "../../schemas/tiempoParo";
import { useCrearTiempoParo } from "../../hooks/useTiempoParo";
import { useMotivosParo } from "@/features/catalogo/hooks/useMotivosParo";
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
  avanceTurnoId: string;
  onClose: () => void;
}

export default function DialogCrearTiempoParo({ open, avanceTurnoId, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearTiempoParoInput>({
    resolver: zodResolver(crearTiempoParoSchema),
  });

  const crearMutation = useCrearTiempoParo();
  const { data: motivosParo } = useMotivosParo();

  const motivoSeleccionado = motivosParo?.find((m) => m.id === watch("motivoParoId"));
  const esOtro = motivoSeleccionado?.nombre === "Otro";

  const onSubmit = async (data: CrearTiempoParoInput) => {
    try {
      await crearMutation.mutateAsync({ avanceTurnoId, data });
      toast.success("Tiempo de paro registrado.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar el tiempo de paro.");
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
          <DialogTitle>Registrar tiempo de paro</DialogTitle>
          <DialogDescription>
            Indica el motivo y la duración del paro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Motivo</Label>
            <Select
              value={watch("motivoParoId") ?? ""}
              onValueChange={(val) => setValue("motivoParoId", val, { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue placeholder="Selecciona un motivo" /></SelectTrigger>
              <SelectContent>
                {(motivosParo ?? []).map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.motivoParoId && <p className="text-xs text-red-500">{errors.motivoParoId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Minutos</Label>
            <Input type="number" {...register("minutos", { valueAsNumber: true })} placeholder="Ej. 15" />
            {errors.minutos && <p className="text-xs text-red-500">{errors.minutos.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>{esOtro ? "Describe el motivo" : "Observaciones (opcional)"}</Label>
            <Input
              {...register("observaciones")}
              placeholder={esOtro ? "Especifica el motivo real del paro..." : "Notas adicionales..."}
            />
            {errors.observaciones && <p className="text-xs text-red-500">{errors.observaciones.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Registrando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}