import { z } from "zod"

export const crearOperadorSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  numeroEmpleado: z
    .string()
    .min(1, "El número de empleado es requerido")
    .regex(/^[0-9]+-[A-Z]$/, "Formato inválido, ejemplo: 295-R"),
  turnoHabitual: z.enum(["Mañana", "Tarde", "Noche"], {
     message: "Selecciona un turno válido"
  }),
  area: z
    .string()
    .min(1, "El área es requerida")
})

export const editarOperadorSchema = crearOperadorSchema

export type CrearOperadorForm = z.infer<typeof crearOperadorSchema>
export type EditarOperadorForm = z.infer<typeof editarOperadorSchema>