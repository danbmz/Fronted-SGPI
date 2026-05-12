import { useEffect, useState } from "react"
import { getOperadores } from "../services/operadorService"
import type { Operador } from "@/types/operadoresCatalogo"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import TablaOperadores from "../components/operadores/TablaOperadores"
import DialogCrearOperador from "../components/operadores/DialogCrearOperador"


function Operadores() {
    const [operadores, setOperadores] = useState<Operador[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)

    useEffect(() => {
        const fetchOperadores = async () => {
        try {
            const data = await getOperadores()
            setOperadores(data)
        } catch {
            setError("Error al cargar operadores")
        } finally {
            setLoading(false)
        }
        }
        fetchOperadores()
    }, [])

    const handleOperadorCreado = (nuevoOperador: Operador) => {
        setOperadores(prev => [...prev, nuevoOperador])
    }

    const handleOperadorEditado = (operadorEditado: Operador) => {
        setOperadores(prev =>
        prev.map(o => o.id === operadorEditado.id ? operadorEditado : o)
        )
    }

    const handleOperadorDesactivado = (operadorDesactivado: Operador) => {
        setOperadores(prev =>
        prev.map(o => o.id === operadorDesactivado.id ? { ...o, activo: false } : o)
        )
    }

    const handleOperadorReactivado = (operadorReactivado: Operador) => {
        setOperadores(prev =>
        prev.map(o => o.id === operadorReactivado.id ? { ...o, activo: true } : o)
        )
    }

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

            {loading && <p className="text-muted-foreground">Cargando operadores...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <TablaOperadores
                operadores={operadores}
                onOperadorEditado={handleOperadorEditado}
                onOperadorDesactivado={handleOperadorDesactivado}
                onOperadorReactivado={handleOperadorReactivado}
                />
            )}

            <DialogCrearOperador
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
                onSuccess={handleOperadorCreado}
            />
        </div>
    )
}

export default Operadores