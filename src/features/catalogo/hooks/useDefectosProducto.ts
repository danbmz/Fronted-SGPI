import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarDefectosProducto,
  crearDefectoProducto,
  editarDefectoProducto,
  desactivarDefectoProducto,
  reactivarDefectoProducto,
} from "../services/defectosService";
import type {
  CrearDefectoProductoInput,
  EditarDefectoProductoInput,
} from "../schemas/defectos";

const QUERY_KEY = ["defectos-producto"];

export function useDefectosProducto() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listarDefectosProducto,
  });
}

export function useCrearDefectoProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearDefectoProductoInput) => crearDefectoProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarDefectoProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarDefectoProductoInput }) =>
      editarDefectoProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarDefectoProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarDefectoProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarDefectoProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarDefectoProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}