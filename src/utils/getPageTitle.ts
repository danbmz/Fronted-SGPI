// src/utils/getPageTitle.ts
const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/ordenes": "Órdenes",
  "/admin/tiempos-paro": "Tiempos paro",
  "/admin/molino": "Molino",
  "/admin/materias-primas": "Materias primas",
  "/admin/pigmentos": "Pigmentos",
  "/admin/producto-terminado": "Producto terminado",
  "/admin/productos": "Productos",
  "/admin/maquinas": "Máquinas",
  "/admin/operadores": "Operadores",
  "/admin/formulas-pigmentos": "Fórmulas de pigmentos",
  "/admin/materia-prima-catalogo": "Materias primas",
  "/admin/pigmentos-catalogo": "Pigmentos",
  "/admin/motivos-paro": "Motivos de paro",
  "/admin/reportes": "Reportes",
  "/admin/usuarios": "Gestión de usuarios",
  "/admin/auditoria": "Auditoría",
  "/supervisor/ordenes": "Órdenes",
  "/supervisor/avances": "Avances de turno",
  "/supervisor/molino": "Envios a molino",
  "/molino/pendientes": "Pendientes por Moler",
  "/molino/registrar": "Registrar Molienda",
  "/molino/historial": "Historial",
  "/pigmentos/ordenes": "Órdenes",
  "/pigmentos/alertas": "Alertas",
  "/pigmentos/formulas": "Formulas de pigmentos",
}

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "Dashboard"
}