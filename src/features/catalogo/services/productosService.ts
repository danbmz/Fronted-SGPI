import { httpClient } from "@/lib/httpClient";
import { listaProductoSchema, productoSchema, type CrearProductoInput, type EditarProductoInput, type Producto } from "../schemas/productos";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarProductos(): Promise <Producto[]> {
  const response = await httpClient('/productos');
  return parseOrThrow(response,listaProductoSchema)
}

export async function crearProducto(data: CrearProductoInput): Promise <Producto> {
  const response = await httpClient('/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,productoSchema)
}

export async function editarProducto(id: string, data: EditarProductoInput): Promise <Producto> {
  const response = await httpClient(`/productos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,productoSchema)
}

export async function desactivarProducto(id: string): Promise <void> {
  const response = await httpClient(`/productos/${id}`, { method: 'DELETE' });
  await parseOrThrow(response,okResponseSchema)
}

export async function reactivarProducto(id: string): Promise <void> {
  const response = await httpClient(`/productos/${id}`, { method: 'PATCH' });
  await parseOrThrow(response,okResponseSchema)
}