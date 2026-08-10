import { z } from "zod";
import { TIPO_INVENTARIO, ORIGEN_MOLIDO } from "@/types/enums";

// ---------- Entrada de proveedor ----------

export const entradaProveedorSchema = z.discriminatedUnion("tipoInventario", [
  z.object({
    tipoInventario: z.literal("MATERIA_PRIMA"),
    materiaPrimaId: z.string().min(1, "Selecciona una materia prima"),
    cantidad: z.number({ message: "La cantidad debe ser un valor numérico" }).positive("La cantidad debe ser mayor a 0"),
    descripcion: z.string().max(300).optional(),
  }),
  z.object({
    tipoInventario: z.literal("PIGMENTO"),
    pigmentoId: z.string().min(1, "Selecciona un pigmento"),
    cantidad: z.number({ message: "La cantidad debe ser un valor numérico" }).positive("La cantidad debe ser mayor a 0"),
    descripcion: z.string().max(300).optional(),
  }),
  z.object({
    tipoInventario: z.literal("MOLIDO"),
    materiaPrimaId: z.string().min(1, "Selecciona un material"),
    colorSolidoId: z.string().min(1, "Selecciona un color"),
    cantidad: z.number({ message: "La cantidad debe ser un valor numérico" }).positive("La cantidad debe ser mayor a 0"),
    descripcion: z.string().max(300).optional(),
  }),
]);

export type EntradaProveedorInput = z.infer<typeof entradaProveedorSchema>;

// ---------- Ajuste manual ----------

export const ajusteManualSchema = z.discriminatedUnion("tipoInventario", [
  z.object({
    tipoInventario: z.literal("MATERIA_PRIMA"),
    materiaPrimaId: z.string().min(1, "Selecciona una materia prima"),
    diferencia: z.number({ message: "La diferencia debe ser un valor numérico" }),
    descripcion: z.string().min(1, "Describe el motivo del ajuste").max(300),
  }),
  z.object({
    tipoInventario: z.literal("PIGMENTO"),
    pigmentoId: z.string().min(1, "Selecciona un pigmento"),
    diferencia: z.number({ message: "La diferencia debe ser un valor numérico" }),
    descripcion: z.string().min(1, "Describe el motivo del ajuste").max(300),
  }),
  z.object({
    tipoInventario: z.literal("PRODUCTO"),
    productoId: z.string().min(1, "Selecciona un producto"),
    pigmentoId: z.string().min(1, "Selecciona un color"),
    diferencia: z.number({ message: "La diferencia debe ser un valor numérico" }),
    descripcion: z.string().min(1, "Describe el motivo del ajuste").max(300),
  }),
  z.object({
    tipoInventario: z.literal("MOLIDO"),
    materiaPrimaId: z.string().min(1, "Selecciona un material"),
    origen: z.enum(ORIGEN_MOLIDO, { message: "Selecciona un origen" }),
    colorSolidoId: z.string().min(1, "Selecciona un color"),
    diferencia: z.number({ message: "La diferencia debe ser un valor numérico" }),
    descripcion: z.string().min(1, "Describe el motivo del ajuste").max(300),
  }),
  z.object({
    tipoInventario: z.literal("MATERIAL_PIGMENTADO"),
    materiaPrimaId: z.string().min(1, "Selecciona un material"),
    pigmentoId: z.string().min(1, "Selecciona un pigmento"),
    diferencia: z.number({ message: "La diferencia debe ser un valor numérico" }),
    descripcion: z.string().min(1, "Describe el motivo del ajuste").max(300),
  }),
]);

export type AjusteManualInput = z.infer<typeof ajusteManualSchema>;

// ---------- Salida de producto ----------

const itemSalidaProductoSchema = z.object({
  productoId: z.string().min(1, "Selecciona un producto"),
  pigmentoId: z.string().min(1, "Selecciona un color"),
  cantidad: z.number({ message: "La cantidad debe ser un valor numérico" }).int("La cantidad debe ser un número entero").positive("La cantidad debe ser mayor a 0"),
});

export const salidaProductoSchema = z
  .object({
    motivo: z.enum(["ENTREGA_PEDIDO", "VENTA"], { message: "Selecciona un motivo" }),
    pedidoId: z.string().optional(),
    items: z.array(itemSalidaProductoSchema).min(1, "Agrega al menos un producto"),
    descripcion: z.string().max(300).optional(),
  })
  .refine((data) => data.motivo !== "ENTREGA_PEDIDO" || data.pedidoId !== undefined, {
    message: "Debes seleccionar un pedido",
    path: ["pedidoId"],
  });

export type SalidaProductoInput = z.infer<typeof salidaProductoSchema>;

// ---------- Historial (query params) ----------

export const historialQuerySchema = z.object({
  tipoInventario: z.enum(TIPO_INVENTARIO),
  materiaPrimaId: z.string().optional(),
  pigmentoId: z.string().optional(),
  productoId: z.string().optional(),
  colorSolidoId: z.string().optional(),
  origen: z.enum(ORIGEN_MOLIDO).optional(),
  combinacionId: z.string().optional(),
  limite: z.number().int().min(1).max(200).optional(),
});

export type HistorialQueryInput = z.infer<typeof historialQuerySchema>;