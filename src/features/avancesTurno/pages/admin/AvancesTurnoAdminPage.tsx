import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAvancesTurno } from "../../hooks/useAvanceTurno";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

const estadoColor: Record<string, string> = {
  ABIERTO: "bg-blue-100 text-blue-700",
  CERRADO: "bg-gray-100 text-gray-700",
};

export default function AvancesTurnoAdminPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");

  const { data: avances, isLoading, error } = useAvancesTurno();

  const avancesFiltrados = useMemo(() => {
    if (filtroEstado === "TODOS") return avances ?? [];
    return (avances ?? []).filter((a) => a.estado === filtroEstado);
  }, [avances, filtroEstado]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Vista general de avances de turno de todos los supervisores.
      </p>

      <div className="flex flex-col gap-1 max-w-xs">
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los estados</SelectItem>
            <SelectItem value="ABIERTO">Abiertos</SelectItem>
            <SelectItem value="CERRADO">Cerrados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando avances...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Piezas buenas</TableHead>
              <TableHead>Molino</TableHead>
              <TableHead>Sobrante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {avancesFiltrados.map((avance) => (
              <TableRow
                key={avance.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/admin/avances-turno/${avance.id}`)}
              >
                <TableCell className="font-mono font-medium">{avance.ordenFolio}</TableCell>
                <TableCell className="text-sm">{avance.supervisorNombre}</TableCell>
                <TableCell className="text-sm">{avance.turno}</TableCell>
                <TableCell className="text-sm">{avance.fecha}</TableCell>
                <TableCell>
                  <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[avance.estado]}`}>
                    {avance.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{avance.piezasBuenas}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {avance.confirmacionMolinoConfirmado === null
                    ? "Pendiente"
                    : avance.confirmacionMolinoConfirmado
                    ? "Confirmado"
                    : "Con diferencia"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {avance.kgSobrante === null ? "—" : avance.sobranteConfirmado ? "Confirmado" : "Pendiente"}
                </TableCell>
              </TableRow>
            ))}
            {avancesFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No hay avances que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}