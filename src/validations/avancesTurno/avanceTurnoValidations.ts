import { z } from "zod"
import { confirmacionMolinoSchema } from "../molino/moliendaValidations"

export const turnos = ["Mañana", "Tarde", "Noche"] as const
export const estadosAvance = ["abierto", "cerrado"] as const

export const registrarParoSchema = z.object({
  motivoId: z.string(),
  motivo: z.string(),
  minutos: z
    .number({ message: "Los minutos deben ser un valor numérico" })
    .int()
    .positive("Los minutos deben ser mayor a 0"),
  observaciones: z.string().optional()
})

export const solicitudMaterialSchema = z.object({
  id: z.string(),
  kgSolicitados: z
    .number({ message: "Debe ser un valor numérico" })
    .positive("Los kg deben ser mayor a 0"),
  motivo: z.string().optional(),
  fecha: z.string(),
  confirmado: z.boolean()
})

export const solicitarMaterialSchema = z.object({
  kgSolicitados: z
    .number({ message: "Debe ser un valor numérico" })
    .positive("Los kg deben ser mayor a 0"),
  motivo: z.string().optional()
})

export const avanceTurnoSchema = z.object({
  id: z.string(),
  ordenId: z.string(),
  folio: z.string(),
  producto: z.string(),
  color: z.string(),
  maquina: z.string(),
  supervisorId: z.string(),
  supervisorNombre: z.string(),
  turno: z.enum(turnos),
  fecha: z.string(),
  horaInicio: z.string(),
  horaFin: z.string().nullable(),
  estado: z.enum(estadosAvance),
  borradorGuardado: z.boolean(),
  piezasBuenas: z.number(),
  piezasDefectuosas: z.number(),
  kgMerma: z.number(),
  kgPlasta: z.number(),
  kgSobrante: z.number(),
  piezasCambioColor: z.number(),
  observaciones: z.string().nullable(),
  tiemposParo: z.array(registrarParoSchema),
  solicitudesMaterial: z.array(solicitudMaterialSchema),
  confirmacionMolino: confirmacionMolinoSchema.nullable(),
  sobranteConfirmado: z.boolean()
})

// Schema para cerrar un avance
export const cerrarAvanceSchema = z.object({
  piezasBuenas: z
    .number({ message: "Debe ser un valor numérico" })
    .int()
    .min(1, "Ingresa un valor válido"),
  piezasDefectuosas: z
    .number({ message: "Debe ser un valor numérico" })
    .int()
    .min(0, "Ingresa un valor válido"),
  kgMerma: z
    .number({ message: "Debe ser un valor numérico" })
    .min(1, "Ingresa un valor válido"),
  kgPlasta: z
    .number({ message: "Debe ser un valor numérico" })
    .min(1, "Ingresa un valor válido"),
  kgSobrante: z
    .number({ message: "Debe ser un valor numérico" })
    .min(0, "Ingresa un valor válido")
    .optional(),
  piezasCambioColor: z
    .number({ message: "Debe ser un valor numérico" })
    .min(0, "Ingresa un valor válido")
    .optional(),
  observaciones: z.string().optional()
})

export type AvanceTurno = z.infer<typeof avanceTurnoSchema>
export type RegistrarParo = z.infer<typeof registrarParoSchema>
export type CerrarAvanceForm = z.infer<typeof cerrarAvanceSchema>
export type Turno = typeof turnos[number]
export type SolicitudMaterial = z.infer<typeof solicitudMaterialSchema>
export type SolicitarMaterialForm = z.infer<typeof solicitarMaterialSchema>


export interface TiempoParo extends RegistrarParo {
  id: string
}