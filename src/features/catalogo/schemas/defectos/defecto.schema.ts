import { z } from "zod";

export const defectoProductoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  activo: z.boolean(),
});

export type DefectoProducto = z.infer<typeof defectoProductoSchema>;

export const listaDefectoProductoSchema = z.array(defectoProductoSchema);