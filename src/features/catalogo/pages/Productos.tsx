import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TablaProductos from "../components/productos/TablaProductos"
import DialogCrearProducto from "../components/productos/DialogCrearProducto"
import { useProducto } from "../hooks/useProducto"

export default function Productos() {
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
    const { data: productos, isLoading, error} = useProducto()

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

            {isLoading && <p className="text-muted-foreground">Cargando productos...</p>}
            {error && <p className="text-red-500">{error.message}</p>}


            {!isLoading && !error && (
                <TablaProductos
                  productos = {productos ?? []}
                />
            )}

            <DialogCrearProducto
                open = {dialogCrearAbierto}
                onClose = {() => { setDialogCrearAbierto(false)}}
            />
        </div>
    )
}