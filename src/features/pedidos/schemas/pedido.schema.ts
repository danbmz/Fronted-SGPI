import { z } from "zod";
import { ESTADO_PEDIDO, TIPO_MATERIAL } from "@/types/enums";

export const pedidoDetalleSchema = z.object({
  id: z.string(),
  productoId: z.string(),
  productoNombre: z.string(),
  tipoMaterial: z.enum(TIPO_MATERIAL),
  pigmentoId: z.string().nullable(),
  pigmentoColor: z.string().nullable(),
  categoriaColor: z.string().nullable(),
  cantidadSolicitada: z.int(),
  cantidadProducida: z.int(),
  cantidadEntregada: z.int(),
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

// export const listaPedidoSchema = z.array(pedidoSchema);

// Forma para agregar paginacion
export const paginacionSchema = z.object({
  pagina: z.int(),
  limite: z.int(),
  total: z.int(),
  totalPaginas: z.int(),
});

export type Paginacion = z.infer<typeof paginacionSchema>;

export const listaPedidoResponseSchema = z.object({
  data: z.array(pedidoSchema),
  paginacion: paginacionSchema,
});

export type ListaPedidoResponse = z.infer<typeof listaPedidoResponseSchema>;