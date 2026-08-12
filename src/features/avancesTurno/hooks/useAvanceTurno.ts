import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarAvancesTurno,
  obtenerAvanceTurno,
  crearAvanceTurno,
  actualizarAvanceTurno,
  cerrarAvanceTurno,
  confirmarMolino,
  confirmarSobrante,
  type FiltroAvances,
} from "../services/avanceTurnoService";
import type {
  CrearAvanceTurnoInput,
  ActualizarAvanceTurnoInput,
  CerrarAvanceTurnoInput,
  ConfirmarMolinoInput,
  ConfirmarSobranteInput,
} from "../schemas/avanceTurno";

const QUERY_KEY_LISTA = ["avances-turno"];
const queryKeyDetalle = (id: string) => ["avances-turno", id];

export function useAvancesTurno(filtro?: FiltroAvances) {
  return useQuery({
    queryKey: [QUERY_KEY_LISTA, filtro],
    queryFn: () => listarAvancesTurno(filtro),
  });
}

export function useAvanceTurno(id: string | undefined) {
  return useQuery({
    queryKey: queryKeyDetalle(id ?? ""),
    queryFn: () => obtenerAvanceTurno(id!),
    enabled: id !== undefined,
  });
}

export function useCrearAvanceTurno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearAvanceTurnoInput) => crearAvanceTurno(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      // El avance nace de una orden, y "tiene avance abierto" cambia su disponibilidad
      queryClient.invalidateQueries({ queryKey: ["ordenes"] });
    },
  });
}

export function useActualizarAvanceTurno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ActualizarAvanceTurnoInput }) =>
      actualizarAvanceTurno(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

export function useCerrarAvanceTurno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CerrarAvanceTurnoInput }) =>
      cerrarAvanceTurno(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
      // Cerrar puede completar la orden y el pedido — invalidamos ambos módulos
      queryClient.invalidateQueries({ queryKey: ["ordenes"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

export function useConfirmarMolino() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmarMolinoInput }) =>
      confirmarMolino(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
    },
  });
}

export function useConfirmarSobrante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmarSobranteInput }) =>
      confirmarSobrante(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_LISTA });
      queryClient.invalidateQueries({ queryKey: queryKeyDetalle(variables.id) });
      // Confirmar sobrante dispara movimiento de inventario
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}