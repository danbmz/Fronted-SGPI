// src/lib/exportarExcel.ts
import * as XLSX from "xlsx"
import type { ReporteOrden } from "@/features/reportes/services/reportesService"

export const exportarReporteOrdenes = (
  ordenes: ReporteOrden[],
  periodo: string
) => {
  const filas = ordenes.map(o => ({
    "Folio": o.folio,
    "Fecha": new Date(o.fechaCreacion).toLocaleDateString("es-MX"),
    "Producto": o.producto,
    "Estado": o.estado,
    "Material (kg)": o.materiaPrimaTotalKg,
    "Pigmento (gr)": o.pigmentoRequeridoGr,
    "Piezas planeadas": o.totalPiezas,
    "Piezas producidas": o.piezasProducidas,
    "% Cumplimiento": `${o.cumplimiento}%`,
    "Cliente": o.clienteDestino
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)

  // Ancho de columnas
  hoja["!cols"] = [
    { wch: 14 }, // Folio
    { wch: 12 }, // Fecha
    { wch: 20 }, // Producto
    { wch: 12 }, // Estado
    { wch: 14 }, // Material
    { wch: 14 }, // Pigmento
    { wch: 18 }, // Piezas planeadas
    { wch: 18 }, // Piezas producidas
    { wch: 16 }, // % Cumplimiento
    { wch: 16 }, // Cliente
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, "Órdenes completadas")
  XLSX.writeFile(libro, `Reporte_Ordenes_${periodo}.xlsx`)
}