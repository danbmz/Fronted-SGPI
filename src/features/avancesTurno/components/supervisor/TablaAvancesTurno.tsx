import { useNavigate } from "react-router-dom";
import type { AvanceTurno } from "../../schemas/avanceTurno";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  avances: AvanceTurno[];
}

const turnoColor: Record<string, string> = {
  MANANA: "bg-yellow-100 text-yellow-700",
  TARDE: "bg-orange-100 text-orange-700",
  NOCHE: "bg-indigo-100 text-indigo-700",
};

export default function TablaAvancesTurno({ avances }: Props) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Orden</TableHead>
          <TableHead>Turno</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora inicio</TableHead>
          <TableHead>Piezas buenas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {avances.map((avance) => (
          <TableRow
            key={avance.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/supervisor/avances/${avance.id}`)}
          >
            <TableCell className="font-mono font-medium">{avance.ordenFolio}</TableCell>
            <TableCell>
              <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${turnoColor[avance.turno]}`}>
                {avance.turno}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{avance.fecha}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(avance.horaInicio).toLocaleTimeString()}
            </TableCell>
            <TableCell className="text-sm">{avance.piezasBuenas}</TableCell>
          </TableRow>
        ))}
        {avances.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No tienes avances de turno abiertos en este momento.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}