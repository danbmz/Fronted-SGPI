import z from "zod";
import { CATEGORIA_MOTIVO_PARO } from "@/types/enums";

export const motivoParoSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    categoria: z.enum(CATEGORIA_MOTIVO_PARO),
    activo: z.boolean(),
});

export type MotivoParo = z.infer<typeof motivoParoSchema>;

export const listaMotivoParo = z.array(motivoParoSchema);