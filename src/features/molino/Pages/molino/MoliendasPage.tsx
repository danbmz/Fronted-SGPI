import { useState, useMemo } from "react";
import { useMoliendas } from "../../hooks/useMolienda";
import { useColorSolido } from "@/features/catalogo/hooks/useColorSolido";
import { TIPO_MATERIAL } from "@/types/enums";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function MoliendasPage() {
  const [filtroMaterial, setFiltroMaterial] = useState<string>("TODOS");
  const [filtroColor, setFiltroColor] = useState<string>("TODOS");

  const { data: moliendas, isLoading, error } = useMoliendas();
  const { data: coloresSolidos } = useColorSolido();
  const coloresSolidosActivos = coloresSolidos?.filter((c) => c.activo);

  const moliendasFiltradas = useMemo(() => {
    return (moliendas ?? []).filter((m) => {
      const coincideMaterial = filtroMaterial === "TODOS" || m.tipoMaterial === filtroMaterial;
      const coincideColor = filtroColor === "TODOS" || m.colorSolidoId === filtroColor;
      return coincideMaterial && coincideColor;
    });
  }, [moliendas, filtroMaterial, filtroColor]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Historial de moliendas registradas.
      </p>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-48">
          <Select value={filtroMaterial} onValueChange={setFiltroMaterial}>
            <SelectTrigger>
              <SelectValue placeholder="Material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los materiales</SelectItem>
              {TIPO_MATERIAL.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 w-48">
          <Select value={filtroColor} onValueChange={setFiltroColor}>
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los colores</SelectItem>
              {(coloresSolidosActivos ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando moliendas...</p>}
      {error && <p className="text-red-500">Error al cargar moliendas: {error.message}</p>}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Kg resultantes</TableHead>
              <TableHead>Avances</TableHead>
              <TableHead>Incidencias</TableHead>
              <TableHead>Observaciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moliendasFiltradas.map((molienda) => (
              <TableRow key={molienda.id}>
                <TableCell className="text-sm">{molienda.fecha}</TableCell>
                <TableCell className="text-sm">{molienda.tipoMaterial}</TableCell>
                <TableCell className="text-sm">{molienda.colorSolidoNombre}</TableCell>
                <TableCell className="font-medium">{molienda.kgIngresados} kg</TableCell>
                <TableCell className="text-sm text-muted-foreground">{molienda.totalAvances}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{molienda.totalIncidencias}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{molienda.observaciones ?? "—"}</TableCell>
              </TableRow>
            ))}
            {moliendasFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay moliendas que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}