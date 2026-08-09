import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarOperadores,
    crearOperador,
    editarOperador,
    desactivarOperador,
    reactivarOperador
} from "../services/operadorService";
import type { CrearOperadorInput, EditarOperadorInput } from "../schemas/operadores";

const QUERY_KEY = ["operadores"];

export function useOperador() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarOperadores,
    })
}

export function useCrearOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearOperadorInput) => crearOperador(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarOperadorInput }) =>
      editarOperador(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarOperador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarOperador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}