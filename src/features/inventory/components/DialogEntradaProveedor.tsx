import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entradaProveedorSchema, type EntradaProveedorInput } from "../../inventory/schemas";
import { useEntradaProveedor } from "../../inventory/hook/useInventario";
import { useMateriasPrimas } from "@/features/catalogo/hooks/useMateriasPrimas";
import { usePigmento } from "../../catalogo/hooks/usePigmentos"
import { useColorSolido } from "../../catalogo/hooks/useColorSolido";
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
  tipoInventario: "MATERIA_PRIMA" | "PIGMENTO" | "MOLIDO";
  onClose: () => void;
}

const labelPorTipo: Record<Props["tipoInventario"], string> = {
  MATERIA_PRIMA: "Materia prima",
  PIGMENTO: "Pigmento",
  MOLIDO: "Molido comprado",
};

export default function DialogEntradaProveedor({ open, tipoInventario, onClose }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<EntradaProveedorInput>({
    resolver: zodResolver(entradaProveedorSchema),
    defaultValues: { tipoInventario },
  });

  const entradaMutation = useEntradaProveedor();

  const { data: materiasPrimas } = useMateriasPrimas();
  const { data: pigmentos } = usePigmento();
  const { data: coloresSolidos } = useColorSolido();

  const onSubmit = async (data: EntradaProveedorInput) => {
    try {
      await entradaMutation.mutateAsync(data);
      toast.success("Entrada registrada correctamente.");
      reset();
      setValue("tipoInventario", tipoInventario); // Asi conservamos el valor del inventario que llama al Dialog.
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar la entrada.");
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
          <DialogTitle>Entrada de proveedor — {labelPorTipo[tipoInventario]}</DialogTitle>
          <DialogDescription>
            Registra la llegada de material desde el proveedor.
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
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

          {tipoInventario === "MOLIDO" && (
            <>
              <div className="flex flex-col gap-1">
                <Label>Material</Label>
                <Select
                  value={watch("materiaPrimaId") ?? ""}
                  onValueChange={(val) => setValue("materiaPrimaId", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
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
                <Label>Color</Label>
                <Select
                  value={watch("colorSolidoId") ?? ""}
                  onValueChange={(val) => setValue("colorSolidoId", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
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

          <div className="flex flex-col gap-1">
            <Label>Cantidad</Label>
            <Input
              type="number"
              step="0.001"
              {...register("cantidad", { valueAsNumber: true })}
              placeholder="0.000"
            />
            {"cantidad" in errors && errors.cantidad && (
              <p className="text-xs text-red-500">{errors.cantidad.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Descripción (opcional)</Label>
            <Input {...register("descripcion")} placeholder="Ej. Entrada de proveedor Braskem" />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || entradaMutation.isPending}>
              {isSubmitting || entradaMutation.isPending ? "Registrando..." : "Registrar entrada"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}