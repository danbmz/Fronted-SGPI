import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useSessionTimeout } from '@/features/auth/hooks/useSessionTimeOut'


export default function DashboardLayout() {
  useSessionTimeout()

  return (
    <div className="flex w-full h-screen fixed overflow-hidden">
      <Sidebar />
      <main className='flex-5 overflow-auto'>
        <Header></Header>
        <Outlet />
      </main>
    </div>
  )
}