import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ajusteManualSchema, type AjusteManualInput } from "../../inventory/schemas";
import { useAjusteManual } from "../hook/useInventario";
import { useMateriasPrimas } from "@/features/catalogo/hooks/useMateriasPrimas";
import { usePigmento } from "@/features/catalogo/hooks/usePigmentos";
import { useColorSolido } from "@/features/catalogo/hooks/useColorSolido";
import { useProducto } from "@/features/catalogo/hooks/useProducto";
import { ORIGEN_MOLIDO, TIPO_MATERIAL_CON_MOLIDO, type MaterialConMolido } from "@/types/enums";
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

type TipoInventarioAjuste = "MATERIA_PRIMA" | "PIGMENTO" | "PRODUCTO" | "MOLIDO" | "MATERIAL_PIGMENTADO";

interface Props {
  open: boolean;
  tipoInventario: TipoInventarioAjuste;
  onClose: () => void;
}

const labelPorTipo: Record<TipoInventarioAjuste, string> = {
  MATERIA_PRIMA: "Materia prima",
  PIGMENTO: "Pigmento",
  PRODUCTO: "Producto terminado",
  MOLIDO: "Molido",
  MATERIAL_PIGMENTADO: "Material pigmentado",
};

export default function DialogAjusteManual({ open, tipoInventario, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<AjusteManualInput>({
    resolver: zodResolver(ajusteManualSchema),
  });

  const ajusteMutation = useAjusteManual();

  const { data: materiasPrimas } = useMateriasPrimas();
  const { data: pigmentos } = usePigmento();
  const { data: coloresSolidos } = useColorSolido();
  const { data: productos } = useProducto();

  useEffect(() => {
    setValue("tipoInventario", tipoInventario);
  }, [tipoInventario]);

  const onSubmit = async (data: AjusteManualInput) => {
    try {
      await ajusteMutation.mutateAsync(data);
      toast.success("Ajuste registrado correctamente.");
      handleClose();
    } catch (error) {
      handleClose();
      toast.error(error instanceof Error ? error.message : "Error al registrar el ajuste.");
    }
  };

  const handleClose = () => {
    reset();
    setValue("tipoInventario", tipoInventario);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuste manual — {labelPorTipo[tipoInventario]}</DialogTitle>
          <DialogDescription>
            Corrige el stock registrado, indicando la diferencia y el motivo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {tipoInventario === "MATERIA_PRIMA" && (
            <div className="flex flex-col gap-1">
              <Label>Materia prima</Label>
              <Select
                value={watch("materiaPrimaId") ?? ""}
                onValueChange={(val) => setValue("materiaPrimaId", val, { shouldValidate: true })}
              >
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  {(materiasPrimas ?? []).map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {"materiaPrimaId" in errors && errors.materiaPrimaId && (
                <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>
              )}
            </div>
          )}

          {tipoInventario === "PIGMENTO" && (
            <div className="flex flex-col gap-1">
              <Label>Pigmento</Label>
              <Select
                value={watch("pigmentoId") ?? ""}
                onValueChange={(val) => setValue("pigmentoId", val, { shouldValidate: true })}
              >
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  {(pigmentos ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.color} — {p.tipoMaterial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {"pigmentoId" in errors && errors.pigmentoId && (
                <p className="text-xs text-red-500">{errors.pigmentoId.message}</p>
              )}
            </div>
          )}

          {tipoInventario === "PRODUCTO" && (
            <>
              <div className="flex flex-col gap-1">
                <Label>Producto</Label>
                <Select
                  value={watch("productoId") ?? ""}
                  onValueChange={(val) => setValue("productoId", val, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {(productos ?? []).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"productoId" in errors && errors.productoId && (
                  <p className="text-xs text-red-500">{errors.productoId.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Color</Label>
                <Select
                  value={watch("pigmentoId") ?? ""}
                  onValueChange={(val) => setValue("pigmentoId", val, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {(pigmentos ?? []).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"pigmentoId" in errors && errors.pigmentoId && (
                  <p className="text-xs text-red-500">{errors.pigmentoId.message}</p>
                )}
              </div>
            </>
          )}

          {tipoInventario === "MOLIDO" && (
            <>
              <div className="flex flex-col gap-1">
                <Label>Material</Label>
                <Select
                  value={watch("tipoMaterial") ?? ""}
                  onValueChange={(val) => setValue("tipoMaterial", val as MaterialConMolido, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {(TIPO_MATERIAL_CON_MOLIDO ?? []).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"materiaPrimaId" in errors && errors.materiaPrimaId && (
                  <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Origen</Label>
                <Select
                  value={watch("origen") ?? ""}
                  onValueChange={(val) =>
                    setValue("origen", val as (typeof ORIGEN_MOLIDO)[number], { shouldValidate: true })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {ORIGEN_MOLIDO.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"origen" in errors && errors.origen && (
                  <p className="text-xs text-red-500">{errors.origen.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Color</Label>
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
                {"colorSolidoId" in errors && errors.colorSolidoId && (
                  <p className="text-xs text-red-500">{errors.colorSolidoId.message}</p>
                )}
              </div>
            </>
          )}

          {tipoInventario === "MATERIAL_PIGMENTADO" && (
            <>
              <div className="flex flex-col gap-1">
                <Label>Materia prima</Label>
                <Select
                  value={watch("materiaPrimaId") ?? ""}
                  onValueChange={(val) => setValue("materiaPrimaId", val, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {(materiasPrimas ?? []).map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"materiaPrimaId" in errors && errors.materiaPrimaId && (
                  <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Pigmento</Label>
                <Select
                  value={watch("pigmentoId") ?? ""}
                  onValueChange={(val) => setValue("pigmentoId", val, { shouldValidate: true })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {(pigmentos ?? []).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {"pigmentoId" in errors && errors.pigmentoId && (
                  <p className="text-xs text-red-500">{errors.pigmentoId.message}</p>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <Label>Diferencia (puede ser negativa)</Label>
            <Input
              type="number"
              step="0.001"
              {...register("diferencia", { valueAsNumber: true })}
              placeholder="Ej. -5.5 o 10"
            />
            {"diferencia" in errors && errors.diferencia && (
              <p className="text-xs text-red-500">{errors.diferencia.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Motivo del ajuste</Label>
            <Textarea
              {...register("descripcion")}
              placeholder="Describe por qué se realiza este ajuste..."
              rows={3}
            />
            {"descripcion" in errors && errors.descripcion && (
              <p className="text-xs text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || ajusteMutation.isPending}>
              {isSubmitting || ajusteMutation.isPending ? "Registrando..." : "Registrar ajuste"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}