import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  crearIncidencia,
  confirmarIncidenciaMolino,
  resolverIncidencia,
  listarIncidencias,
  type FiltroIncidencias,
} from "../services/incidenciaService";
import type {
  CrearIncidenciaInput,
  ConfirmarIncidenciaMolinoInput,
  ResolverIncidenciaInput,
} from "../schemas/incidencia";


export function useIncidencias(filtro?: FiltroIncidencias) {
  return useQuery({
    queryKey: ["incidencias-mal-pigmentado", filtro],
    queryFn: () => listarIncidencias(filtro),
  });
}

export function useCrearIncidencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avanceTurnoId, data }: { avanceTurnoId: string; data: CrearIncidenciaInput }) =>
      crearIncidencia(avanceTurnoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["avances-turno", variables.avanceTurnoId] });
      queryClient.invalidateQueries({ queryKey: ["inventario"] }); // destino STOCK dispara movimiento
    },
  });
}

export function useConfirmarIncidenciaMolino() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmarIncidenciaMolinoInput }) =>
      confirmarIncidenciaMolino(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidencias-mal-pigmentado"] });
    },
  });
}

export function useResolverIncidencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResolverIncidenciaInput }) =>
      resolverIncidencia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidencias-mal-pigmentado"] });
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}