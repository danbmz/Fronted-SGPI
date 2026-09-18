import { z } from "zod";

const produccionPorPeriodoSchema = z.object({
  periodo: z.string(),
  piezasBuenas: z.int(),
  piezasDefectuosas: z.int(),
});

const produccionSchema = z.object({
  totalPiezasBuenas: z.int(),
  totalPiezasDefectuosas: z.int(),
  totalKgMerma: z.number(),
  totalKgPlasta: z.number(),
  granularidad: z.enum(["dia", "semana", "mes"]),
  porPeriodo: z.array(produccionPorPeriodoSchema),
});

const pedidoCumplimientoSchema = z.object({
  id: z.string(),
  numeroPedido: z.string(),
  cliente: z.string(),
  fechaEntrega: z.string().nullable(),
  completadoEn: z.string(),
  diasDiferencia: z.int().nullable(),
});

const cumplimientoPedidosSchema = z.object({
  totalCompletados: z.int(),
  aTiempo: z.int(),
  conRetraso: z.int(),
  sinFechaDefinida: z.int(),
  porcentajeCumplimiento: z.number(),
  detalle: z.array(pedidoCumplimientoSchema),
});

const costoMaterialSchema = z.object({
  nombre: z.string(),
  kgMerma: z.number(),
  kgPlasta: z.number(),
  costoTotal: z.number(),
});

const costoMermaPlastaSchema = z.object({
  costoTotalGeneral: z.number(),
  porMaterial: z.array(costoMaterialSchema),
});

const consumoMateriaPrimaSchema = z.object({
  nombre: z.string(),
  kgConsumidos: z.number(),
  costoTotal: z.number(),
});

const consumoPigmentoSchema = z.object({
  color: z.string(),
  kgConsumidos: z.number(),
  costoTotal: z.number(),
});

const consumoMaterialesSchema = z.object({
  costoTotalGeneral: z.number(),
  materiaPrima: z.array(consumoMateriaPrimaSchema),
  pigmento: z.array(consumoPigmentoSchema),
});

const desempenoOperadorSchema = z.object({
  operadorId: z.string(),
  operadorNombre: z.string(),
  piezasBuenas: z.int(),
  piezasDefectuosas: z.int(),
  porcentajeDefectos: z.number(),
});

const tiempoParoPorMotivoSchema = z.object({
  nombre: z.string(),
  minutos: z.int(),
});

const tiemposParoSchema = z.object({
  totalMinutos: z.int(),
  porMotivo: z.array(tiempoParoPorMotivoSchema),
});

export const reportesSchema = z.object({
  produccion: produccionSchema,
  cumplimientoPedidos: cumplimientoPedidosSchema,
  costoMermaPlasta: costoMermaPlastaSchema,
  consumoMateriales: consumoMaterialesSchema,
  desempenoOperadores: z.array(desempenoOperadorSchema),
  tiemposParo: tiemposParoSchema,
});

export type Reportes = z.infer<typeof reportesSchema>;