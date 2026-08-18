const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/pedidos": "Pedidos",
  "/admin/pedidos/:id": "Detalles del pedido",
  "/admin/ordenes": "Órdenes",
  "/admin/ordenes/:id": "Detalles de la orden",
  "/admin/avances-turno": "Avances de turno",
  "/admin/avances-turno/:id": "Detalles del avance",
  "/admin/tiempos-paro": "Tiempos paro",
  "/admin/molino": "Molino",
  "/admin/materias-primas": "Materias primas",
  "/admin/molido": "Material molido",
  "/admin/pigmentos": "Pigmentos",
  "/admin/producto-terminado": "Producto terminado",
  "/admin/historial-inventario": "Historial de movimientos",
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
  "/programador/pedidos": "Pedidos",
  "/programador/pedidos/:id": "Detalles del pedido",
  "/programador/ordenes": "Órdenes",
  "/programador/ordenes/:id": "Detalles de la orden",
  "/supervisor/ordenes": "Órdenes",
  "/supervisor/ordenes/:id": "Detalles de la orden",
  "/supervisor/avances": "Avances de turno",
  "/supervisor/avances/:id": "Detalles del avance",
  "/molino/pendientes": "Pendientes por Moler",
  "/molino/registrar": "Registrar Molienda",
  "/molino/historial": "Moliendas",
  "/pigmentos/ordenes": "Órdenes",
  "/pigmentos/ordenes/:id": "Detalles de la orden",
  "/pigmentos/alertas": "Alertas",
  "/pigmentos/materias-primas": "Materias primas",
  "/pigmentos/molido": "Molido",
  "/pigmentos/pigmentos": "Pigmentos",
  "/pigmentos/historial-inventario": "Historial",
}

export function getPageTitle(pathname: string): string {
  // Primero, intenta coincidencia exacta (rutas sin parámetros)
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Si no hay coincidencia exacta, busca un patrón con :id que calce
  for (const [patron, titulo] of Object.entries(pageTitles)) {
    if (!patron.includes(":")) continue; // solo nos interesan los patrones con parámetro

    const regex = new RegExp("^" + patron.replace(/:[^/]+/g, "[^/]+") + "$");
    if (regex.test(pathname)) return titulo;
  }

  return "Sistema"; // valor por defecto si nada coincide

}