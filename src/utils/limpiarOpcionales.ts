export function limpiarOpcionales<T extends Record<string, unknown>>(data: T): T {
  const resultado = { ...data };
  for (const key in resultado) {
    if (typeof resultado[key] === "string" && resultado[key].trim() === "") {
      resultado[key] = undefined as T[typeof key];
    }
  }
  return resultado;
}