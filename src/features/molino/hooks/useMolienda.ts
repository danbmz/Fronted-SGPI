import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarPendientesMoler, listarMoliendas, crearMolienda } from "../services/moliendaService";
import type { CrearMoliendaInput } from "../schemas";

export function usePendientesMoler() {
  return useQuery({
    queryKey: ["moliendas", "pendientes"],
    queryFn: listarPendientesMoler,
  });
}

export function useMoliendas() {
  return useQuery({
    queryKey: ["moliendas"],
    queryFn: listarMoliendas,
  });
}

export function useCrearMolienda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearMoliendaInput) => crearMolienda(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moliendas"] });
      // Los avances/incidencias usados ya no deben aparecer como pendientes
      queryClient.invalidateQueries({ queryKey: ["moliendas", "pendientes"] });
      // Y el inventario de molido recibió una entrada real
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}