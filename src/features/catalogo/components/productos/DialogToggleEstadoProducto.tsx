import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import type { Producto } from "@/validations/catalogo/productosValidations"
import { useState } from "react"
import { desactivarProducto, reactivarProducto } from "../../services/productosService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface Props{
    open: boolean
    producto: Producto | null
    onClose: () => void
    onSuccess: (producto: Producto) => void
}

export default function DialogDesactivarProducto({open, producto, onClose, onSuccess}:Props){
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const esActivo = producto?.activo ?? false

  const handleConfirmar = async () => {
    if (!user || !producto) return
    setIsLoading(true) 

    try {
      const productoActualizado = esActivo
        ? await desactivarProducto(producto, user)
        : await reactivarProducto(producto, user)

      toast.success(esActivo ? "Producto desactivado." : "Producto reactivado.")
      onSuccess(productoActualizado)
      onClose()
    } catch {
      toast.error(esActivo ? "Error al desactivar." : "Error al reactivar.")
    } finally{
        setIsLoading(false)
    }
  }

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{esActivo ? "¿Desactivar producto?" : "¿Reactivar producto?"}</DialogTitle>
                <DialogDescription>
                    {esActivo
                    ? "El producto dejará de aparecer en los formularios de órdenes de producción."
                    : "El producto volverá a aparecer en los formularios de órdenes de producción."
                    }
                </DialogDescription>
                </DialogHeader>

                {producto && (
                <div className="text-sm flex flex-col gap-1 bg-muted px-3 py-2 rounded-md">
                    <p><span className="font-medium">Nombre:</span> {producto.nombre}</p>
                    <p><span className="font-medium">Código:</span> {producto.codigo}</p>
                </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button 
                        variant={esActivo ? "destructive" : "default"} 
                        onClick={handleConfirmar} 
                        disabled={isLoading}
                    >
                        {isLoading ? "Actualizando" : "Cambiar estado"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}