import { z } from "zod"

export const categoriasColor = [
  "Sólidos",
  "Sólidos Pasteles",
  "Neón Traslucidos",
  "Jarra Neón Pastel"
] as const

export const tiposPigmento = ["master", "polvo"] as const

export const crearPigmentoSchema = z.object({
  color: z
    .string()
    .min(1, "El color es requerido"),
  categoriaColor: z.enum(categoriasColor, {
    message: "Selecciona una categoría válida"
  }),
  tipo: z.enum(tiposPigmento, {
    message: "Selecciona un tipo válido"
  }),
  materiaPrimaId: z
    .string()
    .min(1, "Selecciona un material base"),
  aplicacion: z
    .string()
    .min(1, "La aplicación es requerida")
})

export const editarPigmentoSchema = crearPigmentoSchema

export type CrearPigmento = z.infer<typeof crearPigmentoSchema>
export type EditarPigmento = z.infer<typeof editarPigmentoSchema>
export type CategoriaColor = z.infer<typeof crearPigmentoSchema>["categoriaColor"]
export type TipoPigmento = z.infer<typeof crearPigmentoSchema>["tipo"]

export interface Pigmento extends CrearPigmento {
  id: string
  activo: boolean
}