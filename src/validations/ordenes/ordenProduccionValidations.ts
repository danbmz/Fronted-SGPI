import { z } from "zod"

export const estadosOrden = [
  "borrador",
  "activa",
  "en_progreso",
  "pausada",
  "completada",
  "cancelada"
] as const

export const tiposMaterial = ["virgen", "mezcla"] as const

// Productos que usan mezcla con sus porcentajes fijos
export const MEZCLA_CONFIG: Record<string, { virgen: number; molido: number }> = {
  "Cubeta":    { virgen: 25, molido: 75 },
  "Palangana": { virgen: 25, molido: 75 },
  "Batidor":   { virgen: 70, molido: 30 },
  "Colador":   { virgen: 40, molido: 60 }
}

// Paso 1 — Producto
export const paso1Schema = z.object({
  productoId: z.string().min(1, "Selecciona un producto"),
  producto: z.string().min(1, "El producto es requerido"),
  codigoBarras: z.string(),
  color: z.string().min(1, "El color es requerido"),
  pesoUnitarioGr: z
    .number({ message: "El peso debe ser un valor numérico" })
    .positive("El peso debe ser mayor a 0"),
  totalPiezas: z
    .number({ message: "El total de piezas debe ser un valor numérico" })
    .int("El total debe ser un número entero")
    .positive("El total debe ser mayor a 0"),
  clienteDestino: z.string().min(1, "El cliente o destino es requerido"),
  remision: z.string().optional(),
  observaciones: z.string().optional()
})

// Paso 2 — Materiales
export const paso2Schema = z.object({
  tipoMaterial: z.enum(tiposMaterial, {
    message: "Selecciona un tipo de material válido"
  }),
  materiaPrimaId: z.string().min(1, "Selecciona un material"),
  materiaPrima: z.string(),
  molidoId: z.string().nullable(),
  molidoNombre: z.string().nullable(),
  porcentajeVirgen: z.number(),
  porcentajeMolido: z.number(),
  pigmentoId: z.string().min(1, "Selecciona un pigmento"),
  pigmento: z.string(),
  categoriaPigmento: z.string(),
  tipoPigmento: z.string(),
  aditivoId: z.string().nullable(),
  aditivo: z.string().nullable()
})

// Paso 3 — Producción
export const paso3Schema = z.object({
  maquinaId: z.string().min(1, "Selecciona una máquina"),
  maquina: z.string(),
  numeroMaquina: z.number(),
  proceso: z.string(),
  cavidades: z
    .number({ message: "Las cavidades deben ser un valor numérico" })
    .int()
    .positive("Las cavidades deben ser mayor a 0"),
  cicloEstandarSeg: z
    .number({ message: "El ciclo debe ser un valor numérico" })
    .positive("El ciclo debe ser mayor a 0"),
  operadores: z
    .array(z.object({
      id: z.string(),
      nombre: z.string(),
      numeroEmpleado: z.string()
    }))
    .min(1, "Asigna al menos un operador")
})

// Tipos inferidos
export type Paso1Form = z.infer<typeof paso1Schema>
export type Paso2Form = z.infer<typeof paso2Schema>
export type Paso3Form = z.infer<typeof paso3Schema>
export type EstadoOrden = typeof estadosOrden[number]
export type TipoMaterial = typeof tiposMaterial[number]

// Tipo completo de una orden
export interface OrdenProduccion {
  id: string
  folio: string
  estado: EstadoOrden
  fechaCreacion: string
  stockInsuficiente?: boolean
  alertasStock?: { tipo: string; nombre: string; requerido: number; disponible: number }[]
  // Paso 1
  productoId: string
  producto: string
  codigoBarras: string
  color: string
  pesoUnitarioGr: number
  totalPiezas: number
  clienteDestino: string
  remision?: string | null
  observaciones?: string | null
  // Paso 2
  tipoMaterial: TipoMaterial
  materiaPrimaId: string
  materiaPrima: string
  molidoId: string | null
  molidoNombre: string | null
  porcentajeVirgen: number
  porcentajeMolido: number
  pigmentoId: string
  pigmento: string
  categoriaPigmento: string
  tipoPigmento: string
  aditivoId: string | null
  aditivo: string | null
  // Paso 3
  maquinaId: string
  maquina: string
  numeroMaquina: number
  proceso: string
  cavidades: number
  cicloEstandarSeg: number
  operadores: { id: string; nombre: string; numeroEmpleado: string }[]
  // Calculados
  piezasPorHora: number
  piezasPorTurno: number
  piezasPorDia: number
  tiempoEstimadoHrs: number
  materiaPrimaTotalKg: number
  pigmentoRequeridoKg: number
}