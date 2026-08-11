import { z } from "zod";
import { ESTADO_PEDIDO } from "@/types/enums";

export const pedidoDetalleSchema = z.object({
  id: z.string(),
  productoId: z.string(),
  productoNombre: z.string(),
  pigmentoId: z.string().nullable(),
  pigmentoColor: z.string().nullable(),
  cantidadSolicitada: z.int(),
  cantidadProducida: z.int(),
  cantidadEntregada: z.number(),
});

export type PedidoDetalle = z.infer<typeof pedidoDetalleSchema>;

export const pedidoSchema = z.object({
  id: z.string(),
  numeroPedido: z.string(),
  cliente: z.string(),
  descripcion: z.string().nullable(),
  remision: z.string().nullable(),
  estado: z.enum(ESTADO_PEDIDO),
  activo: z.boolean(),
  detalle: z.array(pedidoDetalleSchema),
  totalOrdenes: z.int(),
  ordenesCompletadas: z.int(),
  createdAt: z.string(),
});

export type Pedido = z.infer<typeof pedidoSchema>;

export const listaPedidoSchema = z.array(pedidoSchema);