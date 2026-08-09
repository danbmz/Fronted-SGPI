import { httpClient } from "@/lib/httpClient";
import { listaProductoSchema, productoSchema, type CrearProductoInput, type EditarProductoInput } from "../schemas/productos";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarProductos(){
  const response = await httpClient('/productos');
  return parseOrThrow(response,listaProductoSchema)
}

export async function crearProducto(data: CrearProductoInput){
  const response = await httpClient('/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,productoSchema)
}

export async function editarProducto(id: string, data: EditarProductoInput){
  const response = await httpClient(`/productos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,productoSchema)
}

export async function desactivarProducto(id: string){
  const response = await httpClient(`/productos/${id}`, { method: 'DELETE' });
  return parseOrThrow(response,okResponseSchema)
}

export async function reactivarProducto(id: string){
  const response = await httpClient(`/productos/${id}`, { method: 'PATCH' });
  return parseOrThrow(response,okResponseSchema)
}