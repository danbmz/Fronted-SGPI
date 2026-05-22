import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InventarioProductoTerminado } from "@/validations/inventario/inventarioValidations";
import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import DialogAjusteManualProducto from "./DialogAjusteManualProducto";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";

interface Props {
    productos: InventarioProductoTerminado[]
    onActualizado: (producto: InventarioProductoTerminado) => void
}

export default function TablaProductosInventario({productos, onActualizado}: Props) {
    const [productoSeleccionado, setProductoSeleccionado] = useState<InventarioProductoTerminado | null>(null)
    const [dialogAbierto, setDialogAbierto] = useState<"ajustar" | "historial" | null>(null)

    const abrirDialog = (tipo: "ajustar" | "historial", producto: InventarioProductoTerminado) => {
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
                        <TableHead>Color</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Stock actual</TableHead>
                        <TableHead>Stock mínimo</TableHead>
                        <TableHead>Último movimiento</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {productos.map((producto) => {
                        const stockBajo = producto.stockActual < producto.stockMinimo
                        return(
                            <TableRow key={producto.id} className={stockBajo ? "bg-red-50 dark:bg-red-950/20" : ""}>
                                <TableCell>{producto.codigoBarras}</TableCell>
                                <TableCell>{producto.nombre}</TableCell>
                                <TableCell>{producto.color}</TableCell>
                                <TableCell>{producto.tipo}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className={stockBajo ? "text-red-600 font-medium" : ""}>
                                        {producto.stockActual} kg
                                        </span>
                                        {stockBajo && (
                                        <AlertTriangle size={14} className="text-red-600" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{producto.stockMinimo} Kg</TableCell>
                                <TableCell>{producto.ultimoMovimiento}</TableCell>
                                <TableCell>{producto.ubicacion}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal size={16}/>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => abrirDialog("ajustar", producto)}>
                                                Ajuste manual
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => abrirDialog("historial", producto)}>
                                                Historial de ajustes
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}

                    {productos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No hay Productos registrados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <DialogAjusteManualProducto
              open={dialogAbierto === "ajustar"}
              producto={productoSeleccionado}
              onClose={cerrarDialog}
              oncSuccess={onActualizado}
            />

            <DialogHistorialMovimientos
                open={dialogAbierto === "historial"}
                onClose={cerrarDialog}
                inventarioId={productoSeleccionado?.id ?? ""}
                tipoInventario="producto_terminado"
                titulo={productoSeleccionado?.nombre ?? ""}
                subtitulo={productoSeleccionado?.codigoBarras}
            />
        </>
    )
}