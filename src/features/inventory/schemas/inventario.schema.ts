import { z } from "zod";
import { TIPO_INVENTARIO, ORIGEN_MOLIDO } from "@/types/enums";

export const inventarioMateriaPrimaItemSchema = z.object({
  materiaPrimaId: z.string(),
  nombre: z.string(),
  codigoInterno: z.string(),
  unidadMedida: z.string(),
  cantidadActual: z.number(),
  stockMinimo: z.number(),
});
export type InventarioMateriaPrimaItem = z.infer<typeof inventarioMateriaPrimaItemSchema>;
export const listaInventarioMateriaPrimaSchema = z.array(inventarioMateriaPrimaItemSchema);

export const inventarioPigmentoItemSchema = z.object({
  pigmentoId: z.string(),
  color: z.string(),
  categoriaColor: z.string(),
  tipo: z.string(),
  materiaPrimaNombre: z.string(),
  cantidadActual: z.number(),
  stockMinimo: z.number(),
});
export type InventarioPigmentoItem = z.infer<typeof inventarioPigmentoItemSchema>;
export const listaInventarioPigmentoSchema = z.array(inventarioPigmentoItemSchema);

export const inventarioProductoItemSchema = z.object({
  productoId: z.string(),
  productoNombre: z.string(),
  pigmentoId: z.string(),
  color: z.string(),
  categoriaColor: z.string(),
  cantidadActual: z.number(),
});
export type InventarioProductoItem = z.infer<typeof inventarioProductoItemSchema>;
export const listaInventarioProductoSchema = z.array(inventarioProductoItemSchema);

export const inventarioMolidoItemSchema = z.object({
  id: z.string(),
  materiaPrimaId: z.string(),
  materiaPrimaNombre: z.string(),
  origen: z.enum(ORIGEN_MOLIDO),
  colorSolidoId: z.string(),
  colorSolidoNombre: z.string(),
  cantidadActual: z.number(),
});
export type InventarioMolidoItem = z.infer<typeof inventarioMolidoItemSchema>;
export const listaInventarioMolidoSchema = z.array(inventarioMolidoItemSchema);

export const inventarioMaterialPigmentadoItemSchema = z.object({
  combinacionId: z.string(),
  materiaPrimaNombre: z.string(),
  pigmentoColor: z.string(),
  pigmentoCategoria: z.string(),
  cantidadActual: z.number(),
});
export type InventarioMaterialPigmentadoItem = z.infer<typeof inventarioMaterialPigmentadoItemSchema>;
export const listaInventarioMaterialPigmentadoSchema = z.array(inventarioMaterialPigmentadoItemSchema);

export const movimientoSchema = z.object({
  id: z.string(),
  tipoInventario: z.enum(TIPO_INVENTARIO),
  tipoMovimiento: z.string(),
  motivo: z.string(),
  descripcion: z.string().nullable(),
  cantidadAnterior: z.number(),
  cantidadMovimiento: z.number(),
  cantidadNueva: z.number(),
  unidadMedida: z.string(),
  usuarioNombre: z.string(),
  createdAt: z.string(),
});
export type Movimiento = z.infer<typeof movimientoSchema>;
export const listaMovimientosSchema = z.array(movimientoSchema);