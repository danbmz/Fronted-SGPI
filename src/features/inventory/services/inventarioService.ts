import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";
import {
  listaInventarioMateriaPrimaSchema,
  listaInventarioPigmentoSchema,
  listaInventarioProductoSchema,
  listaInventarioMolidoSchema,
  listaInventarioMaterialPigmentadoSchema,
  listaMovimientosSchema,
  type InventarioMateriaPrimaItem,
  type InventarioPigmentoItem,
  type InventarioProductoItem,
  type InventarioMolidoItem,
  type InventarioMaterialPigmentadoItem,
  type Movimiento,
} from "../schemas/inventario.schema";
import type {
  EntradaProveedorInput,
  AjusteManualInput,
  SalidaProductoInput,
  HistorialQueryInput,
} from "../schemas";

// ---------- LISTADOS ----------

export async function listarInventarioMateriaPrima(): Promise<InventarioMateriaPrimaItem[]> {
  const response = await httpClient("/inventario/materias-primas");
  return parseOrThrow(response, listaInventarioMateriaPrimaSchema);
}

export async function listarInventarioPigmento(): Promise<InventarioPigmentoItem[]> {
  const response = await httpClient("/inventario/pigmentos");
  return parseOrThrow(response, listaInventarioPigmentoSchema);
}

export async function listarInventarioProducto(): Promise<InventarioProductoItem[]> {
  const response = await httpClient("/inventario/productos");
  return parseOrThrow(response, listaInventarioProductoSchema);
}

export async function listarInventarioMolido(): Promise<InventarioMolidoItem[]> {
  const response = await httpClient("/inventario/molido");
  return parseOrThrow(response, listaInventarioMolidoSchema);
}

export async function listarInventarioMaterialPigmentado(): Promise<InventarioMaterialPigmentadoItem[]> {
  const response = await httpClient("/inventario/material-pigmentado");
  return parseOrThrow(response, listaInventarioMaterialPigmentadoSchema);
}

// ---------- HISTORIAL ----------

export async function consultarHistorial(query: HistorialQueryInput): Promise<Movimiento[]> {
  const params = new URLSearchParams();
  params.set("tipoInventario", query.tipoInventario);
  if (query.materiaPrimaId !== undefined) params.set("materiaPrimaId", query.materiaPrimaId);
  if (query.pigmentoId !== undefined) params.set("pigmentoId", query.pigmentoId);
  if (query.productoId !== undefined) params.set("productoId", query.productoId);
  if (query.colorSolidoId !== undefined) params.set("colorSolidoId", query.colorSolidoId);
  if (query.origen !== undefined) params.set("origen", query.origen);
  if (query.combinacionId !== undefined) params.set("combinacionId", query.combinacionId);

  if (query.limite !== undefined) params.set("limite", String(query.limite));

  const response = await httpClient(`/inventario/movimientos?${params.toString()}`);
  return parseOrThrow(response, listaMovimientosSchema);
}

// ---------- ACCIONES ----------

export async function registrarEntradaProveedor(data: EntradaProveedorInput): Promise<void> {
  const response = await httpClient("/inventario/entrada-proveedor", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}

export async function registrarAjusteManual(data: AjusteManualInput): Promise<void> {
  const response = await httpClient("/inventario/ajuste-manual", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}

export async function registrarSalidaProducto(data: SalidaProductoInput): Promise<void> {
  const response = await httpClient("/inventario/salida-producto", {
    method: "POST",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}