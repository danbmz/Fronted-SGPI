import { z } from "zod";
import { TIPO_MATERIAL } from "@/types/enums";

export const crearMoliendaSchema = z.object({
  tipoMaterial: z.enum(TIPO_MATERIAL, { message: "Selecciona un material" }),
  colorSolidoId: z.string().min(1, "Selecciona un color"),
  kgIngresados: z
    .number({ message: "Los kilogramos deben ser un valor numérico" })
    .positive("Debe ser mayor a 0"),
  observaciones: z.string().max(300, "Máximo 300 caracteres").optional(),
  avanceTurnoIds: z.array(z.string()),
  incidenciaIds: z.array(z.string()),
}).refine((data) => data.avanceTurnoIds.length > 0 || data.incidenciaIds.length > 0, {
  message: "Selecciona al menos un avance o incidencia para moler",
  path: ["avanceTurnoIds"],
});

export type CrearMoliendaInput = z.infer<typeof crearMoliendaSchema>;

// Quitamos fecha de la validacion pero, lo agregamos en el type porque el back lo requiere para crear la Molienda.
export interface CrearMoliendaPayload extends CrearMoliendaInput {
  fecha: string;
}