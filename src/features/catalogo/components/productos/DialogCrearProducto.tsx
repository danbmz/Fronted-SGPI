import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearProductoSchema, type CrearProductoInput } from "../../schemas/productos";
import { useCrearProducto } from "../../hooks/useProducto";
import { TIPO_MATERIAL } from "@/types/enums";
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
    onClose: () => void
}

export default function DialogCrearProducto({open, onClose}: Props) {
    const { register, handleSubmit, reset, setValue, watch, 
        formState: {errors, isSubmitting}} = useForm<CrearProductoInput>({
            resolver: zodResolver(crearProductoSchema)
        })

    const crearMutation = useCrearProducto()

    const onSubmit = async (data: CrearProductoInput) => {
        try {
            await crearMutation.mutateAsync(data)
            toast.success("Producto agregado exitosamente")
            handleClose();
        } catch (error) {
            handleClose();
            toast.error(error instanceof Error ? error.message : "Error al crear el producto")
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
                <DialogTitle>Nuevo Producto</DialogTitle>
                <DialogDescription>
                    Registra un nuevo producto en el catálogo.
                </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                    <Label>Código de producto</Label>
                    <Input {...register("codigo")} placeholder="Ej. 07503025176529" />
                    {errors.codigo && <p className="text-xs text-red-500">{errors.codigo.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Nombre</Label>
                    <Input {...register("nombre")} placeholder="Ej. Jarra 3L" />
                    {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Descripción</Label>
                    <Input {...register("descripcion")} placeholder="Ej. Jarra de plástico con tapa" />
                    {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <Label>Tipo</Label>
                        <Input {...register("tipo")} placeholder="Ej. Jarra" />
                        {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                    <Label>Material</Label>
                    <Select
                        value={watch("tipoMaterial") ?? ""}
                        onValueChange={(val) =>
                        setValue("tipoMaterial", val as (typeof TIPO_MATERIAL)[number], { shouldValidate: true })
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                        {TIPO_MATERIAL.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                    <Label>Cavidades</Label>
                    <Input
                        type="number"
                        {...register("cavidades", { valueAsNumber: true })}
                        placeholder="Ej. 1"
                    />
                    {errors.cavidades && <p className="text-xs text-red-500">{errors.cavidades.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                    <Label>Ciclo estándar (seg)</Label>
                    <Input
                        type="number"
                        {...register("ciclo", { valueAsNumber: true })}
                    />
                    {errors.ciclo && <p className="text-xs text-red-500">{errors.ciclo.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                    <Label>Peso unitario (gr)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register("peso", { valueAsNumber: true })}
                        placeholder="100"
                    />
                    {errors.peso && <p className="text-xs text-red-500">{errors.peso.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                    <Label>Piezas por empaque</Label>
                    <Input
                        type="number"
                        {...register("piezasPorEmpaque", { valueAsNumber: true })}
                        placeholder="Ej. 12"
                    />
                    {errors.piezasPorEmpaque && <p className="text-xs text-red-500">{errors.piezasPorEmpaque.message}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <Label>Precio</Label>
                    <Input
                    type="number"
                    step="0.01"
                    {...register("precio", { valueAsNumber: true })}
                    placeholder="0.00"
                    />
                    {errors.precio && <p className="text-xs text-red-500">{errors.precio.message}</p>}
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear producto"}
                    </Button>
                </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}