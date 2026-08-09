import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarMaquinas,
    crearMaquina,
    editarMaquina,
    cambiarEstadoMaquina } from "../services/maquinasService";
import type { CambiarEstadoMaquinaInput, CrearMaquinaInput, EditarMaquinaInput } from "../schemas/maquina";

const QUERY_KEY = ["maquinas"];

export function useMaquina() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarMaquinas,
    })
}

export function useCrearMaquina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearMaquinaInput) => crearMaquina(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarMaquina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarMaquinaInput }) =>
      editarMaquina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useCambiarEstadoMaquina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}: {id: string; data: CambiarEstadoMaquinaInput}) => 
        cambiarEstadoMaquina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}