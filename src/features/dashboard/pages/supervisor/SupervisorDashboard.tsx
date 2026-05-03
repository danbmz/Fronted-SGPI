import { useAuth } from "@/features/auth/hooks/useAuth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

function SupervisorDashboard() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {

        try {
            await logout();
            navigate("/");

        } catch (err) {
        if (err instanceof Error) {
            setError(err.message)
        } else {
            setError("Error de conexión")
        }
        } finally {
        setLoading(false)
        }
    }


    return (
        <main>
            <h1>Supervisor Dashboard</h1>
            <Button onClick={handleLogout}>
                {loading ? 'Entrando...' : 'Cerrar sesión'}
            </Button>
        </main>
    )
}

export default SupervisorDashboard