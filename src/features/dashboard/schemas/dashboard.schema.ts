import { z } from "zod";

const pedidoAlertaSchema = z.object({
  id: z.string(),
  numeroPedido: z.string(),
  cliente: z.string(),
  fechaEntrega: z.string(),
  diasRestantes: z.int(),
});

const stockBajoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  tipo: z.enum(["MATERIA_PRIMA", "PIGMENTO"]),
  cantidadActual: z.number(),
  stockMinimo: z.number(),
});

const alertasSchema = z.object({
  pedidosAtrasados: z.array(pedidoAlertaSchema),
  pedidosUrgentes: z.array(pedidoAlertaSchema),
  stockBajo: z.array(stockBajoSchema),
});

const kpisSchema = z.object({
  piezasProducidasHoy: z.int(),
  piezasDefectuosasHoy: z.int(),
  kgMermaHoy: z.number(),
  kgPlastaHoy: z.number(),
  ordenesEnProgreso: z.int(),
  maquinasEnUso: z.int(),
  maquinasTotales: z.int(),
});

const produccionPorDiaSchema = z.object({
  fecha: z.string(),
  piezasBuenas: z.int(),
  piezasDefectuosas: z.int(),
});

const ordenesPorEstadoSchema = z.object({
  estado: z.string(),
  total: z.int(),
});

const defectoFrecuenciaSchema = z.object({
  nombre: z.string(),
  total: z.int(),
});

const graficasSchema = z.object({
  produccionPorDia: z.array(produccionPorDiaSchema),
  ordenesPorEstado: z.array(ordenesPorEstadoSchema),
  defectosFrecuentes: z.array(defectoFrecuenciaSchema),
});

const desempenoOperadorSchema = z.object({
  operadorId: z.string(),
  operadorNombre: z.string(),
  piezasBuenas: z.int(),
  piezasDefectuosas: z.int(),
  porcentajeDefectos: z.number(),
});

const pedidoEnProgresoSchema = z.object({
  id: z.string(),
  numeroPedido: z.string(),
  cliente: z.string(),
  fechaEntrega: z.string().nullable(),
  ordenesCompletadas: z.int(),
  totalOrdenes: z.int(),
});

const tiempoParoPorMotivoSchema = z.object({
  nombre: z.string(),
  minutos: z.int(),
});

const tiemposParoSchema = z.object({
  totalMinutos: z.int(),
  porMotivo: z.array(tiempoParoPorMotivoSchema),
});

export const dashboardSchema = z.object({
  alertas: alertasSchema,
  kpis: kpisSchema,
  graficas: graficasSchema,
  desempenoOperadores: z.array(desempenoOperadorSchema),
  pedidosEnProgreso: z.array(pedidoEnProgresoSchema),
  tiemposParo: tiemposParoSchema,
});

export type Dashboard = z.infer<typeof dashboardSchema>;