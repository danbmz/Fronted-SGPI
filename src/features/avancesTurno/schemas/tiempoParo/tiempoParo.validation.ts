import { z } from "zod";

export const crearTiempoParoSchema = z.object({
  motivoParoId: z.string().min(1, "Selecciona un motivo"),
  minutos: z
    .number({ message: "Los minutos deben ser un valor numérico" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  observaciones: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type CrearTiempoParoInput = z.infer<typeof crearTiempoParoSchema>;