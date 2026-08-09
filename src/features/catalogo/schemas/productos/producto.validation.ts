import z from "zod";
import { TIPO_MATERIAL } from "@/types/enums";

export const crearProductoSchema = z.object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido"),
    codigo: z
      .string()
      .regex(/^0750\d{10}$/, "El código debe tener 14 dígitos y comenzar con 0750"),
    tipo: z
      .string()
      .min(1, "El tipo de producto es requerido"),
    tipoMaterial: z.enum(TIPO_MATERIAL, {
        message: "Selecciona un tipo de material válido"
    }),
    cavidades: z
      .number({message: "El número de cavidades debe ser un valor numérico"})
      .int()
      .min(1, "El número no puede ser negativo o 0"),
    ciclo: z
      .number({message: "El valor del ciclo debe ser número"})
      .int()
      .min(1, "El número no puede ser negativo o 0"),
    peso: z
      .number({message: "El peso del producto debe ser un valor numérico"})
      .min(1, "El número no puede ser negativo o 0"),
    piezasPorEmpaque: z
      .number({message: "El número del piezas debe ser un valor numérico"})
      .int()
      .min(1, "El número no puede ser negativo o 0"),
    precio: z
      .number({message: "El precio debe ser un valor numérico"})
      .min(1, "El número no puede ser negativo o 0"),
    descripcion: z
      .string()
      .min(1, "La descripción es requerida")
      .min(3, "Agrega una descripción más explicita"),
});

export type CrearProductoInput = z.infer<typeof crearProductoSchema>;

export const editarProductoSchema = crearProductoSchema
  .omit({codigo: true, tipoMaterial: true})
  .partial();

export type EditarProductoInput = z.infer<typeof editarProductoSchema>;