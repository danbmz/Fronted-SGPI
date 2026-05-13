export type EstadoMaquina = "activa" | "en mantenimiento" | "inactiva"
export type TipoProceso = "Inyección" | "Soplado"

export interface Maquina {
  id: string
  nombre: string
  codigo: string
  numero: number
  tipoProceso: TipoProceso
  capacidadTon?: number | null | undefined
  estado: EstadoMaquina
  createdAt: string
}

export interface CrearMaquinaDTO {
  nombre: string
  codigo: string
  numero: number
  tipoProceso: TipoProceso
  capacidadTon?: number | null 
}

export interface EditarMaquinaDTO {
  nombre: string
  codigo: string
  numero: number
  tipoProceso: TipoProceso
  capacidadTon?: number | null
}

export interface CambiarEstadoMaquinaDTO {
  estado: EstadoMaquina
  motivo: string
}