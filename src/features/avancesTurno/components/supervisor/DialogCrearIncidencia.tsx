import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearIncidenciaSchema, type CrearIncidenciaInput } from "../../schemas/incidencia";
import { useCrearIncidencia } from "../../hooks/useIncidencia";
import { DESTINO_PIEZAS } from "@/types/enums";
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

export default function DialogCrearIncidencia({ open, avanceTurnoId, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearIncidenciaInput>({
    resolver: zodResolver(crearIncidenciaSchema),
  });

  const crearMutation = useCrearIncidencia();

  const onSubmit = async (data: CrearIncidenciaInput) => {
    try {
      await crearMutation.mutateAsync({ avanceTurnoId, data });
      toast.success("Incidencia reportada.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al reportar la incidencia.");
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
          <DialogTitle>Reportar material mal pigmentado</DialogTitle>
          <DialogDescription>
            Indica cuántas piezas se vieron afectadas y a dónde deben ir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Piezas afectadas</Label>
            <Input type="number" {...register("piezasAfectadas", { valueAsNumber: true })} placeholder="Ej. 40" />
            {errors.piezasAfectadas && <p className="text-xs text-red-500">{errors.piezasAfectadas.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Destino</Label>
            <Select
              value={watch("destino") ?? ""}
              onValueChange={(val) =>
                setValue("destino", val as (typeof DESTINO_PIEZAS)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="STOCK">Stock (entran directo a inventario)</SelectItem>
                <SelectItem value="MOLINO">Molino (se van a moler)</SelectItem>
              </SelectContent>
            </Select>
            {errors.destino && <p className="text-xs text-red-500">{errors.destino.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Reportando..." : "Reportar incidencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}