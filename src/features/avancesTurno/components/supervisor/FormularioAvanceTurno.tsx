import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  actualizarAvanceTurnoSchema,
  cerrarAvanceTurnoSchema,
  type CerrarAvanceTurnoInput,
} from "../../schemas/avanceTurno";
import { useActualizarAvanceTurno, useCerrarAvanceTurno } from "../../hooks/useAvanceTurno";
import { useOperador } from "@/features/catalogo/hooks/useOperador";
import { useDefectosProducto } from "@/features/catalogo/hooks/useDefectosProducto";
import { TIPO_MATERIAL_SOLICITUD } from "@/types/enums";
import type { AvanceTurno } from "../../schemas/avanceTurno";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

interface Props {
  avance: AvanceTurno;
}

export default function FormularioAvanceTurno({ avance }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isDirty }
  } = useForm<CerrarAvanceTurnoInput>({
    // Usamos el schema estricto para tener acceso a todos los campos y sus mensajes,
    // pero el botón de "guardar borrador" no lo valida con este resolver — ver más abajo.
    resolver: zodResolver(cerrarAvanceTurnoSchema),
  });

  const actualizarMutation = useActualizarAvanceTurno();
  const cerrarMutation = useCerrarAvanceTurno();

  const { data: operadores } = useOperador();
  const { data: defectos } = useDefectosProducto();

  useEffect(() => {
    reset({
      piezasBuenas: avance.piezasBuenas,
      piezasDefectuosas: avance.piezasDefectuosas,
      kgMerma: avance.kgMerma,
      kgPlasta: avance.kgPlasta,
      piezasCambioColor: avance.piezasCambioColor,
      kgSobrante: avance.kgSobrante ?? undefined,
      tipoMaterialSobrante: avance.tipoMaterialSobrante ?? undefined,
      defectoId: avance.defectoId ?? undefined,
      operadorId: avance.operadorId,
      cicloReal: avance.cicloReal ?? undefined,
      materialKG: avance.materialKG ?? undefined,
      observaciones: avance.observaciones ?? undefined,
    } as CerrarAvanceTurnoInput);
  }, [avance]);

  const esCerrado = avance.estado === "CERRADO";
  const kgSobrante = watch("kgSobrante");

  // ---------- Guardar borrador: valida solo con el schema laxo, sin exigir campos obligatorios ----------
  const handleGuardarBorrador = async () => {
    const datosActuales = watch();
    const parseo = actualizarAvanceTurnoSchema.safeParse(datosActuales);

    if (!parseo.success) {
      toast.error("Revisa los datos capturados, hay algún valor inválido.");
      return;
    }

    try {
      await actualizarMutation.mutateAsync({ id: avance.id, data: parseo.data });
      toast.success("Borrador guardado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar el borrador.");
    }
  };

  // ---------- Cerrar turno: usa el submit normal de react-hook-form, con el schema estricto ----------
  const onCerrar = async (data: CerrarAvanceTurnoInput) => {
    try {
      const payload = { ...data, horaFin: new Date().toISOString() };
      await cerrarMutation.mutateAsync({ id: avance.id, data: payload });
      toast.success("Turno cerrado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cerrar el turno.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onCerrar)} className="flex flex-col gap-4 border rounded-md p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Piezas buenas</Label>
          <Input type="number" disabled={esCerrado} {...register("piezasBuenas", { valueAsNumber: true })} />
          {errors.piezasBuenas && <p className="text-xs text-red-500">{errors.piezasBuenas.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Piezas defectuosas</Label>
          <Input type="number" disabled={esCerrado} {...register("piezasDefectuosas", { valueAsNumber: true })} />
          {errors.piezasDefectuosas && <p className="text-xs text-red-500">{errors.piezasDefectuosas.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Kg merma</Label>
          <Input type="number" step="0.001" disabled={esCerrado} {...register("kgMerma", { valueAsNumber: true })} />
          {errors.kgMerma && <p className="text-xs text-red-500">{errors.kgMerma.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Kg plasta</Label>
          <Input type="number" step="0.001" disabled={esCerrado} {...register("kgPlasta", { valueAsNumber: true })} />
          {errors.kgPlasta && <p className="text-xs text-red-500">{errors.kgPlasta.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Piezas cambio de color</Label>
        <Input type="number" disabled={esCerrado} {...register("piezasCambioColor", { valueAsNumber: true })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Kg sobrante (si aplica)</Label>
          <Input type="number" step="0.001" disabled={esCerrado} {...register("kgSobrante", { valueAsNumber: true })} />
        </div>
        {kgSobrante !== undefined && kgSobrante > 0 && (
          <div className="flex flex-col gap-1">
            <Label>Tipo de material sobrante</Label>
            <Select
              value={watch("tipoMaterialSobrante") ?? ""}
              disabled={esCerrado}
              onValueChange={(val) =>
                setValue("tipoMaterialSobrante", val as (typeof TIPO_MATERIAL_SOLICITUD)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {TIPO_MATERIAL_SOLICITUD.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoMaterialSobrante && (
              <p className="text-xs text-red-500">{errors.tipoMaterialSobrante.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Operador</Label>
        <Select
          value={watch("operadorId") ?? ""}
          disabled={esCerrado}
          onValueChange={(val) => setValue("operadorId", val, { shouldValidate: true })}
        >
          <SelectTrigger><SelectValue placeholder="Selecciona un operador" /></SelectTrigger>
          <SelectContent>
            {(operadores ?? []).map((o) => (
              <SelectItem key={o.id} value={o.id}>{o.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.operadorId && <p className="text-xs text-red-500">{errors.operadorId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Ciclo real (seg)</Label>
          <Input type="number" disabled={esCerrado} {...register("cicloReal", { valueAsNumber: true })} />
          {errors.cicloReal && <p className="text-xs text-red-500">{errors.cicloReal.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Material usado (kg)</Label>
          <Input type="number" step="0.001" disabled={esCerrado} {...register("materialKG", { valueAsNumber: true })} />
          {errors.materialKG && <p className="text-xs text-red-500">{errors.materialKG.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Defecto (si aplica)</Label>
        <Select
          value={watch("defectoId") ?? ""}
          disabled={esCerrado}
          onValueChange={(val) => setValue("defectoId", val, { shouldValidate: true })}
        >
          <SelectTrigger><SelectValue placeholder="Sin defecto" /></SelectTrigger>
          <SelectContent>
            {(defectos ?? []).map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Observaciones</Label>
        <Textarea disabled={esCerrado} {...register("observaciones")} rows={2} />
      </div>

      {!esCerrado && (
        <div className="flex justify-end gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGuardarBorrador}
            disabled={actualizarMutation.isPending}
          >
            {actualizarMutation.isPending ? "Guardando..." : "Guardar borrador"}
          </Button>
          <Button type="submit" disabled={cerrarMutation.isPending}>
            {cerrarMutation.isPending ? "Cerrando..." : "Cerrar turno"}
          </Button>
        </div>
      )}
    </form>
  );
}