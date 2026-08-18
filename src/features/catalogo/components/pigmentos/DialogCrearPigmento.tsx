import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { crearPigmentoSchema, type CrearPigmentoInput } from "../../schemas/pigmento";
import { useCrearPigmento } from "../../hooks/usePigmentos";
import { TIPO_MATERIAL, TIPO_PIGMENTO, CATEGORIA_COLOR } from "@/types/enums";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useColorSolido } from "../../hooks/useColorSolido";
import SelectNativo from "@/components/ui/selectNativo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DialogCrearPigmento({ open, onClose }: Props) {
  const { data: coloresSolidos } = useColorSolido();
  const coloresSolidosActivos = coloresSolidos?.filter((c) => c.activo);

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearPigmentoInput>({
    resolver: zodResolver(crearPigmentoSchema)
  })

  const crearMutation = useCrearPigmento();

  const onSubmit = async (data: CrearPigmentoInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success("Pigmento creado correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al crear el pigmento.");
    }
  };

  console.log(errors);
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo pigmento</DialogTitle>
          <DialogDescription>
            Registra un nuevo pigmento en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Material base</Label>
            <SelectNativo
              value={watch("tipoMaterial") ?? ""}
              onValueChange={(val) => {
                setValue("tipoMaterial", val as (typeof TIPO_MATERIAL)[number], {shouldValidate: true})
              }}
              opciones={TIPO_MATERIAL.map((t) => ({ value: t, label: t}))}
              placeholder="Selecciona un material"
            />
            {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Color</Label>
            <Input {...register("color")} placeholder="Ej. Amarillo" />
            {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Categoría</Label>
              <SelectNativo
                value={watch("categoriaColor") ?? ""}
                onValueChange={(val) => {
                  setValue("categoriaColor", val as (typeof CATEGORIA_COLOR)[number], { shouldValidate: true });
                  if (val !== "SOLIDO") {
                    setValue("colorSolidoId", undefined);
                  }
                }}
                opciones={CATEGORIA_COLOR.map((c) => ({ value: c, label: c }))}
                placeholder="Selecciona"
              />
              {errors.categoriaColor && <p className="text-xs text-red-500">{errors.categoriaColor.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <Label>Tipo</Label>
              <SelectNativo
                value={watch("tipo") ?? ""}
                onValueChange={(val) => {
                  setValue("tipo", val as (typeof TIPO_PIGMENTO)[number], { shouldValidate: true})
                }}
                opciones={TIPO_PIGMENTO.map((t) => ({ value: t, label: t}))}
                placeholder="Selecciona"
              />
              {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
            </div>
          </div>

          {watch("categoriaColor") === "SOLIDO" && (
            <div className="flex flex-col gap-1">
              <Label>Color sólido (para uso con molido)</Label>
              <SelectNativo
                value={watch("colorSolidoId") ?? ""}
                onValueChange={(val) => setValue("colorSolidoId", val, { shouldValidate: true })}
                opciones={(coloresSolidosActivos ?? []).map((c) => ({ value: c.id, label: c.nombre }))}
                placeholder="Selecciona (opcional)"
              />
              {errors.colorSolidoId && <p className="text-xs text-red-500">{errors.colorSolidoId.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Dosis (gr/kg)</Label>
              <Input
                type="number"
                step="0.001"
                {...register("dosisGrPorKg", { valueAsNumber: true })}
                placeholder="Ej. 21"
              />
              {errors.dosisGrPorKg && <p className="text-xs text-red-500">{errors.dosisGrPorKg.message}</p>}
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
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando" : "Crear pigmento"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}