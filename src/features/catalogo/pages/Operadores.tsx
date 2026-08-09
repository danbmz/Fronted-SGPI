import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import TablaOperadores from "../components/operadores/TablaOperadores"
import DialogCrearOperador from "../components/operadores/DialogCrearOperador"
import { useOperador } from "../hooks/useOperador"


function Operadores() {
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
    const { data: operadores, isLoading, error } = useOperador()

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar Operadores: {error.message}</div>;

    return (
        <div className="flex flex-col gap-4 h-screen p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los operadores de planta del sistema.
                    </p>
                </div>
                <Button className="bg-gray-800 hover:bg-gray-700 cursor-pointer" onClick={() => setDialogCrearAbierto(true)}>
                    <UserPlus size={16} className="mr-2" />
                    Nuevo operador
                </Button>
            </div>

            <TablaOperadores operadores={operadores ?? []} />

            <DialogCrearOperador
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
            />
        </div>
    )
}

export default Operadores