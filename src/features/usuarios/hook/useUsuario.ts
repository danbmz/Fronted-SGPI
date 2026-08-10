import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarUsuarios,
  crearUsuario,
  editarUsuario,
  desactivarUsuario,
  reactivarUsuario,
  cambiarPasswordUsuario,
} from "../service/usuarioService";
import type {
  CrearUsuarioInput,
  EditarUsuarioInput,
  CambiarPasswordInput,
} from "../schemas/usuario.validation";

const QUERY_KEY = ["usuarios"];

export function useUsuarios() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listarUsuarios,
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearUsuarioInput) => crearUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useEditarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarUsuarioInput }) =>
      editarUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => desactivarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReactivarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useCambiarPasswordUsuario() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CambiarPasswordInput }) =>
      cambiarPasswordUsuario(id, data),
    // sin onSuccess de invalidación — cambiar contraseña no afecta ningún dato visible en la lista
  });
}