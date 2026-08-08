import { z } from "zod";
import { TIPO_MATERIAL, UNIDAD_MEDIDA } from "@/types/enums";

// ---------- Schema de la respuesta de la API (manejo interno) ----------

export const materiaPrimaSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  codigoInterno: z.string(),
  tipo: z.enum(TIPO_MATERIAL),
  proveedor: z.string().nullable(),
  unidadMedida: z.enum(UNIDAD_MEDIDA),
  costoUnitario: z.number().nullable(),
  stockActual: z.number(),
  stockMinimo: z.number(),
  activo: z.boolean(),
});

export type MateriaPrima = z.infer<typeof materiaPrimaSchema>;

export const listaMateriaPrimaSchema = z.array(materiaPrimaSchema);