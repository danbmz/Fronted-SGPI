import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearSolicitudMaterialSchema, type CrearSolicitudMaterialInput } from "../../schemas/solicitudMaterial";
import { useCrearSolicitudMaterial } from "../../hooks/useSolicitudMaterial";
import { TIPO_MATERIAL_SOLICITUD } from "@/types/enums";
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

export default function DialogCrearSolicitudMaterial({ open, avanceTurnoId, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearSolicitudMaterialInput>({
    resolver: zodResolver(crearSolicitudMaterialSchema),
  });

  const crearMutation = useCrearSolicitudMaterial();

  const onSubmit = async (data: CrearSolicitudMaterialInput) => {
    try {
      await crearMutation.mutateAsync({ avanceTurnoId, data });
      toast.success("Solicitud de material enviada.");
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar la solicitud.");
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
          <DialogTitle>Solicitar material</DialogTitle>
          <DialogDescription>
            Solicita material adicional para continuar la producción.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Tipo de material</Label>
            <Select
              value={watch("tipoMaterial") ?? ""}
              onValueChange={(val) =>
                setValue("tipoMaterial", val as (typeof TIPO_MATERIAL_SOLICITUD)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {TIPO_MATERIAL_SOLICITUD.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Kilogramos solicitados</Label>
            <Input type="number" step="0.001" {...register("kgSolicitados", { valueAsNumber: true })} placeholder="Ej. 25" />
            {errors.kgSolicitados && <p className="text-xs text-red-500">{errors.kgSolicitados.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo (opcional)</Label>
            <Input {...register("motivo")} placeholder="Ej. Merma mayor a la esperada" />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}