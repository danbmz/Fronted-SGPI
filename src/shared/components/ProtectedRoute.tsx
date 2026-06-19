import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import type { Role } from '@/types/usuario'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

const roleDashboard = {
  admin: "/admin/dashboard",
  supervisor: "/supervisor/ordenes",
  molino: "/molino/pendientes",
  pigmentos: "/pigmentos/ordenes",
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={roleDashboard[role]} replace />
  }

  return <Outlet />
}