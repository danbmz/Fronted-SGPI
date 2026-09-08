import { z } from "zod";
import { TIPO_MATERIAL } from "@/types/enums";

export const avancePendienteSchema = z.object({
  id: z.string(),
  ordenFolio: z.string(),
  ordenTipoMaterial: z.enum(TIPO_MATERIAL),  
  pigmentoColor: z.string(),
  kgMerma: z.number(),
  kgPlasta: z.number(),
  piezasDefectuosas: z.int(),
  piezasCambioColor: z.int(),
});

export type AvancePendiente = z.infer<typeof avancePendienteSchema>;

export const incidenciaPendienteSchema = z.object({
  id: z.string(),
  ordenFolio: z.string(),
  ordenTipoMaterial: z.enum(TIPO_MATERIAL), 
  pigmentoColor: z.string(),
  piezasAfectadas: z.int(),
});

export type IncidenciaPendiente = z.infer<typeof incidenciaPendienteSchema>;

export const pendientesSchema = z.object({
  avances: z.array(avancePendienteSchema),
  incidencias: z.array(incidenciaPendienteSchema),
});

export type Pendientes = z.infer<typeof pendientesSchema>;

export const moliendaSchema = z.object({
  id: z.string(),
  tipoMaterial: z.enum(TIPO_MATERIAL),
  colorSolidoId: z.string(),
  colorSolidoNombre: z.string(),
  kgIngresados: z.number(),
  fecha: z.string(),
  observaciones: z.string().nullable(),
  totalAvances: z.int(),
  totalIncidencias: z.int(),
  createdAt: z.string(),
});

export type Molienda = z.infer<typeof moliendaSchema>;

export const listaMoliendaSchema = z.array(moliendaSchema);