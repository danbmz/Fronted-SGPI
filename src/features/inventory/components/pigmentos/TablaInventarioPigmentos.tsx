import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { colorCategoria, colorTipo } from "@/features/catalogo/components/pigmentos/TablaPigmentos"
import type { InventarioPigmento } from "@/validations/inventario/inventarioValidations"
import { AlertTriangle, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DialogAjusteManualPigmento from "./DialogAjusteManualPigmento"
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos"

interface Props{
    pigmentos: InventarioPigmento[]
    onActualizado: (pigmento: InventarioPigmento) => void
}

export default function TablaInventarioPigmentos({pigmentos, onActualizado}: Props){
    const [pigmentoSeleccionado, setPigmentoSeleccionado] = useState<InventarioPigmento | null>(null)
    const [dialogAbierto, setDialogAbierto] = useState<"ajustar" | "historial" | null>(null)

    const abrirDialog = (tipo: "ajustar" | "historial",pigmento: InventarioPigmento) => {
        setPigmentoSeleccionado(pigmento)
        setDialogAbierto(tipo)
    }

    const cerrarDialog = () => {
        setPigmentoSeleccionado(null)
        setDialogAbierto(null)
    }

    return(
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Color</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Stock actual</TableHead>
                        <TableHead>Stock mínimo</TableHead>
                        <TableHead>Último movimiento</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {pigmentos.map((pigmento) => {
                        const stockBajo = pigmento.stockActual < pigmento.stockMinimo
                        return(
                            <TableRow key={pigmento.id} className={stockBajo ? "bg-red-50 dark:bg-red-950/20" : ""}>
                                <TableCell>
                                    {pigmento.color}
                                </TableCell>
                                <TableCell>
                                    <Badge className={colorCategoria[pigmento.categoriaColor]}>{pigmento.categoriaColor}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={colorTipo[pigmento.tipo]}>{pigmento.tipo}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className={stockBajo ? "text-red-600 font-medium" : ""}>
                                        {pigmento.stockActual} kg
                                        </span>
                                        {stockBajo && (
                                        <AlertTriangle size={14} className="text-red-600" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{pigmento.stockMinimo} Kg</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{pigmento.ultimoMovimiento}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => abrirDialog("ajustar", pigmento)}>
                                            Ajuste manual
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => abrirDialog("historial", pigmento)}>
                                            Historial de ajustes
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}

                    {pigmentos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No hay Pigmentos registrados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>

            <DialogAjusteManualPigmento
               open={dialogAbierto === "ajustar"}
               pigmento={pigmentoSeleccionado}
               onClose={cerrarDialog}
               onSuccess={onActualizado} 
            />

            <DialogHistorialMovimientos
                open={dialogAbierto === "historial"}
                onClose={cerrarDialog}
                inventarioId={pigmentoSeleccionado?.id ?? ""}
                tipoInventario="pigmentos"
                titulo={pigmentoSeleccionado?.color ?? ""}
                subtitulo={pigmentoSeleccionado?.categoriaColor}
            />
        </>
    )
}