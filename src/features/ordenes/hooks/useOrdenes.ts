// src/features/ordenes/hooks/useOrdenes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarOrdenes,
  obtenerOrden,
  crearOrden,
  cancelarOrden,
  confirmarMaterialOrden,
  sustituirMaterialPigmentado,
  cambiarEstadoOrden,
} from "../services/ordenService";
import type {
  CrearOrdenInput,
  CancelarOrdenInput,
  CambiarEstadoOrdenInput,
  SustituirMaterialPigmentadoInput,
} from "../schemas";

const QUERY_KEY_LISTA = ["ordenes"];
const queryKeyDetalle = (id: string) => ["ordenes", id];

// ---------- LISTAR ----------

export function useOrdenes() {
  return useQuery({
    queryKey: QUERY_KEY_LISTA,
    queryFn: listarOrdenes,
  });
}

// ---------- OBTENER UNA ----------

export function useOrden(id: string | undefined) {
  return useQuery({
    queryKey: queryKeyDetalle(id ?? ""),
    queryFn: () => obtenerOrden(id!),
    enabled: id !== undefined,
  });
}

// ---------- CREAR ----------

export function useCrearOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearOrdenInput) => crearOrden(data),
    onSuccess: (nuevaOrden) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      // La orden nace de un pedidoDetalle, así que el pedido dueño también cambió
      // (nueva orden asociada) — invalidamos su detalle también.
      queryClient.invalidateQueries({ queryKey: ["pedidos", nuevaOrden.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

// ---------- CANCELAR ----------

export function useCancelarOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelarOrdenInput }) =>
      cancelarOrden(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

// ---------- CONFIRMAR MATERIAL ----------

export function useConfirmarMaterialOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmarMaterialOrden(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(id) });
    },
  });
}

// ---------- SUSTITUIR MATERIAL PIGMENTADO ----------

export function useSustituirMaterialPigmentado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SustituirMaterialPigmentadoInput }) =>
      sustituirMaterialPigmentado(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

// ---------- CAMBIAR ESTADO (activar / pausar / reanudar) ----------

export function useCambiarEstadoOrden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      accion,
      data,
    }: {
      id: string;
      accion: "activar" | "pausar" | "reanudar";
      data: CambiarEstadoOrdenInput;
    }) => cambiarEstadoOrden(id, accion, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}