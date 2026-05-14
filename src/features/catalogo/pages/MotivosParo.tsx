import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getMotivosParo } from "../services/motivosService";
import type { MotivoParo } from "@/types/motivosCatalogo";
import TablaMotivosParo from "../components/motivosParo/TablaMotivos";
import DialogCrearMotivoParo from "../components/motivosParo/DialogCrearMotivo";

export default function MotivosParo() {
    const [ motivosParo, setMotivosParo ] = useState<MotivoParo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)


    useEffect(() => {
        const fetchMotivos = async () => {
            try {
            const data = await getMotivosParo()
            setMotivosParo(data)
            } catch {
            setError("Error al cargar máquinas")
            } finally {
            setLoading(false)
            }
        }
        fetchMotivos()
    }, [])

    const handleMotivoCreado = (nuevoMotivo: MotivoParo) => {
        setMotivosParo(prev => [...prev, nuevoMotivo])
    }

    const handleMotivoEditado = (motivoEditado: MotivoParo) => {
        setMotivosParo(prev =>
        prev.map(m => m.id === motivoEditado.id ? motivoEditado : m)
        )
    }

    const handleMotivoDesactivado = (motivoDesactivado: MotivoParo) => {
        setMotivosParo(prev =>
        prev.map(m => m.id === motivoDesactivado.id ? { ...m, activo: false } : m)
        )
    }

    const handleMotivoReactivado = (motivoReactivado: MotivoParo) => {
        setMotivosParo(prev =>
        prev.map(m => m.id === motivoReactivado.id ? { ...m, activo: true } : m)
        )
    }

    return (
        <div className="flex flex-col gap-4 h-screen p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Gestiona el catálogo de motivos de paro durante producción.
                    </p>
                </div>
                <Button className="cursor-pointer bg-gray-800 hover:bg-gray-700" onClick={() => setDialogCrearAbierto(true)}>
                    <Plus size={16} className="mr-2" />
                    Nueva máquina
                </Button>
            </div>

            {loading && <p className="text-muted-foreground">Cargando motivos...</p>}
            {error && <p className="text-red-500">{error}</p>}
    
            {!loading && !error && (
            <TablaMotivosParo
                motivosParo={motivosParo}
                onMotivoEditado={handleMotivoEditado}
                onMotivoDesactivado={handleMotivoDesactivado}
                onMotivoReactivado={handleMotivoReactivado}
                />
            )}


            <DialogCrearMotivoParo
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
                onSuccess={handleMotivoCreado}
            />
        </div>
    )
}