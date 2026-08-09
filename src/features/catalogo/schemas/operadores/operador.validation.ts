import z from "zod";

export const crearOperadorSchema = z.object({
    nombre: z.string().min(1, "El nombre del operador es requerido"),
})

export const editarOperadorSchema = crearOperadorSchema;

export type CrearOperadorInput = z.infer<typeof crearOperadorSchema>;
export type EditarOperadorInput = z.infer<typeof editarOperadorSchema>;