import { z } from "zod"
import { categoriasColor, tiposPigmento } from "./../catalogo/pigmentosValidations"

// ── Materia Prima ────────────────────────────────────────────────
const tiposMateriaPrima = ["Polipropileno", "Poliestireno-Cristal"] as const
const subtipos = ["virgen", "reciclado"] as const

export const inventarioMateriaPrimaSchema = z.object({
  id: z.string(),
  stockActual: z.number(),
  stockMinimo: z.number(),
  ultimoMovimiento: z.string(),
  nombre: z.string(),
  codigoInterno: z.string(),
  tipo: z.enum(tiposMateriaPrima),
  subtipo: z.enum(subtipos)
})

// ── Pigmento ─────────────────────────────────────────────────────
export const inventarioPigmentoSchema = z.object({
  id: z.string(),
  stockActual: z.number(),
  stockMinimo: z.number(),
  ultimoMovimiento: z.string(),
  color: z.string(),
  categoriaColor: z.enum(categoriasColor),
  tipo: z.enum(tiposPigmento),
  aplicacion: z.string()
})

// ── Producto Terminado ───────────────────────────────────────────
export const inventarioProductoTerminadoSchema = z.object({
  id: z.string(),
  stockActual: z.number(),
  stockMinimo: z.number(),
  ultimoMovimiento: z.string(),
  nombre: z.string(),
  codigoBarras: z.string(),
  tipo: z.string(),
  color: z.string(),
  ubicacion: z.string()
})

// ── Molido ───────────────────────────────────────────────────────
export const inventarioMolidoSchema = z.object({
  id: z.string(),
  stockActual: z.number(),
  colorAproximado: z.string(),
  ultimaEntrada: z.string(),
  ordenOrigen: z.string().nullable(),
  observaciones: z.string(),
  materialBase: z.string(),
  codigoInterno: z.string()
})

// ── Ajuste Manual ────────────────────────────────────────────────
export const ajusteManualSchema = z.object({
  stockNuevo: z
    .number({ message: "El stock debe ser un valor numérico" })
    .min(0, "El stock no puede ser negativo"),
  motivo: z
    .string()
    .min(1, "El motivo es requerido")
    .min(10, "El motivo debe tener al menos 10 caracteres")
})

// ── Tipos inferidos ──────────────────────────────────────────────
export type InventarioMateriaPrima = z.infer<typeof inventarioMateriaPrimaSchema>
export type InventarioMolido = z.infer<typeof inventarioMolidoSchema>
export type InventarioPigmento = z.infer<typeof inventarioPigmentoSchema>
export type InventarioProductoTerminado = z.infer<typeof inventarioProductoTerminadoSchema>
export type AjusteManualForm = z.infer<typeof ajusteManualSchema>