import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDefectosProducto } from "../hooks/useDefectosProducto";
import TablaDefectosProducto from "../components/defectos/TablaDefectosProducto";
import DialogCrearDefectoProducto from "../components/defectos/DialogCrearDefectoProducto";

export default function DefectosProducto() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const { data: defectos, isLoading, error } = useDefectosProducto();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar defectos: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de defectos de producto.
          </p>
        </div>
        <Button className="cursor-pointer bg-gray-800 hover:bg-gray-700" onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nuevo defecto
        </Button>
      </div>

      <TablaDefectosProducto defectos={defectos ?? []} />

      <DialogCrearDefectoProducto
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
      />
    </div>
  );
}