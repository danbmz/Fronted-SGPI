import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../../auth/hooks/useAuth'

interface NavLink {
  label: string
  to: string
}

const adminLinks: NavLink[] = [
  { label: 'Inicio', to: '/dashboard/admin' },
  { label: 'Órdenes de producción', to: '/dashboard/admin/production-orders' },
]

const supervisorLinks: NavLink[] = [
  { label: 'Inicio', to: '/dashboard/supervisor' },
  { label: 'Avance de turno', to: '/dashboard/supervisor/shift-progress' },
]

export default function DashboardLayout() {
  const { role } = useAuth()

  const links = role === 'admin' ? adminLinks : supervisorLinks

  return (
    <div className="dashboard-wrapper">
      <Sidebar links={links} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}