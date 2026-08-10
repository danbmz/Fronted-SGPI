import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import type { Role } from '@/types/enums'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

const roleDashboard = {
  ADMIN: "/admin/dashboard",
  SUPERVISOR: "/supervisor/ordenes",
  MOLINO: "/molino/pendientes",
  PIGMENTOS: "/pigmentos/ordenes",
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, cargando } = useAuth()

  if (cargando) {
    return <div>Cargando...</div> // o un spinner real de tu diseño
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={roleDashboard[role]} replace />
  }

  return <Outlet />
}