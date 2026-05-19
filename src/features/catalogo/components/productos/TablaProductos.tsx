import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Producto } from "@/validations/catalogo/productosValidations"
import { MoreHorizontal } from "lucide-react"
import DialogEditarProducto from "./DialogEditarProducto"
import { useState } from "react"
import DialogDesactivarProducto from "./DialogToggleEstadoProducto"

interface Props {
    productos: Producto[]
    onProductoEditado: (producto: Producto) => void
    onProductoDesactivado: (producto: Producto) => void
}

export default function TablaProductos({productos, onProductoEditado, onProductoDesactivado}: Props) {
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
    const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)

    const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", producto: Producto) => {
        setProductoSeleccionado(producto)
        setDialogAbierto(tipo)
    }

    const cerrarDialog = () => {
        setProductoSeleccionado(null)
        setDialogAbierto(null)
    }


    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cavidades</TableHead>
                        <TableHead>Ciclo (seg)</TableHead>
                        <TableHead>Peso (gr)</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.map((producto) => (
                        <TableRow key={producto.id}>
                            <TableCell className="font-mono font-medium">{producto.codigo}</TableCell>
                            <TableCell className="text-sm">{producto.nombre}</TableCell>
                            <TableCell className="text-sm">{producto.tipo}</TableCell>
                            <TableCell className="text-sm">{producto.cavidades}</TableCell>
                            <TableCell className="text-sm">{producto.ciclo}</TableCell>
                            <TableCell className="text-sm">{producto.peso}gr</TableCell>
                            <TableCell className="text-sm">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    producto.activo
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}>
                                    {producto.activo ? "Activo" : "Inactivo"}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal size={16}/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => abrirDialog("editar", producto)}>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        {producto.activo ? (
                                            <DropdownMenuItem variant="destructive" onClick={() => abrirDialog("desactivar", producto)}>Desactivar</DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem className="text-green-600 hover:text-green-600! hover:bg-green-100!" onClick={() => abrirDialog("reactivar", producto)}>Reactivar</DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {productos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No hay productos registrados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <DialogEditarProducto
            open={dialogAbierto === "editar"}
            producto={productoSeleccionado}
            onClose={cerrarDialog}
            onSuccess={onProductoEditado}
            />

            <DialogDesactivarProducto
            open={dialogAbierto === "desactivar" || dialogAbierto === "reactivar"}
            producto={productoSeleccionado}
            onClose={cerrarDialog}
            onSuccess={onProductoDesactivado}
            />
        </>
    )
}