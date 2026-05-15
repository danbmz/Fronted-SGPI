import { z } from "zod";

const categoriasColor = [
  "Sólidos",
  "Sólidos Pasteles",
  "Neón Traslucidos",
  "Jarra Neón Pastel"
] as const

const tiposPigmento = ["master", "polvo"] as const

const materiasPrimas = ["Polipropileno Virgen", "Poliestireno-Cristal Virgen"] as const

export const crearPigmentoSchema = z.object({
    nombre:z
    .string()
    .min(1, "El nombre del Pigmento es requerido"),
    color:z
    .string()
    .min(1, "El color es requerido"),
    categoriaColor: z.enum(categoriasColor, {
        message: "Selecciona una categoría válida"
    }),
    tipo: z.enum(tiposPigmento, {
        message: "Selecciona un tipo de pigmento válido" 
    }),
    materiaPrimaId:z.enum(materiasPrimas, {
        message: "Selecciona una materia prima válido"
    })

})