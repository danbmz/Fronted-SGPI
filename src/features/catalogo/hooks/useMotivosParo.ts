import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarMotivosParo,
    crearMotivoParo,
    editarMotivoParo,
    desactivarMotivoParo,
    reactivarMotivoParo
} from "../services/motivosService";
import type { CrearMotivoParoInput, EditarMotivoParoInput } from "../schemas/motivosParo";

const QUERY_KEY = ["motivos-paro"];

export function useMotivosParo() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarMotivosParo,
    })
}

export function useCrearMotivoParo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearMotivoParoInput) => crearMotivoParo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarMotivoParo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarMotivoParoInput }) =>
      editarMotivoParo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarMotivoParo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarMotivoParo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarMotivoParo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarMotivoParo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}