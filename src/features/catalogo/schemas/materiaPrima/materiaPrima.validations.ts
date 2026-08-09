import { z } from "zod";
import { TIPO_MATERIAL, UNIDAD_MEDIDA } from "@/types/enums";

// ---------- Schema del FORMULARIO de crear (con mensajes, para el usuario) ----------

export const crearMateriaPrimaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  codigoInterno: z
    .string()
    .min(1, "El código interno es requerido"),
  tipo: z.enum(TIPO_MATERIAL, {
    message: "Selecciona un tipo válido",
  }),
  proveedor: z.string().min(1, "El proveedor es requerido").optional(),
  unidadMedida: z.enum(UNIDAD_MEDIDA, {
    message: "Selecciona una unidad de medida válida",
  }),
  costoUnitario: z
    .number({ message: "El costo debe ser un valor numérico" })
    .min(0, "El costo no puede ser negativo")
    .optional(),
  stockMinimo: z
    .number({ message: "El stock mínimo debe ser un valor numérico" })
    .min(0, "El stock mínimo no puede ser negativo"),
  stockActual: z
    .number({message: "El stock actual debe ser un valor numérico"})
    .min(0, "El stock actual no puede ser negativo")
});

export type CrearMateriaPrimaInput = z.infer<typeof crearMateriaPrimaSchema>;

export const editarMateriaPrimaSchema = crearMateriaPrimaSchema
  .omit({ tipo: true, codigoInterno: true, unidadMedida: true, stockActual: true })
  .partial();

export type EditarMateriaPrimaInput = z.infer<typeof editarMateriaPrimaSchema>;