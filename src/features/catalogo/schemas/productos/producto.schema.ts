import z from "zod";
import { TIPO_MATERIAL } from "@/types/enums";

export const productoSchema = z.object({
    id: z.string(),
    codigo: z.string(),
    nombre: z.string(),
    tipo: z.string(),
    cavidades: z.number().int(),
    ciclo: z.number().int(),
    peso: z.number(),
    piezasPorEmpaque: z.number().int(),
    precio: z.number(),
    descripcion: z.string(),
    tipoMaterial: z.enum(TIPO_MATERIAL),
    activo: z.boolean(),
})

export type Producto = z.infer<typeof productoSchema>;

export const listaProductoSchema = z.array(productoSchema);