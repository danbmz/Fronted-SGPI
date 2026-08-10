import { useUsuarios } from "../hook/useUsuario";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import TablaUsuarios from "../components/TablaUsuarios";
import DialogCrearUsuario from "../components/DialogCrearUsuario";

function Usuarios() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const { data: usuarios, isLoading, error } = useUsuarios();

  return (
    <div className="flex flex-col gap-4 h-screen p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios del sistema.
          </p>
        </div>
        <Button className="bg-gray-800 hover:bg-gray-700 cursor-pointer" onClick={() => setDialogCrearAbierto(true)}>
          <UserPlus size={16} className="mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {isLoading && <p>Cambiar por skeleton...</p>}
      {error && <p className="text-red-500">Error al cargar usuarios: {error.message}</p>}
      {!isLoading && !error && (
        <TablaUsuarios usuarios={usuarios ?? []} />
      )}

      <DialogCrearUsuario
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
      />
    </div>
  );
}

export default Usuarios;