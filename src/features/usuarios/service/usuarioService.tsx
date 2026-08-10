import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";
import { usuarioSchema, listaUsuarioSchema, type Usuario } from "../schemas/usuario.schema";
import type {
  CrearUsuarioInput,
  EditarUsuarioInput,
  CambiarPasswordInput,
} from "../schemas/usuario.validation";

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await httpClient("/usuarios");
  return parseOrThrow(response, listaUsuarioSchema);
}

export async function crearUsuario(data: CrearUsuarioInput): Promise<Usuario> {
  const response = await httpClient("/usuarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, usuarioSchema);
}

export async function editarUsuario(id: string, data: EditarUsuarioInput): Promise<Usuario> {
  const response = await httpClient(`/usuarios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, usuarioSchema);
}

export async function desactivarUsuario(id: string): Promise<void> {
  const response = await httpClient(`/usuarios/${id}`, { method: "DELETE" });
  await parseOrThrow(response, okResponseSchema);
}

export async function reactivarUsuario(id: string): Promise<void> {
  const response = await httpClient(`/usuarios/${id}/reactivar`, { method: "PATCH" });
  await parseOrThrow(response, okResponseSchema);
}

export async function cambiarPasswordUsuario(id: string, data: CambiarPasswordInput): Promise<void> {
  const response = await httpClient(`/usuarios/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}