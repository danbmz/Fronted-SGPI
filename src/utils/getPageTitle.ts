// src/utils/getPageTitle.ts
const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/ordenes": "Órdenes",
  "/admin/avances-turno": "Avances de turno",
  "/admin/tiempos-paro": "Tiempos paro",
  "/admin/molino": "Molino",
  "/admin/materias-primas": "Materias primas",
  "/admin/pigmentos": "Pigmentos",
  "/admin/producto-terminado": "Producto terminado",
  "/admin/productos": "Productos",
  "/admin/maquinas": "Máquinas",
  "/admin/operadores": "Operadores",
  "/admin/formulas-pigmentos": "Fórmulas de pigmentos",
  "/admin/reportes": "Reportes",
  "/admin/usuarios": "Gestión de usuarios",
  "/admin/auditoria": "Auditoría",
  "/supervisor/dashboard": "Dashboard",
  "/supervisor/ordenes": "Órdenes",
  "/supervisor/avances-turno": "Avances de turno",
  "/supervisor/tiempos-paro": "Tiempos paro",
  "/supervisor/molino": "Molino",
}

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "Dashboard"
}