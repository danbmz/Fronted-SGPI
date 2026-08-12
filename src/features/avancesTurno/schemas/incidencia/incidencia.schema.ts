import { z } from "zod";
import { DESTINO_PIEZAS, TIPO_MATERIAL_SOLICITUD } from "@/types/enums";

export const incidenciaSchema = z.object({
  id: z.string(),
  avanceTurnoId: z.string(),
  piezasAfectadas: z.int(),
  destino: z.enum(DESTINO_PIEZAS),
  confirmadoMolino: z.boolean().nullable(),
  resuelto: z.boolean(),
  tipoMaterialAgregado: z.enum(TIPO_MATERIAL_SOLICITUD).nullable(),
  kgMaterialAgregado: z.number().nullable(),
  gramosPigmentoAgregado: z.number().nullable(),
});

export type Incidencia = z.infer<typeof incidenciaSchema>;

export const listaIncidenciaSchema = z.array(incidenciaSchema);