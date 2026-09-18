import * as XLSX from "xlsx";
import type { Reportes } from "@/features/reportes/schemas/reportes.schema";

export function exportarTodoAExcel(data: Reportes, fechaDesde: string, fechaHasta: string) {
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Producción
  const hojaProduccion = XLSX.utils.json_to_sheet(
    data.produccion.porPeriodo.map((p) => ({
      Periodo: p.periodo,
      "Piezas buenas": p.piezasBuenas,
      "Piezas defectuosas": p.piezasDefectuosas,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, hojaProduccion, "Producción");

  // Hoja 2: Cumplimiento de pedidos
  const hojaCumplimiento = XLSX.utils.json_to_sheet(
    data.cumplimientoPedidos.detalle.map((p) => ({
      Pedido: p.numeroPedido,
      Cliente: p.cliente,
      "Fecha de entrega": p.fechaEntrega ?? "Sin definir",
      "Completado el": p.completadoEn,
      "Días de diferencia": p.diasDiferencia ?? "N/A",
      Estado: p.diasDiferencia === null ? "Sin fecha" : p.diasDiferencia <= 0 ? "A tiempo" : "Con retraso",
    }))
  );
  XLSX.utils.book_append_sheet(workbook, hojaCumplimiento, "Cumplimiento");

  // Hoja 3: Costo merma/plasta
  const hojaCosto = XLSX.utils.json_to_sheet(
    data.costoMermaPlasta.porMaterial.map((m) => ({
      Material: m.nombre,
      "Kg merma": m.kgMerma,
      "Kg plasta": m.kgPlasta,
      "Costo total": m.costoTotal,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, hojaCosto, "Costo Merma-Plasta");

  // Hoja 4: Consumo de materiales (materia prima + pigmento combinados)
  const filasConsumo = [
    ...data.consumoMateriales.materiaPrima.map((m) => ({
      Tipo: "Materia prima",
      Nombre: m.nombre,
      "Kg consumidos": m.kgConsumidos,
      Costo: m.costoTotal,
    })),
    ...data.consumoMateriales.pigmento.map((p) => ({
      Tipo: "Pigmento",
      Nombre: p.color,
      "Kg consumidos": p.kgConsumidos,
      Costo: p.costoTotal,
    })),
  ];
  const hojaConsumo = XLSX.utils.json_to_sheet(filasConsumo);
  XLSX.utils.book_append_sheet(workbook, hojaConsumo, "Consumo Materiales");

  // Hoja 5: Desempeño de operadores
  const hojaOperadores = XLSX.utils.json_to_sheet(
    data.desempenoOperadores.map((op) => ({
      Operador: op.operadorNombre,
      "Piezas buenas": op.piezasBuenas,
      "Piezas defectuosas": op.piezasDefectuosas,
      "% Defectos": op.porcentajeDefectos,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, hojaOperadores, "Desempeño Operadores");

  // Hoja 6: Tiempos de paro
  const hojaParos = XLSX.utils.json_to_sheet(
    data.tiemposParo.porMotivo.map((m) => ({
      Motivo: m.nombre,
      Minutos: m.minutos,
    }))
  );
  XLSX.utils.book_append_sheet(workbook, hojaParos, "Tiempos de Paro");

  XLSX.writeFile(workbook, `reporte_${fechaDesde}_a_${fechaHasta}.xlsx`);
}

// ---------- Exportación individual, una hoja por sección ----------

export function exportarSeccionAExcel(nombreHoja: string, filas: Record<string, unknown>[], nombreArchivo: string) {
  const workbook = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(filas);
  XLSX.utils.book_append_sheet(workbook, hoja, nombreHoja);
  XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
}