import { z } from "zod";

const camposComunes = {
  folio: z.string().min(1, "El folio es requerido").max(50, "El folio no puede exceder 50 caracteres"),
  pedidoDetalleId: z.string().min(1, "Selecciona una línea de pedido"),
  productoId: z.string().min(1, "Selecciona un producto"),
  materiaPrimaId: z.string().min(1, "Selecciona una materia prima"),
  pigmentoId: z.string().min(1, "Selecciona un pigmento"),
  maquinaId: z.string().min(1, "Selecciona una máquina"),
  totalPiezas: z
    .number({ message: "El total de piezas debe ser un valor numérico" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  observaciones: z.string().max(300, "Máximo 300 caracteres").optional(),
  aditivoDescripcion: z.string().max(200, "Máximo 200 caracteres").optional(),
};

export const crearOrdenSchema = z.discriminatedUnion("tipoMaterial", [
  z.object({
    tipoMaterial: z.literal("VIRGEN"),
    ...camposComunes,
  }),
  z.object({
    tipoMaterial: z.literal("MEZCLA_MOLIDO_INTERNO"),
    ...camposComunes,
    inventarioMolidoId: z.string().min(1, "Selecciona el molido a usar"),
    porcentajeVirgen: z
      .number({ message: "El porcentaje debe ser un valor numérico" })
      .min(0, "Mínimo 0")
      .max(100, "Máximo 100"),
    porcentajeMolido: z
      .number({ message: "El porcentaje debe ser un valor numérico" })
      .min(0, "Mínimo 0")
      .max(100, "Máximo 100"),
  }),
  z.object({
    tipoMaterial: z.literal("MEZCLA_RECICLADO"),
    ...camposComunes,
    inventarioMolidoId: z.string().min(1, "Selecciona el molido a usar"),
    porcentajeVirgen: z
      .number({ message: "El porcentaje debe ser un valor numérico" })
      .min(0, "Mínimo 0")
      .max(100, "Máximo 100"),
    porcentajeMolido: z
      .number({ message: "El porcentaje debe ser un valor numérico" })
      .min(0, "Mínimo 0")
      .max(100, "Máximo 100"),
  }),
]);

export type CrearOrdenInput = z.infer<typeof crearOrdenSchema>;

export const cancelarOrdenSchema = z.object({
  motivo: z.string().min(1, "El motivo es requerido").max(300, "Máximo 300 caracteres"),
});

export type CancelarOrdenInput = z.infer<typeof cancelarOrdenSchema>;

export const cambiarEstadoOrdenSchema = z.object({
  motivo: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type CambiarEstadoOrdenInput = z.infer<typeof cambiarEstadoOrdenSchema>;

export const sustituirMaterialPigmentadoSchema = z.object({
  combinacionMaterialPigmentadoId: z.string().min(1, "Selecciona una combinación"),
  kgSustituidos: z
    .number({ message: "Los kilogramos deben ser un valor numérico" })
    .positive("Debe ser mayor a 0"),
});

export type SustituirMaterialPigmentadoInput = z.infer<typeof sustituirMaterialPigmentadoSchema>;