export interface MotivoParo {
  id: string
  nombre: string
  activo: boolean
}

export interface CrearMotivoParoDTO {
  nombre: string
}

export interface EditarMotivoParoDTO {
  nombre: string
}