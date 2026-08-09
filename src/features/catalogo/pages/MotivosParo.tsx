import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMotivosParo } from "../hooks/useMotivosParo";
import TablaMotivosParo from "../components/motivosParo/TablaMotivos";
import DialogCrearMotivoParo from "../components/motivosParo/DialogCrearMotivo";

export default function MotivosParo() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const { data: motivosParo, isLoading, error } = useMotivosParo();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar motivos de paro: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de motivos de paro durante producción.
          </p>
        </div>
        <Button className="cursor-pointer bg-gray-800 hover:bg-gray-700" onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nuevo motivo
        </Button>
      </div>

      <TablaMotivosParo motivosParo={motivosParo ?? []} />

      <DialogCrearMotivoParo
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
      />
    </div>
  );
}