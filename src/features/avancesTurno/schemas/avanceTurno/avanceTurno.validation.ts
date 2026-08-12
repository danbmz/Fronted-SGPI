import { z } from "zod";
import { TURNO_TRABAJO, TIPO_MATERIAL_SOLICITUD } from "@/types/enums";

export const crearAvanceTurnoSchema = z.object({
  ordenId: z.string().min(1, "Selecciona una orden"),
  turno: z.enum(TURNO_TRABAJO, { message: "Selecciona un turno" }),
  fecha: z.string().min(1, "La fecha es requerida"),
  horaInicio: z.string().min(1, "La hora de inicio es requerida"),
});

export type CrearAvanceTurnoInput = z.infer<typeof crearAvanceTurnoSchema>;

export const actualizarAvanceTurnoSchema = z.object({
  piezasBuenas: z.number().int().min(0).optional(),
  piezasDefectuosas: z.number().int().min(0).optional(),
  kgMerma: z.number().min(0).optional(),
  kgPlasta: z.number().min(0).optional(),
  piezasCambioColor: z.number().int().min(0).optional(),
  kgSobrante: z.number().min(0).optional(),
  tipoMaterialSobrante: z.enum(TIPO_MATERIAL_SOLICITUD).optional(),
  defectoId: z.string().optional(),
  descripcionOtro: z.string().max(300, "Máximo 300 caracteres").optional(),
  operadorId: z.string().optional(),
  cicloReal: z.number().int().positive("Debe ser mayor a 0").optional(),
  materialKG: z.number().min(0).optional(),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type ActualizarAvanceTurnoInput = z.infer<typeof actualizarAvanceTurnoSchema>;

export const cerrarAvanceTurnoSchema = z
  .object({
    horaFin: z.string().min(1, "La hora de fin es requerida"),
    piezasBuenas: z
      .number({ message: "Las piezas buenas deben ser un valor numérico" })
      .int("Debe ser un número entero")
      .positive("Debe ser mayor a 0"),
    piezasDefectuosas: z
      .number({ message: "Las piezas defectuosas deben ser un valor numérico" })
      .int("Debe ser un número entero")
      .min(0, "No puede ser negativo"),
    kgMerma: z
      .number({ message: "Los kg de merma deben ser un valor numérico" })
      .min(0, "No puede ser negativo"),
    kgPlasta: z
      .number({ message: "Los kg de plasta deben ser un valor numérico" })
      .min(0, "No puede ser negativo"),
    operadorId: z.string().min(1, "Selecciona un operador"),
    cicloReal: z
      .number({ message: "El ciclo real debe ser un valor numérico" })
      .int("Debe ser un número entero")
      .positive("Debe ser mayor a 0"),
    materialKG: z
      .number({ message: "El material usado debe ser un valor numérico" })
      .min(0, "No puede ser negativo"),
    piezasCambioColor: z.number().int().min(0).optional(),
    kgSobrante: z.number().min(0).optional(),
    tipoMaterialSobrante: z.enum(TIPO_MATERIAL_SOLICITUD).optional(),
    defectoId: z.string().optional(),
    descripcionOtro: z.string().max(300, "Máximo 300 caracteres").optional(),
    observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),
  })
  .refine((data) => !data.kgSobrante || data.kgSobrante <= 0 || data.tipoMaterialSobrante !== undefined, {
    message: "Debes indicar el tipo de material sobrante",
    path: ["tipoMaterialSobrante"],
  });

export type CerrarAvanceTurnoInput = z.infer<typeof cerrarAvanceTurnoSchema>;

export const confirmarMolinoSchema = z.object({
  kgMermaRecibida: z.number({ message: "Debe ser un valor numérico" }).min(0, "No puede ser negativo"),
  kgPlastaRecibida: z.number({ message: "Debe ser un valor numérico" }).min(0, "No puede ser negativo"),
  piezasMalasRecibidas: z.number({ message: "Debe ser un valor numérico" }).int().min(0, "No puede ser negativo"),
  piezasCambioColorRecibidas: z.number({ message: "Debe ser un valor numérico" }).int().min(0, "No puede ser negativo"),
});

export type ConfirmarMolinoInput = z.infer<typeof confirmarMolinoSchema>;

export const confirmarSobranteSchema = z.object({
  confirmado: z.boolean(),
});

export type ConfirmarSobranteInput = z.infer<typeof confirmarSobranteSchema>;