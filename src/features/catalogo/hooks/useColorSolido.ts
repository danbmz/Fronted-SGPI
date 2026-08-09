import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarColorSolido,
    crearColorSolido,
    editarColorSolido,
    desactivarColorSolido,
    reactivarColorSolido
} from "../services/colorSolidoService";
import type { CrearColorSolidoInput, EditarColorSolidoInput } from "../schemas/colorSolido";

const QUERY_KEY = ["colores-solidos"];

export function useColorSolido() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarColorSolido,
    })
}

export function useCrearColorSolido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearColorSolidoInput) => crearColorSolido(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarColorSolido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarColorSolidoInput }) =>
      editarColorSolido(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarColorSolido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarColorSolido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarColorSolido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarColorSolido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}