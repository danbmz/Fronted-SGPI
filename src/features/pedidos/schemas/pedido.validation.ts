import { z } from "zod";

export const crearPedidoSchema = z.object({
  numeroPedido: z
    .string()
    .min(1, "El número de pedido es requerido")
    .max(50, "El número de pedido no puede exceder 50 caracteres"),
  cliente: z
    .string()
    .min(1, "El cliente es requerido")
    .max(150, "El cliente no puede exceder 150 caracteres"),
  remision: z
    .string()
    .max(150, "La remisión no puede exceder 150 caracteres")
    .optional(),
  descripcion: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
});

export type CrearPedidoInput = z.infer<typeof crearPedidoSchema>;

export const editarPedidoSchema = z.object({
  cliente: z
    .string()
    .min(1, "El cliente es requerido")
    .max(150, "El cliente no puede exceder 150 caracteres")
    .optional(),
  descripcion: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
});

export type EditarPedidoInput = z.infer<typeof editarPedidoSchema>;

export const cancelarPedidoSchema = z.object({
  motivo: z
    .string()
    .min(1, "El motivo es requerido")
    .max(300, "El motivo no puede exceder 300 caracteres"),
});

export type CancelarPedidoInput = z.infer<typeof cancelarPedidoSchema>;

export const crearPedidoDetalleSchema = z.object({
  productoId: z.string().min(1, "Selecciona un producto"),
  pigmentoId: z.string().optional(),
  cantidadSolicitada: z
    .number({ message: "La cantidad debe ser un valor numérico" })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
});

export type CrearPedidoDetalleInput = z.infer<typeof crearPedidoDetalleSchema>;