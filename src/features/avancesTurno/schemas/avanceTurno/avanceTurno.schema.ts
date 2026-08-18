import { z } from "zod";
import { TURNO_TRABAJO, ESTADO_AVANCE_TURNO, TIPO_MATERIAL_SOLICITUD, TIPO_MATERIAL } from "@/types/enums";

export const avanceTurnoSchema = z.object({
  id: z.string(),
  ordenId: z.string(),
  ordenFolio: z.string(),
  ordenProductoNombre: z.string(),
  ordenPigmentoColor: z.string(),
  ordenMaquinaNombre: z.string(),
  ordenTotalPiezas: z.int(),
  ordenPiezasProducidas: z.int(),
  ordenTipoMaterial: z.enum(TIPO_MATERIAL),
  supervisorId: z.string(),
  supervisorNombre: z.string(),
  turno: z.enum(TURNO_TRABAJO),
  fecha: z.string(),
  horaInicio: z.string(),
  horaFin: z.string().nullable(),
  estado: z.enum(ESTADO_AVANCE_TURNO),
  piezasBuenas: z.int(),
  piezasDefectuosas: z.int(),
  defectoId: z.string().nullable(),
  defectoNombre: z.string().nullable(),
  cicloReal: z.int().nullable(),
  materialKG: z.number().nullable(),
  kgMerma: z.number(),
  kgPlasta: z.number(),
  operadorId: z.string(),
  operadorNombre: z.string(),
  piezasCambioColor: z.int(),
  kgSobrante: z.number().nullable(),
  sobranteConfirmado: z.boolean(),
  tipoMaterialSobrante: z.enum(TIPO_MATERIAL_SOLICITUD).nullable(),
  confirmacionMolinoConfirmado: z.boolean().nullable(),
  observaciones: z.string().nullable(),
});

export type AvanceTurno = z.infer<typeof avanceTurnoSchema>;

export const listaAvanceTurnoSchema = z.array(avanceTurnoSchema);