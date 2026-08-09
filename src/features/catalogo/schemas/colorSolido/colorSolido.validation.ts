import z from "zod";

export const crearColorSolidoSchema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es requerido")
        .min(4, "El nombre debe tener al menos 3 caracteres")
});

export const editarColorSolidoSchema = crearColorSolidoSchema;

export type CrearColorSolidoInput = z.infer<typeof crearColorSolidoSchema>;
export type EditarColorSolidoInput = z.infer<typeof editarColorSolidoSchema>;