// src/validations/maquinaValidations.ts
import { z } from "zod"

export const crearMaquinaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido"),
  codigo: z
    .string()
    .min(1, "El código es requerido"),
  numero: z
    .number({ message: "El número debe ser un valor numérico" })
    .int("El número debe ser entero")
    .positive("El número debe ser mayor a 0"),
  tipoProceso: z.enum(["Inyección", "Soplado"], {
    message: "Selecciona un tipo de proceso válido"
  }),
  capacidadTon: z
    .number({ message: "La capacidad debe ser un valor numérico" })
    .positive("La capacidad debe ser mayor a 0")
    .nullable()
    .optional()
})

export const editarMaquinaSchema = crearMaquinaSchema

export const cambiarEstadoSchema = z.object({
  estado: z.enum(["activa", "en mantenimiento", "inactiva"], {
    message: "Selecciona un estado válido" 
  }),
  motivo: z
    .string()
    .min(1, "El motivo es requerido")
    .min(10, "El motivo debe tener al menos 10 caracteres")
})

export type CrearMaquinaForm = z.infer<typeof crearMaquinaSchema>
export type EditarMaquinaForm = z.infer<typeof editarMaquinaSchema>
export type CambiarEstadoForm = z.infer<typeof cambiarEstadoSchema>