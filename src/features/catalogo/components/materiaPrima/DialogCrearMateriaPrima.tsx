import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { crearMateriaPrimaSchema, type CrearMateriaPrimaInput } from "../../schemas/materiaPrima";
import { useCrearMateriaPrima } from "../../hooks/useMateriasPrimas";
import { TIPO_MATERIAL, UNIDAD_MEDIDA } from "@/types/enums";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DialogCrearMateriaPrima({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearMateriaPrimaInput>({
    resolver: zodResolver(crearMateriaPrimaSchema),
  });

  const crearMutation = useCrearMateriaPrima();

  const onSubmit = async (data: CrearMateriaPrimaInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success("Materia prima creada correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al crear la materia prima.");
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
          <DialogTitle>Nueva materia prima</DialogTitle>
          <DialogDescription>
            Registra una nueva materia prima en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <Input {...register("nombre")} placeholder="Ej. Polipropileno Virgen" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Código interno</Label>
            <Input {...register("codigoInterno")} placeholder="Ej. JU-PVL1" />
            {errors.codigoInterno && <p className="text-xs text-red-500">{errors.codigoInterno.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo</Label>
            <Select
              value={watch("tipo") ?? ""}
              onValueChange={(val) => setValue("tipo", val as (typeof TIPO_MATERIAL)[number], { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {TIPO_MATERIAL.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Proveedor</Label>
            <Input {...register("proveedor")} placeholder="Ej. Braskem" />
            {errors.proveedor && <p className="text-xs text-red-500">{errors.proveedor.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Unidad de medida</Label>
              <Select
                value={watch("unidadMedida") ?? ""}
                onValueChange={(val) => setValue("unidadMedida", val as (typeof UNIDAD_MEDIDA)[number], { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDAD_MEDIDA.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unidadMedida && <p className="text-xs text-red-500">{errors.unidadMedida.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Costo unitario</Label>
              <Input
                type="number"
                step="0.01"
                {...register("costoUnitario", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.costoUnitario && <p className="text-xs text-red-500">{errors.costoUnitario.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Stock mínimo</Label>
            <Input
              type="number"
              step="0.001"
              {...register("stockMinimo", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.stockMinimo && <p className="text-xs text-red-500">{errors.stockMinimo.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear materia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}