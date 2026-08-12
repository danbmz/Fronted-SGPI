import { z } from "zod";
import { TIPO_MATERIAL_SOLICITUD, TIPO_MATERIAL } from "@/types/enums";

export const solicitudMaterialSchema = z.object({
  id: z.string(),
  avanceTurnoId: z.string(),
  tipoMaterial: z.enum(TIPO_MATERIAL_SOLICITUD),
  kgSolicitados: z.number(),
  motivo: z.string(),
  confirmado: z.boolean(),
  confirmadoPorNombre: z.string().nullable(),
  confirmadoEn: z.string().nullable(),
  tipoMaterialCategoria: z.enum(TIPO_MATERIAL),
  pigmentoColor: z.string().nullable(),
  colorSolidoNombre: z.string().nullable(),
});

export type SolicitudMaterial = z.infer<typeof solicitudMaterialSchema>;

export const listaSolicitudMaterialSchema = z.array(solicitudMaterialSchema);