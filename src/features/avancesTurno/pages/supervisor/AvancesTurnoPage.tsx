import { useAvancesTurno } from "../../hooks/useAvanceTurno";
import TablaAvancesTurno from "../../components/supervisor/TablaAvancesTurno";

export default function MisAvancesPage() {
  const { data: avances, isLoading, error } = useAvancesTurno({ estado: "ABIERTO" });

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Avances de turno abiertos que tienes en curso.
      </p>

      {isLoading && <p className="text-muted-foreground py-4">Cargando avances...</p>}
      {error && <p className="text-red-500">Error al cargar avances: {error.message}</p>}
      {!isLoading && !error && (
        <TablaAvancesTurno avances={avances ?? []} />
      )}
    </div>
  );
}