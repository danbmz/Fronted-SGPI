import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    listarProductos,
    crearProducto,
    editarProducto,
    desactivarProducto,
    reactivarProducto
} from "../services/productosService";
import type { CrearProductoInput, EditarProductoInput } from "../schemas/productos";

const QUERY_KEY = ["productos"];

export function useProducto() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: listarProductos,
    })
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearProductoInput) => crearProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarProductoInput }) =>
      editarProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}