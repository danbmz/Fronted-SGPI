import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarTiemposParo, crearTiempoParo } from "../services/tiempoParoService";
import type { CrearTiempoParoInput } from "../schemas/tiempoParo";

const queryKeyLista = (avanceTurnoId: string) => ["tiempos-paro", avanceTurnoId];

export function useTiemposParo(avanceTurnoId: string | undefined) {
  return useQuery({
    queryKey: queryKeyLista(avanceTurnoId ?? ""),
    queryFn: () => listarTiemposParo(avanceTurnoId!),
    enabled: avanceTurnoId !== undefined,
  });
}

export function useCrearTiempoParo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avanceTurnoId, data }: { avanceTurnoId: string; data: CrearTiempoParoInput }) =>
      crearTiempoParo(avanceTurnoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeyLista(variables.avanceTurnoId) });
    },
  });
}