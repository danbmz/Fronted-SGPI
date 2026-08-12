import { z } from "zod";
import { DESTINO_PIEZAS, TIPO_MATERIAL_SOLICITUD } from "@/types/enums";

export const crearIncidenciaSchema = z.object({
  piezasAfectadas: z
    .number({ message: "Las piezas afectadas deben ser un valor numérico" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  destino: z.enum(DESTINO_PIEZAS, { message: "Selecciona un destino" }),
});

export type CrearIncidenciaInput = z.infer<typeof crearIncidenciaSchema>;

export const confirmarIncidenciaMolinoSchema = z.object({
  confirmado: z.boolean(),
});

export type ConfirmarIncidenciaMolinoInput = z.infer<typeof confirmarIncidenciaMolinoSchema>;

export const resolverIncidenciaSchema = z.object({
  tipoMaterialAgregado: z.enum(TIPO_MATERIAL_SOLICITUD).optional(),
  kgMaterialAgregado: z.number().positive("Debe ser mayor a 0").optional(),
  gramosPigmentoAgregado: z.number().positive("Debe ser mayor a 0").optional(),
});

export type ResolverIncidenciaInput = z.infer<typeof resolverIncidenciaSchema>;