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

export const confirmacionMolinoSchema = z.object({
  confirmado: z.boolean(),
  kgMermaRecibida: z.number().min(0),
  kgPlastaRecibida: z.number().min(0),
  piezasMalasRecibidas: z.number().int().min(0),
  piezasCambioColorRecibidas: z.number().int().min(0),
  fecha: z.string(),
  hayDiferencia: z.boolean() // ← para saber si hubo discrepancia
})

// Schema para el form de diferencia — solo se usa cuando hay discrepancia
export const reportarDiferenciaSchema = z.object({
  kgMermaRecibida: z
    .number({ message: "Debe ser un valor numérico" })
    .min(0, "No puede ser negativo"),
  kgPlastaRecibida: z
    .number({ message: "Debe ser un valor numérico" })
    .min(0, "No puede ser negativo"),
  piezasMalasRecibidas: z
    .number({ message: "Debe ser un valor numérico" })
    .int()
    .min(0, "No puede ser negativo"),
  piezasCambioColorRecibidas: z
    .number({ message: "Debe ser un valor numérico" })
    .int()
    .min(0, "No puede ser negativo")
})

export type Molienda = z.infer<typeof moliendaSchema>
export type RegistrarMoliendaForm = z.infer<typeof registrarMoliendaSchema>
export type ReportarDiferenciaForm = z.infer<typeof reportarDiferenciaSchema>