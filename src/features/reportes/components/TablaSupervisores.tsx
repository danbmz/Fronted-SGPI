import type { ReporteSupervisor } from "../services/reportesService"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

interface Props {
  supervisores: ReporteSupervisor[]
}

export default function TablaSupervisores({ supervisores }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b">
        <p className="font-medium text-sm">Desempeño por supervisor</p>
        <p className="text-xs text-muted-foreground">Basado en avances de turno registrados</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supervisor</TableHead>
            <TableHead>Avances</TableHead>
            <TableHead>Piezas buenas</TableHead>
            <TableHead>Defectuosas</TableHead>
            <TableHead>% Calidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                Sin datos en este período.
              </TableCell>
            </TableRow>
          ) : (
            supervisores.map(s => (
              <TableRow key={s.nombre}>
                <TableCell className="font-medium">{s.nombre}</TableCell>
                <TableCell>{s.avancesRegistrados}</TableCell>
                <TableCell>{s.piezasBuenas.toLocaleString()}</TableCell>
                <TableCell>{s.piezasDefectuosas.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    s.calidad >= 95
                      ? "bg-green-100 text-green-700"
                      : s.calidad >= 80
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {s.calidad}%
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}