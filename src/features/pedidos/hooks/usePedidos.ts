import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarPedidos,
  obtenerPedido,
  crearPedido,
  editarPedido,
  cancelarPedido,
  agregarDetallePedido,
  type FiltroPedidos,
} from "../service/pedidoService";
import type {
  CrearPedidoInput,
  EditarPedidoInput,
  CancelarPedidoInput,
  CrearPedidoDetalleInput,
} from "../schemas";

const QUERY_KEY_LISTA = ["pedidos"];
const queryKeyDetalle = (id: string) => ["pedidos", id];

// ---------- LISTAR ----------

export function usePedidos(filtro?: FiltroPedidos) {
  return useQuery({
    queryKey: [...QUERY_KEY_LISTA, filtro],
    queryFn: () => listarPedidos(filtro),
  });
}

// ---------- OBTENER UNO ----------

export function usePedido(id: string | undefined) {
  return useQuery({
    queryKey: queryKeyDetalle(id ?? ""),
    queryFn: () => obtenerPedido(id!),
    enabled: id !== undefined,
  });
}

// ---------- CREAR ----------

export function useCrearPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearPedidoInput) => crearPedido(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
    },
  });
}

// ---------- EDITAR ----------

export function useEditarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarPedidoInput }) =>
      editarPedido(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

// ---------- CANCELAR ----------

export function useCancelarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelarPedidoInput }) =>
      cancelarPedido(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

// ---------- AGREGAR LÍNEA DE DETALLE ----------

export function useAgregarDetallePedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pedidoId, data }: { pedidoId: string; data: CrearPedidoDetalleInput }) =>
      agregarDetallePedido(pedidoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.pedidoId) });
    },
  });
}