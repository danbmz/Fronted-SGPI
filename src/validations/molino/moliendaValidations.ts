import { z } from "zod"

export const moliendaSchema = z.object({
  id: z.string(),
  ordenId: z.string(),
  folio: z.string(),
  producto: z.string(),
  color: z.string(),
  materialBase: z.string(),
  materiaPrimaId: z.string(),
  colorAproximado: z.string(),
  kgIngresados: z.number(),
  fecha: z.string(),
  observaciones: z.string().nullable()
})

export type Molienda = z.infer<typeof moliendaSchema>