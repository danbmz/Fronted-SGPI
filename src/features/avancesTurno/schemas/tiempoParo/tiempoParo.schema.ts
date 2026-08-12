import { z } from "zod";

export const tiempoParoSchema = z.object({
  id: z.string(),
  avanceTurnoId: z.string(),
  motivoParoId: z.string(),
  motivoParoNombre: z.string(),
  minutos: z.int(),
  observaciones: z.string().nullable(),
});

export type TiempoParo = z.infer<typeof tiempoParoSchema>;

export const listaTiempoParoSchema = z.array(tiempoParoSchema);