import { useState, useEffect } from "react"
import type { InventarioPigmento } from "@/validations/inventario/inventarioValidations"
import { getInventarioPigmentos } from "../services/pigmentos/inventarioPigmentoService"
import { toast } from "sonner"
import TablaInventarioPigmentos from "../components/pigmentos/TablaInventarioPigmentos"


export default function PigmentosInventario() {
    const [pigmentos, setPigmentos] = useState<InventarioPigmento[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPigmentos = async () => {
            try {
                const data = await getInventarioPigmentos()
                setPigmentos(data)
            } catch (error) {
                toast.error("Hubo un error al intentar cargar los Pigmentos")
            } finally{
                setIsLoading(false)
            }
        }
        fetchPigmentos()
    }, [])

    const handlePigmentoActualizado = (actualizado: InventarioPigmento) => {
        setPigmentos(prev => 
            prev.map(p => p.id === actualizado.id ? actualizado : p)
        )
    }


    return (
        <div className="flex flex-col gap-4 p-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    Consulta y gestiona el stock de pigmentos.
                </p>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground py-4">Cargando Pigmentos...</p>
            ) : 
                <TablaInventarioPigmentos
                  pigmentos={pigmentos}
                  onActualizado={handlePigmentoActualizado}
                />
            }

        </div>
    )   
}