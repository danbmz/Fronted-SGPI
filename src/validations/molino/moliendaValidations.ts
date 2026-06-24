import { z } from "zod"

export const moliendaSchema = z.object({
  id: z.string(),
  ordenesIds: z.array(z.string()),       // ← ahora es un array
  folios: z.array(z.string()),           // ← folios involucrados, para mostrar
  materialBase: z.string(),
  materiaPrimaId: z.string(),
  colorAproximado: z.string(),
  kgIngresados: z.number(),
  fecha: z.string(),
  observaciones: z.string().nullable()
})

export const registrarMoliendaSchema = z.object({
  ordenesIds: z
    .array(z.string())
    .min(1, "Selecciona al menos una orden"),
  kgIngresados: z
    .number({ message: "Debe ser un valor numérico" })
    .positive("Los kg deben ser mayor a 0"),
  colorAproximado: z.string().min(1, "El color es requerido"),
  observaciones: z.string().optional()
})

export type Molienda = z.infer<typeof moliendaSchema>
export type RegistrarMoliendaForm = z.infer<typeof registrarMoliendaSchema>