const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/pedidos": "Pedidos",
  "/admin/ordenes": "Órdenes",
  "/admin/tiempos-paro": "Tiempos paro",
  "/admin/molino": "Molino",
  "/admin/materias-primas": "Materias primas",
  "/admin/molido": "Material Molido",
  "/admin/pigmentos": "Pigmentos",
  "/admin/producto-terminado": "Producto terminado",
  "/admin/productos": "Productos",
  "/admin/maquinas": "Máquinas",
  "/admin/operadores": "Operadores",
  "/admin/materia-prima-catalogo": "Materias primas",
  "/admin/pigmentos-catalogo": "Pigmentos",
  "/admin/motivos-paro": "Motivos de paro",
  "/admin/colores-solidos": "Colores sólidos",
  "/admin/defectos-productos": "Defectos de producto",
  "/admin/reportes": "Reportes",
  "/admin/usuarios": "Gestión de usuarios",
  "/admin/auditoria": "Auditoría",
  "/supervisor/ordenes": "Órdenes",
  "/supervisor/avances": "Avances de turno",
  "/molino/pendientes": "Pendientes por Moler",
  "/molino/registrar": "Registrar Molienda",
  "/pigmentos/ordenes": "Órdenes",
  "/pigmentos/alertas": "Alertas",
}

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "Dashboard"
}