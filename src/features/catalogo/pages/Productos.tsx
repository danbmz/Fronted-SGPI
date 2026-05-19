import { useState, useEffect } from "react"
import { getProductos } from "../services/productosService"
import type { Producto } from "@/validations/catalogo/productosValidations"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TablaProductos from "../components/productos/TablaProductos"
import DialogCrearProducto from "../components/productos/DialogCrearProducto"



export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos()
                setProductos(data)
            } catch (error) {
                setError("Error al cargar materias primas")
            } finally {
                setLoading(false)
            }
        }
        fetchProductos()
    }, [])

    const hanldeProductoCreado = (nuevoProducto: Producto) => {
        setProductos( prev => [...prev, nuevoProducto])
    }

    const handleProductoEditado = (productoEditado: Producto) => {
        setProductos( prev => 
            prev.map(p => p.id === productoEditado.id ? productoEditado : p)
        )
    }

    const handleProductoDesactivado = (productoDesactivado: Producto) => {
        setProductos(prev => 
            prev.map(p => p.id === productoDesactivado.id ? productoDesactivado : p)
        )
    }

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Gestiona el catálogo de productos del sistema.
                    </p>
                </div>
                <Button onClick={() => setDialogCrearAbierto(true)} className="bg-gray-800 hover:bg-gray-700 cursor-pointer ">
                    <Plus size={16} className="mr-2"/>
                    Nuevo Producto
                </Button>
            </div>

            {loading && <p className="text-muted-foreground">Cargando productos...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <TablaProductos
                  productos = {productos}
                  onProductoEditado={handleProductoEditado}
                  onProductoDesactivado={handleProductoDesactivado}
                />
            )}

            <DialogCrearProducto
                open = {dialogCrearAbierto}
                onClose = {() => { setDialogCrearAbierto(false)}}
                onSuccess = {hanldeProductoCreado}
            />
        </div>
    )
}