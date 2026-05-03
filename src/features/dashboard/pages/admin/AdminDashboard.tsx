import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
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
        <div className="p-6 h-screen bg-blue-100">
            <h1>Admin Home</h1>
            <Button onClick={handleLogout}>
                {loading ? 'Entrando...' : 'Cerrar sesión'}
            </Button>
        </div>
    )
}

export default AdminDashboard