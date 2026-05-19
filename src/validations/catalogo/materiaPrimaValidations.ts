import { z } from "zod"

const tiposMateriaPrima = [
  "Polipropileno",
  "Poliestireno-Cristal",
] as const

const subtipos = ["virgen", "reciclado"] as const

const unidadesMedida = ["kg", "lt", "pza"] as const

export const crearMateriaPrimaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  codigoInterno: z
    .string()
    .min(1, "El código interno es requerido")
    .regex(/^[A-Z]{2}-[A-Z0-9]{4}$/, "Formato inválido, ejemplo: JU-PVL1"),
  tipo: z.enum(tiposMateriaPrima, {
    message: "Selecciona un tipo válido"
  }),
  subtipo: z.enum(subtipos, {
    message: "Selecciona un subtipo válido"
  }),
  proveedor: z
    .string()
    .min(1, "El proveedor es requerido"),
  unidadMedida: z.enum(unidadesMedida, {
    message: "Selecciona una unidad de medida válida"
  }),
  costoUnitario: z
    .number({ message: "El costo debe ser un valor numérico" })
    .min(0, "El costo no puede ser negativo")
})

export const editarMateriaPrimaSchema = crearMateriaPrimaSchema

export type CrearMateriaPrimaForm = z.infer<typeof crearMateriaPrimaSchema>
export type EditarMateriaPrimaForm = z.infer<typeof editarMateriaPrimaSchema>