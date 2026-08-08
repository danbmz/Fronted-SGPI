export async function parseOrThrow<T>(response: Response, schema: { parse: (data: unknown) => T }) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error ?? "Error en la petición");
  }
  const data = await response.json();
  return schema.parse(data);
}