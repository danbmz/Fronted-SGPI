export interface Operador {
  id: string
  nombre: string
  numeroEmpleado: string
  turnoHabitual: "Mañana" | "Tarde" | "Noche"
  area: string
  activo: boolean
  createdAt: string
}

export interface CrearOperadorDTO {
  nombre: string
  numeroEmpleado: string
  turnoHabitual: "Mañana" | "Tarde" | "Noche"
  area: string
}

export interface EditarOperadorDTO {
  nombre: string
  numeroEmpleado: string
  turnoHabitual: "Mañana" | "Tarde" | "Noche"
  area: string
}