import { z } from "zod"
import type { CategoriaColor, TipoPigmento } from "./pigmentosValidations"

export const crearFormulaPigmentoSchema = z.object({
  materialBase: z
    .string()
    .min(1, "El material base es requerido"),
  pigmentoId: z
    .string()
    .min(1,"Selecciona un pigmento"),
  color: z
    .string()
    .min(1, "El color es requerido"),
  dosisGrPorKg: z
    .number({ message: "La dosis debe ser un valor numérico" })
    .positive("La dosis debe ser mayor a 0")
})

export const editarFormulaPigmentoSchema = crearFormulaPigmentoSchema
  .pick( { dosisGrPorKg: true})
  .extend( { 
    motivo:z
    .string()
    .min(1, "El motivo es requerido")
    .min(10, "El motivo debe tener al menos 10 caracteres")
  })

export type CrearFormulaPigmento = z.infer<typeof crearFormulaPigmentoSchema>
export type EditarFormulaPigmento = z.infer<typeof editarFormulaPigmentoSchema>

export interface FormulaPigmento extends CrearFormulaPigmento {
  id: string
  materialBaseId: string 
  categoriaColor: CategoriaColor
  tipoPigmento: TipoPigmento
}