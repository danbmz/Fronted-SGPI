import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearProductoSchema,type CrearProducto } from "@/validations/catalogo/productosValidations";
import { editarProducto } from "../../services/productosService";
import type { Producto, TipoProducto } from "@/validations/catalogo/productosValidations";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
    open: boolean
    producto: Producto | null
    onClose: () => void
    onSuccess: (producto: Producto) => void
}

const tiposProductos: TipoProducto[] = ["Jarra", "Plato", "Vaso", "Colador", "Cubeta"]

export default function DialogEditarProducto({open, producto, onClose, onSuccess}: Props) {
    const { user } = useAuth()
    const { register, handleSubmit, reset, setValue, watch, 
        formState: {errors, isSubmitting, isDirty}} = useForm<CrearProducto>({
            resolver: zodResolver(crearProductoSchema)
        })


    useEffect(() => {
        if(producto) {
            reset(producto)
        }
    }, [producto, setValue])

    const onSubmit = async (data: CrearProducto) => {
        if(!user || !producto) return
        try {
            const productoEditado = await editarProducto(producto.id, data, producto, user)
            toast.success("Producto actualizado exitosamente")
            onSuccess(productoEditado)
            reset()
            onClose()
        } catch (error) {
            toast.error("Error al actualizar el producto")
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del producto para actualizarlo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                        <Label>Código de producto</Label>
                        <Input {...register("codigo")} placeholder="Ej. JU-PVL1"/>
                        {errors.codigo && <p className="text-xs text-red-500">{errors.codigo.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Nombre</Label>
                        <Input {...register("nombre")} placeholder="Ej. Jarra 3L" />
                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <Label>Tipo</Label>
                            <Select 
                                value={watch("tipo") ?? ""}
                                onValueChange={val => setValue("tipo", val as TipoProducto, { shouldValidate: true, shouldDirty: true})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposProductos.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Cavidades</Label>
                            <Input
                              type="number"
                              step="0.01"
                              {...register("cavidades", {valueAsNumber: true})}
                              placeholder="Ej. 1"
                            />
                            {errors.cavidades && <p className="text-xs text-red-500">{errors.cavidades.message}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Ciclo estándar (seg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("ciclo", { valueAsNumber: true})}
                        />
                        {errors.ciclo && <p className="text-xs text-red-500">{errors.ciclo.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Peso unitario (gr)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("peso", { valueAsNumber: true})}
                          placeholder="100gr"
                        />
                        {errors.peso && <p className="text-xs text-red-500">{errors.peso.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting || !isDirty}>
                            {isSubmitting ? "Guardando" : "Guardar cambios"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}