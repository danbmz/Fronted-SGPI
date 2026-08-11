import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearOrdenSchema, type CrearOrdenInput } from "../schemas";
import { useCrearOrden } from "../hooks/useOrdenes";
import { useMateriasPrimas } from "@/features/catalogo/hooks/useMateriasPrimas";
import { usePigmento } from "@/features/catalogo/hooks/usePigmentos";
import { useMaquina } from "@/features/catalogo/hooks/useMaquina";
import { useInventarioMolido } from "@/features/inventory/hook/useInventario";
import { TIPO_MATERIAL_ORDEN } from "@/types/enums";
import type { PedidoDetalle } from "../../pedidos/schemas/pedido.schema";
import { useNavigate } from "react-router-dom";
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
  onClose: () => void;
  pedidoDetalle: PedidoDetalle; // la línea desde la que se crea — ya trae productoId fijo
}

export default function DialogCrearOrden({ open, onClose, pedidoDetalle }: Props) {
  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting }
  } = useForm<CrearOrdenInput>({
    resolver: zodResolver(crearOrdenSchema),
  });

  const crearMutation = useCrearOrden();
  const navigate = useNavigate();

  const { data: materiasPrimas } = useMateriasPrimas();
  const { data: pigmentos } = usePigmento();
  const { data: maquinas } = useMaquina();
  const { data: inventarioMolido } = useInventarioMolido();

  const tipoMaterial = watch("tipoMaterial");
  const materiaPrimaIdSeleccionada = watch("materiaPrimaId");

  // El producto de la orden siempre es el de la línea de pedido — se fija al abrir.
  useEffect(() => {
    if (open) {
      setValue("productoId", pedidoDetalle.productoId);
      setValue("pedidoDetalleId", pedidoDetalle.id);
      // Si la línea ya especifica color, se fija también — no editable en ese caso.
      if (pedidoDetalle.pigmentoId) {
        setValue("pigmentoId", pedidoDetalle.pigmentoId);
      }
    }
  }, [open, pedidoDetalle]);

  // ---------- FILTRO DE COHERENCIA ----------
  // Solo mostramos materias primas cuyo "tipo" coincide con lo que ya sabemos del producto.
  // Como el producto no expone tipoMaterial en PedidoDetalle directamente, filtramos
  // materias primas libremente aquí, y dejamos que la coherencia producto-material
  // la confirme el backend — pero SÍ filtramos pigmento según la materia prima elegida,
  // y molido según materia prima + color del pigmento, que es donde más se equivoca el usuario.

  const materiaPrimaSeleccionada = useMemo(
    () => (materiasPrimas ?? []).find((m) => m.id === materiaPrimaIdSeleccionada),
    [materiasPrimas, materiaPrimaIdSeleccionada]
  );

  const pigmentosFiltrados = useMemo(() => {
    if (!materiaPrimaSeleccionada) return [];
    return (pigmentos ?? []).filter((p) => p.tipoMaterial === materiaPrimaSeleccionada.tipo);
  }, [pigmentos, materiaPrimaSeleccionada]);

  const pigmentoIdSeleccionado = watch("pigmentoId");
  const pigmentoSeleccionado = useMemo(
    () => pigmentosFiltrados.find((p) => p.id === pigmentoIdSeleccionado),
    [pigmentosFiltrados, pigmentoIdSeleccionado]
  );

  const molidoFiltrado = useMemo(() => {
    if (!materiaPrimaSeleccionada || !pigmentoSeleccionado?.colorSolidoId) return [];
    return (inventarioMolido ?? []).filter(
      (m) =>
        m.materiaPrimaId === materiaPrimaSeleccionada.id &&
        m.colorSolidoId === pigmentoSeleccionado.colorSolidoId
    );
  }, [inventarioMolido, materiaPrimaSeleccionada, pigmentoSeleccionado]);

  // Si cambia la materia prima, limpiamos pigmento/molido para no dejar una combinación inválida "fantasma"
  useEffect(() => {
    setValue("pigmentoId", pedidoDetalle.pigmentoId ?? "");
    setValue("inventarioMolidoId", "");
  }, [materiaPrimaIdSeleccionada]);

  const onSubmit = async (data: CrearOrdenInput) => {
    try {
      const nuevaOrden = await crearMutation.mutateAsync(data);
      toast.success("Orden creada correctamente.");
      reset();
      onClose();
      navigate(`/ordenes/${nuevaOrden.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la orden.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva orden de producción</DialogTitle>
          <DialogDescription>
            Producto: {pedidoDetalle.productoNombre} — Solicitado: {pedidoDetalle.cantidadSolicitada}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <Label>Folio</Label>
            <Input {...register("folio")} placeholder="Ej. OP-2026-045" />
            {errors.folio && <p className="text-xs text-red-500">{errors.folio.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo de material</Label>
            <Select
              value={tipoMaterial ?? ""}
              onValueChange={(val) =>
                setValue("tipoMaterial", val as (typeof TIPO_MATERIAL_ORDEN)[number], { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {TIPO_MATERIAL_ORDEN.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Materia prima</Label>
            <Select
              value={materiaPrimaIdSeleccionada ?? ""}
              onValueChange={(val) => setValue("materiaPrimaId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {(materiasPrimas ?? []).map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre} ({m.tipo})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {"materiaPrimaId" in errors && errors.materiaPrimaId && (
              <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Pigmento (color)</Label>
            <Select
              value={pigmentoIdSeleccionado ?? ""}
              disabled={!materiaPrimaSeleccionada || !!pedidoDetalle.pigmentoId}
              onValueChange={(val) => setValue("pigmentoId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder={materiaPrimaSeleccionada ? "Selecciona" : "Primero elige materia prima"} />
              </SelectTrigger>
              <SelectContent>
                {pigmentosFiltrados.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pedidoDetalle.pigmentoId && (
              <p className="text-xs text-muted-foreground">Color ya definido por el pedido.</p>
            )}
            {"pigmentoId" in errors && errors.pigmentoId && (
              <p className="text-xs text-red-500">{errors.pigmentoId.message}</p>
            )}
          </div>

          {(tipoMaterial === "MEZCLA_MOLIDO_INTERNO" || tipoMaterial === "MEZCLA_RECICLADO") && (
            <>
              <div className="flex flex-col gap-1">
                <Label>Molido a usar</Label>
                <Select
                  value={watch("inventarioMolidoId") ?? ""}
                  disabled={!pigmentoSeleccionado}
                  onValueChange={(val) => setValue("inventarioMolidoId", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={pigmentoSeleccionado ? "Selecciona" : "Primero elige el color"} />
                  </SelectTrigger>
                  <SelectContent>
                    {molidoFiltrado.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.origen} — {m.colorSolidoNombre} ({m.cantidadActual} kg disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {molidoFiltrado.length === 0 && pigmentoSeleccionado && (
                  <p className="text-xs text-amber-600">No hay molido disponible para este material y color.</p>
                )}
                {"inventarioMolidoId" in errors && errors.inventarioMolidoId && (
                  <p className="text-xs text-red-500">{errors.inventarioMolidoId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label>% Virgen</Label>
                  <Input
                    type="number"
                    {...register("porcentajeVirgen", { valueAsNumber: true })}
                    placeholder="Ej. 30"
                  />
                  {"porcentajeVirgen" in errors && errors.porcentajeVirgen && (
                    <p className="text-xs text-red-500">{errors.porcentajeVirgen.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>% Molido</Label>
                  <Input
                    type="number"
                    {...register("porcentajeMolido", { valueAsNumber: true })}
                    placeholder="Ej. 70"
                  />
                  {"porcentajeMolido" in errors && errors.porcentajeMolido && (
                    <p className="text-xs text-red-500">{errors.porcentajeMolido.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <Label>Máquina</Label>
            <Select
              value={watch("maquinaId") ?? ""}
              onValueChange={(val) => setValue("maquinaId", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {(maquinas ?? []).filter((m) => m.estado === "ACTIVA").map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maquinaId && <p className="text-xs text-red-500">{errors.maquinaId.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Total de piezas</Label>
            <Input
              type="number"
              {...register("totalPiezas", { valueAsNumber: true })}
              placeholder="Ej. 1000"
            />
            {errors.totalPiezas && <p className="text-xs text-red-500">{errors.totalPiezas.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Aditivo (opcional)</Label>
            <Input {...register("aditivoDescripcion")} placeholder="Ej. Antiestático" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Observaciones (opcional)</Label>
            <Input {...register("observaciones")} placeholder="Notas adicionales..." />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || crearMutation.isPending}>
              {isSubmitting || crearMutation.isPending ? "Creando..." : "Crear orden"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}