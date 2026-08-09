import z from "zod";

export const colorSolidoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  activo: z.boolean(),  
})

export type ColorSolido = z.infer<typeof colorSolidoSchema>;
export const listaColorSolido = z.array(colorSolidoSchema);