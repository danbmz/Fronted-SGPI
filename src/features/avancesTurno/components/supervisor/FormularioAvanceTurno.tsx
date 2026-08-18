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
import SelectNativo from "@/components/ui/selectNativo";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

  const { role } = useAuth();
  const esSoloLectura = role === "ADMIN"; // el supervisor conserva control total

  const actualizarMutation = useActualizarAvanceTurno();
  const cerrarMutation = useCerrarAvanceTurno();

  const { data: operadores } = useOperador();
  const { data: defectos } = useDefectosProducto();

  const operadoresActivos = operadores?.filter((o) => o.activo);
  const defectosActivos = defectos?.filter((d) => d.activo);

  useEffect(() => {
    if (!operadores || !defectos) return;

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
  }, [avance, operadores, defectos]);

  const esCerrado = avance.estado === "CERRADO";
  const kgSobrante = watch("kgSobrante");

  // ---------- Guardar borrador: valida solo con el schema laxo, sin exigir campos obligatorios ----------
  const handleGuardarBorrador = async () => {
    const datosActuales = watch();

    // Limpia campos numéricos vacíos/NaN antes de intentar validar
    const datosLimpios = Object.fromEntries(
      Object.entries(datosActuales).filter(([, valor]) => {
        if (typeof valor === "number" && Number.isNaN(valor)) return false;
        if (valor === "") return false;
        return true;
      })
    );

    const parseo = actualizarAvanceTurnoSchema.safeParse(datosLimpios);

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
      await cerrarMutation.mutateAsync({ id: avance.id, data: data });
      toast.success("Turno cerrado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cerrar el turno.");
    }
  };

  // Seteamos horaFin antes de enviar el form ya que no viene incluido aqui pero si en el schema de validacion.
  const handleCerrarClick = () => {
    setValue("horaFin", new Date().toISOString(), { shouldValidate: true });
    handleSubmit(onCerrar)();
  };

  return (
    <form className="flex flex-col gap-4 border rounded-md p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Piezas buenas</Label>
          <Input type="number" disabled={esCerrado || esSoloLectura} {...register("piezasBuenas", { valueAsNumber: true })} />
          {errors.piezasBuenas && <p className="text-xs text-red-500">{errors.piezasBuenas.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Piezas defectuosas</Label>
          <Input type="number" disabled={esCerrado || esSoloLectura} {...register("piezasDefectuosas", { valueAsNumber: true })} />
          {errors.piezasDefectuosas && <p className="text-xs text-red-500">{errors.piezasDefectuosas.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Kg merma</Label>
          <Input type="number" step="0.001" disabled={esCerrado || esSoloLectura} {...register("kgMerma", { valueAsNumber: true })} />
          {errors.kgMerma && <p className="text-xs text-red-500">{errors.kgMerma.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Kg plasta</Label>
          <Input type="number" step="0.001" disabled={esCerrado || esSoloLectura} {...register("kgPlasta", { valueAsNumber: true })} />
          {errors.kgPlasta && <p className="text-xs text-red-500">{errors.kgPlasta.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Piezas cambio de color</Label>
        <Input type="number" disabled={esCerrado || esSoloLectura} {...register("piezasCambioColor", { valueAsNumber: true })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Kg sobrante (si aplica)</Label>
          <Input type="number" step="0.001" disabled={esCerrado || esSoloLectura} {...register("kgSobrante", { valueAsNumber: true })} />
        </div>
        {kgSobrante !== undefined && kgSobrante > 0 && (
          <div className="flex flex-col gap-1">
            <Label>Tipo de material sobrante</Label>
            <SelectNativo
              value={watch("tipoMaterialSobrante") ?? ""}
              disabled={esCerrado || esSoloLectura}
              onValueChange={(val) =>
                setValue("tipoMaterialSobrante", val as (typeof TIPO_MATERIAL_SOLICITUD)[number], { shouldValidate: true })
              }
              opciones={TIPO_MATERIAL_SOLICITUD.map((t) => ({ value: t, label: t }))}
              placeholder="Selecciona"
            />
            {errors.tipoMaterialSobrante && (
              <p className="text-xs text-red-500">{errors.tipoMaterialSobrante.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label>Operador</Label>
        <SelectNativo
          value={watch("operadorId") ?? ""}
          disabled={esCerrado || esSoloLectura}
          onValueChange={(val) => setValue("operadorId", val, { shouldValidate: true })}
          opciones={(operadoresActivos ?? []).map((o) => ({value: o.id, label: o.nombre}))}
          placeholder="Selecciona un operador"
        />
        {errors.operadorId && <p className="text-xs text-red-500">{errors.operadorId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label>Ciclo real (seg)</Label>
          <Input type="number" disabled={esCerrado || esSoloLectura} {...register("cicloReal", { valueAsNumber: true })} />
          {errors.cicloReal && <p className="text-xs text-red-500">{errors.cicloReal.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Material usado (kg)</Label>
          <Input type="number" step="0.001" disabled={esCerrado || esSoloLectura} {...register("materialKG", { valueAsNumber: true })} />
          {errors.materialKG && <p className="text-xs text-red-500">{errors.materialKG.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label>Defecto (si aplica)</Label>
        <SelectNativo
          value={watch("defectoId") ?? ""}
          disabled={esCerrado || esSoloLectura}
          onValueChange={(val) => setValue("defectoId", val, { shouldValidate: true })}
          opciones={(defectosActivos ?? []).map((d) => ({value: d.id, label: d.nombre }))}
          placeholder="Selecciona un defecto"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Observaciones</Label>
        <Textarea disabled={esCerrado || esSoloLectura} {...register("observaciones")} rows={2} />
      </div>

      {!esCerrado && (
        <div className="flex justify-end gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGuardarBorrador}
            disabled={actualizarMutation.isPending || !isDirty || esSoloLectura}
          >
            {actualizarMutation.isPending ? "Guardando..." : "Guardar borrador"}
          </Button>
          <Button type="button" onClick={handleCerrarClick} disabled={cerrarMutation.isPending || esSoloLectura}>
            {cerrarMutation.isPending ? "Cerrando..." : "Cerrar turno"}
          </Button>
        </div>
      )}
    </form>
  );
}