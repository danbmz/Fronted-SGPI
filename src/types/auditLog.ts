export interface AuditLog {
  id: number
  usuario: string
  nombre: string
  modulo: "auth" | "usuarios" | "inventario" | "ordenes" | "molino" | "catalogos"
  accion: string
  entidad?: string | null
  entidadId?: string | number | null
  detalle?: string
  fecha: string
  ip: string
}