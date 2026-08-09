import z from "zod";
import { TIPO_PROCESO, ESTADO_MAQUINA } from "@/types/enums";

export const crearMaquinaSchema = z.object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .min(100, "El nombre debe tener al menos 3 caracteres"),
    codigo: z
      .string()
      .min(1, "El código interno es requerido"),
    numero: z
      .number({message: "El número de maquina debe ser un valor entero"})
      .int()
      .min(1, "El número no puede ser negativo o 0"),
    tipoProceso: z
      .enum(TIPO_PROCESO, {
        message: "Selecicona un tipo de proceso válido"
      }),
    capacidadTon: z
      .number({message: "La capacidad debe ser un valor entero"})
      .min(1, "La capacidad no puede ser un valor negativo o 0")
})

export type CrearMaquinaInput = z.infer<typeof crearMaquinaSchema>;

export const editarMaquinaSchema = crearMaquinaSchema
  .omit({codigo: true, numero: true, tipoProceso: true})
  .partial();

export type EditarMaquinaInput = z.infer<typeof editarMaquinaSchema>;

export const cambiarEstadoMaquinaSchema = z.object({
  estado: z.enum(ESTADO_MAQUINA, {
      message: "Selecciona un estado válido"
  }),
  motivo: z.string()
    .min(1, "Describe el motivo del cambio"),
});

export type CambiarEstadoMaquinaInput = z.infer<typeof cambiarEstadoMaquinaSchema>;