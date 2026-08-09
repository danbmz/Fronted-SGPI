import { useState } from "react";
import { useColorSolido } from "../hooks/useColorSolido";
import { TablaColoresSolidos } from "../components/coloresSolidos/TablaColoresSolidos";
import { DialogCrearColorSolido } from "../components/coloresSolidos/DialogCrearColorSolido";
import { Button } from "@/components/ui/button";

export default function ColoresSolidosPage() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const { data: coloresSolidos, isLoading, error } = useColorSolido();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar colores sólidos: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Colores sólidos</h1>
        <Button onClick={() => setDialogCrearAbierto(true)}>Nuevo color</Button>
      </div>

      <TablaColoresSolidos coloresSolidos={coloresSolidos ?? []} />

      <DialogCrearColorSolido
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
      />
    </div>
  );
}