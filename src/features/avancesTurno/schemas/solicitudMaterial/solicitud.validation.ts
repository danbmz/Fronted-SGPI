import { z } from "zod";
import { TIPO_MATERIAL_SOLICITUD } from "@/types/enums";

export const crearSolicitudMaterialSchema = z.object({
  tipoMaterial: z.enum(TIPO_MATERIAL_SOLICITUD, { message: "Selecciona un tipo de material" }),
  kgSolicitados: z
    .number({ message: "Los kilogramos deben ser un valor numérico" })
    .positive("Debe ser mayor a 0"),
  motivo: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type CrearSolicitudMaterialInput = z.infer<typeof crearSolicitudMaterialSchema>;