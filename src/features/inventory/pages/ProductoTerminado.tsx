import type { InventarioProductoTerminado } from "@/validations/inventario/inventarioValidations"
import { useEffect, useState } from "react"
import { getInventarioProductoTerminado } from "../services/productos/inventarioProductoService"
import { toast } from "sonner"
import TablaProductosInventario from "../components/productos/TablaProductosInventario"

export default function ProductoInventario() {
    const [productos, setProductos] = useState<InventarioProductoTerminado[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getInventarioProductoTerminado()
                setProductos(data)
            } catch (error) {
                toast.error("Error al cargar los datos")
            } finally{
                setIsLoading(false)
            }
        }
        fetchProductos()
    }, [])

    const handleProductoActualizado = (actualizado: InventarioProductoTerminado) => {
        setProductos(prev => 
            prev.map(p => p.id === actualizado.id ? actualizado : p)
        )
    }

    return (
        <div className="flex flex-col gap-4 p-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    Consulta y gestiona el stock de productos en Inventario
                </p>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground py-4">Cargando Productos...</p>
            ) : 
                <TablaProductosInventario
                  productos={productos}
                  onActualizado={handleProductoActualizado}
                />
            }
        </div>
    )
}