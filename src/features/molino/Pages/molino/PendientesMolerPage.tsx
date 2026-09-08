import { useMemo, useState } from "react";
import { usePendientesMoler } from "../../hooks/useMolienda";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import DialogCrearMolienda from "../../components/molino/DialogCrearMolienda";

export default function PendientesMolerPage() {
  const { data: pendientes, isLoading, error } = usePendientesMoler();
  const [avancesSeleccionados, setAvancesSeleccionados] = useState<Set<string>>(new Set());
  const [incidenciasSeleccionadas, setIncidenciasSeleccionadas] = useState<Set<string>>(new Set());
  const [dialogAbierto, setDialogAbierto] = useState(false);

  const materialesSeleccionados = useMemo(() => {
    const avancesSel = (pendientes?.avances ?? []).filter((a) => avancesSeleccionados.has(a.id));
    const incidenciasSel = (pendientes?.incidencias ?? []).filter((i) => incidenciasSeleccionadas.has(i.id));
    const materiales = new Set([
      ...avancesSel.map((a) => a.ordenTipoMaterial),
      ...incidenciasSel.map((i) => i.ordenTipoMaterial),
    ]);
    return Array.from(materiales);
  }, [avancesSeleccionados, incidenciasSeleccionadas, pendientes]);

  const hayMezclaDeMateriales = materialesSeleccionados.length > 1;
  const materialUnico = materialesSeleccionados.length === 1 ? materialesSeleccionados[0] : undefined;

  const toggleAvance = (id: string) => {
    setAvancesSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  };

  const toggleIncidencia = (id: string) => {
    setIncidenciasSeleccionadas((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  };

  // Recorremos las listas completas de objetos y filtramos aquellos que tengan el mismo ID que el usuario selecciono
  const avancesSeleccionadosObj = useMemo(
    () => (pendientes?.avances ?? []).filter((a) => avancesSeleccionados.has(a.id)),
    [pendientes, avancesSeleccionados]
  );

  console.log(avancesSeleccionadosObj);

  const incidenciasSeleccionadasObj = useMemo(
    () => (pendientes?.incidencias ?? []).filter((i) => incidenciasSeleccionadas.has(i.id)),
    [pendientes, incidenciasSeleccionadas]
  );

  const totalSeleccionados = avancesSeleccionados.size + incidenciasSeleccionadas.size;

  const handleCerrarDialog = () => {
    setDialogAbierto(false);
    setAvancesSeleccionados(new Set());
    setIncidenciasSeleccionadas(new Set());
  };

  if (isLoading) return <div className="p-6">Cargando pendientes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecciona los avances e incidencias que se molieron juntos en la misma tanda.
        </p>
        <Button disabled={totalSeleccionados === 0 || hayMezclaDeMateriales} onClick={() => setDialogAbierto(true)}>
          Crear molienda ({totalSeleccionados} seleccionados)
        </Button>
      </div>

      {hayMezclaDeMateriales && (
        <p className="text-sm text-red-600">
          No puedes crear moliendas combinando materiales diferentes. Selecciona avances/incidencias del mismo tipo.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Avances de turno confirmados</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Merma</TableHead>
              <TableHead>Plasta</TableHead>
              <TableHead>Piezas malas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pendientes?.avances ?? []).map((avance) => (
              <TableRow key={avance.id}>
                <TableCell>
                  <Checkbox
                    checked={avancesSeleccionados.has(avance.id)}
                    onCheckedChange={() => toggleAvance(avance.id)}
                  />
                </TableCell>
                <TableCell className="font-mono font-medium">{avance.ordenFolio}</TableCell>
                <TableCell className="font-sm">{avance.ordenTipoMaterial}</TableCell>
                <TableCell className="text-sm">{avance.pigmentoColor}</TableCell>
                <TableCell className="text-sm">{avance.kgMerma} kg</TableCell>
                <TableCell className="text-sm">{avance.kgPlasta} kg</TableCell>
                <TableCell className="text-sm">{avance.piezasDefectuosas}</TableCell>
              </TableRow>
            ))}
            {(!pendientes || pendientes.avances.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay avances pendientes de moler.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Incidencias confirmadas</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Piezas afectadas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pendientes?.incidencias ?? []).map((inc) => (
              <TableRow key={inc.id}>
                <TableCell>
                  <Checkbox
                    checked={incidenciasSeleccionadas.has(inc.id)}
                    onCheckedChange={() => toggleIncidencia(inc.id)}
                  />
                </TableCell>
                <TableCell className="font-mono font-medium">{inc.ordenFolio}</TableCell>
                <TableCell className="font-sm">{inc.ordenTipoMaterial}</TableCell>
                <TableCell className="text-sm">{inc.pigmentoColor}</TableCell>
                <TableCell className="text-sm">{inc.piezasAfectadas}</TableCell>
              </TableRow>
            ))}
            {(!pendientes || pendientes.incidencias.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay incidencias pendientes de moler.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DialogCrearMolienda
        open={dialogAbierto}
        avanceTurnoIds={Array.from(avancesSeleccionados)}
        incidenciaIds={Array.from(incidenciasSeleccionadas)}
        avancesSeleccionados={avancesSeleccionadosObj ?? []}
        incidenciasSeleccionadas={incidenciasSeleccionadasObj ?? []} 
        materialSugerido={materialUnico}
        onClose={handleCerrarDialog}
      />
    </div>
  );
}