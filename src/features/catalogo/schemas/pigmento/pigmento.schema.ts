import z from "zod";
import { CATEGORIA_COLOR, TIPO_PIGMENTO, TIPO_MATERIAL } from "@/types/enums";


export const pigmentoSchema = z.object({
  id: z.string(),
  color: z.string(),
  categoriaColor: z.enum(CATEGORIA_COLOR),
  tipo: z.enum(TIPO_PIGMENTO),
  dosisGrPorKg: z.number(),
  tipoMaterial: z.enum(TIPO_MATERIAL),
  colorSolidoId: z.string().nullable(),
  colorSolidoNombre: z.string().nullable(),
  activo: z.boolean(),
  costoUnitario: z.number().nullable(),
  stockActual: z.number(),
  stockMinimo: z.number(),
});

export type Pigmento = z.infer<typeof pigmentoSchema>;

export const listaPigmentoSchema = z.array(pigmentoSchema);