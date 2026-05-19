import { z } from "zod"

export const crearMotivoParoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
})

export const editarMotivoParoSchema = crearMotivoParoSchema

export type CrearMotivoParoForm = z.infer<typeof crearMotivoParoSchema>
export type EditarMotivoParoForm = z.infer<typeof editarMotivoParoSchema>