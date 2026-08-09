import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarPigmentos,
    crearPigmento,
    editarPigmento,
    desactivarPigmento,
    reactivarPigmento
} from "../services/pigmentoService";
import type { CrearPigmentoInput, EditarPigmentoInput } from "../schemas/pigmento";

const QUERY_KEY = ["pigmentos"];

export function usePigmento() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarPigmentos,
    })
}

export function useCrearPigmento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearPigmentoInput) => crearPigmento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarPigmento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarPigmentoInput }) =>
      editarPigmento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarPigmento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarPigmento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarPigmento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarPigmento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}