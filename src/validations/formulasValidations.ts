import { z } from "zod"

const categoriasColor = [
  "Sólidos",
  "Sólidos Pasteles",
  "Neón Traslucidos",
  "Jarra Neón Pastel"
] as const

const tiposPigmento = ["master", "polvo"] as const

export const crearFormulaPigmentoSchema = z.object({
  materiaPrimaId: z
    .string()
    .min(1, "Selecciona un material base"),
  materialBase: z
    .string()
    .min(1, "El material base es requerido"),
  categoriaColor: z.enum(categoriasColor, {
    message: "Selecciona una categoría válida"
  }),
  color: z
    .string()
    .min(1, "El color es requerido"),
  tipoPigmento: z.enum(tiposPigmento, {
    message: "Selecciona un tipo de pigmento válido" 
  }),
  dosisGrPorKg: z
    .number({ message: "La dosis debe ser un valor numérico" })
    .positive("La dosis debe ser mayor a 0")
})

export const editarFormulaPigmentoSchema = crearFormulaPigmentoSchema

export type CrearFormulaPigmentoForm = z.infer<typeof crearFormulaPigmentoSchema>
export type EditarFormulaPigmentoForm = z.infer<typeof editarFormulaPigmentoSchema>