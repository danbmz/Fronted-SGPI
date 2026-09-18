export const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

export function formatearFechaSinHora(fechaISO: string): string {
  const [año, mes, dia] = fechaISO.split("-").map(Number);
  const fecha = new Date(año, mes - 1, dia); // construido con componentes locales, no parseando el string
  return fecha.toLocaleDateString("es-MX");
}