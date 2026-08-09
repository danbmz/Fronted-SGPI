import z from "zod";

export const operadorSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    activo: z.boolean(),
})

export type Operador = z.infer<typeof operadorSchema>;

export const listaOperadorSchema = z.array(operadorSchema);