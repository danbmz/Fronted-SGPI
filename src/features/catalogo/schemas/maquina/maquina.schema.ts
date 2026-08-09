import z from "zod";
import { TIPO_PROCESO, ESTADO_MAQUINA } from "@/types/enums";

export const maquinaSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    codigo: z.string(),
    numero: z.number().int(),
    tipoProceso: z.enum(TIPO_PROCESO),
    capacidadTon: z.number(),
    estado: z.enum(ESTADO_MAQUINA),
})

export type Maquina = z.infer<typeof maquinaSchema>;

export const listaMaquinaSchema = z.array(maquinaSchema);