export interface AuditLog {
  id: number
  usuario: string
  nombre: string
  modulo: "auth" | "usuarios" | "inventario" | "ordenes" | "molino" | "catalogos" | "pigmentos"
  accion: string
  entidad?: string | null
  entidadId?: string | number | null
  detalle?: string
  fecha: string
  ip: string
}