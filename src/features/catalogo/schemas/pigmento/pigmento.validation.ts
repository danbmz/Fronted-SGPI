import z from "zod";
import { TIPO_MATERIAL, TIPO_PIGMENTO, CATEGORIA_COLOR } from "@/types/enums";

export const crearPigmentoSchema = z.object({
  color: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  categoriaColor: z.enum(CATEGORIA_COLOR, {
    message: "La categoría es requerida"
  }),
  tipo: z.enum(TIPO_PIGMENTO, {
    message: "El tipo de pigmento es requerido"
  }),
  tipoMaterial: z.enum(TIPO_MATERIAL, {
    message: "El tipo de material es requerido"
  }),
  colorSolidoId: z.string().optional(),
  dosisGrPorKg: z
    .number({ message: "La dosis debe ser un valor numérico"})
    .min(0, "La dosis no puede ser menor a 0"),
  stockMinimo: z
    .number({message: "El stock mínimo debe ser un valor numérico"})
    .min(0, "El stock mínimo no puede ser negativo"),
  costoUnitario: z
    .number({message: "El costo debe ser un valor numérico"})
    .min(0, "El costo no puede ser negativo")
    .optional(),
});

export type CrearPigmentoInput = z.infer<typeof crearPigmentoSchema>;

export const editarPigmentoSchema = crearPigmentoSchema
    .omit({categoriaColor: true, tipo: true, tipoMaterial: true})
    .partial();

export type EditarPigmentoInput = z.infer<typeof editarPigmentoSchema>