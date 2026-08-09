import z from "zod";
import { CATEGORIA_MOTIVO_PARO } from "@/types/enums";

export const crearMotivoParoSchema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres"),
    categoria: z.enum(CATEGORIA_MOTIVO_PARO, {
        message: "La categoría es requerida"
    }),
});

export type CrearMotivoParoInput = z.infer<typeof crearMotivoParoSchema>;

export const editarMotivoParoSchema = crearMotivoParoSchema.omit({categoria: true});

export type EditarMotivoParoInput = z.infer<typeof editarMotivoParoSchema>;

