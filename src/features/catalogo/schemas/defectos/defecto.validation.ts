import { z } from "zod";

export const crearDefectoProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
});

export type CrearDefectoProductoInput = z.infer<typeof crearDefectoProductoSchema>;

export const editarDefectoProductoSchema = crearDefectoProductoSchema;

export type EditarDefectoProductoInput = z.infer<typeof editarDefectoProductoSchema>;