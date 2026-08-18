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

// ------ Validacion robusta (debe incluir material+tipo o pigmento, o los 3).
export const resolverIncidenciaSchema = z
  .object({
    tipoMaterialAgregado: z.enum(TIPO_MATERIAL_SOLICITUD).optional(),
    kgMaterialAgregado: z.number().min(0, "No puede ser negativo"),
    gramosPigmentoAgregado: z.number().min(0, "No puede ser negativo"),
  })
  .refine(
    (data) => (data.tipoMaterialAgregado !== undefined) === (data.kgMaterialAgregado > 0),
    {
      message: "Si seleccionas un material, indica los kilogramos (y viceversa)",
      path: ["kgMaterialAgregado"],
    }
  )
  .refine(
    (data) =>
      (data.tipoMaterialAgregado !== undefined && data.kgMaterialAgregado > 0) ||
      data.gramosPigmentoAgregado > 0,
    {
      message: "Indica al menos el material usado o el pigmento agregado",
      path: ["gramosPigmentoAgregado"],
    }
  );

export type ResolverIncidenciaInput = z.infer<typeof resolverIncidenciaSchema>;