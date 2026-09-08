import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";
import { pedidoSchema, type Pedido, listaPedidoResponseSchema } from "../schemas/pedido.schema";
import type {
  CrearPedidoInput,
  EditarPedidoInput,
  CancelarPedidoInput,
  CrearPedidoDetalleInput,
  ListaPedidoResponse,
} from "../schemas";

export interface FiltroPedidos {
  estado?: string;
  pagina?: number;
  limite?: number;
}

export async function listarPedidos(filtro?: FiltroPedidos): Promise<ListaPedidoResponse> {
  const params = new URLSearchParams();
  if (filtro?.estado !== undefined) params.set("estado", filtro.estado);
  if (filtro?.pagina !== undefined) params.set("pagina", String(filtro.pagina));
  if (filtro?.limite !== undefined) params.set("limite", String(filtro.limite));

  const query = params.toString();
  const response = await httpClient(`/pedidos${query ? `?${query}` : ""}`);
  return parseOrThrow(response, listaPedidoResponseSchema);
}

export async function obtenerPedido(id: string): Promise<Pedido> {
  const response = await httpClient(`/pedidos/${id}`);
  return parseOrThrow(response, pedidoSchema);
}

export async function crearPedido(data: CrearPedidoInput): Promise<Pedido> {
  const response = await httpClient("/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, pedidoSchema);
}

export async function editarPedido(id: string, data: EditarPedidoInput): Promise<Pedido> {
  const response = await httpClient(`/pedidos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, pedidoSchema);
}

export async function cancelarPedido(id: string, data: CancelarPedidoInput): Promise<void> {
  const response = await httpClient(`/pedidos/${id}/cancelar`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}

export async function agregarDetallePedido(
  pedidoId: string,
  data: CrearPedidoDetalleInput
): Promise<Pedido> {
  const response = await httpClient(`/pedidos/${pedidoId}/detalle`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, pedidoSchema);
}