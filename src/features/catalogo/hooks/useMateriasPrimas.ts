import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarMateriasPrimas,
  crearMateriaPrima,
  editarMateriaPrima,
  desactivarMateriaPrima,
  reactivarMateriaPrima,
} from "../services/materiasPrimasService";
import type { CrearMateriaPrimaInput, EditarMateriaPrimaInput } from "../schemas/materiaPrima";

const QUERY_KEY = ["materias-primas"];

export function useMateriasPrimas() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listarMateriasPrimas,
  });
}

export function useCrearMateriaPrima() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearMateriaPrimaInput) => crearMateriaPrima(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarMateriaPrima() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarMateriaPrimaInput }) =>
      editarMateriaPrima(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarMateriaPrima() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarMateriaPrima(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarMateriaPrima() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarMateriaPrima(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}