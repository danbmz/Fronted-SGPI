import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useSessionTimeout } from '@/features/auth/hooks/useSessionTimeout'
import { Toaster } from 'sonner'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  useSessionTimeout()

  return (
    <div className="flex w-full h-screen fixed overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />
      <main className='flex-5 overflow-auto'>
        <Header></Header>
        <Outlet />
      </main>
      <Toaster richColors/>
    </div>
  )
}