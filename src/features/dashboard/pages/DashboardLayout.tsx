import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'


export default function DashboardLayout() {

  return (
    <div className="flex w-full h-screen fixed">
      <Sidebar />
      <main className='flex-5'>
        <Header></Header>
        <Outlet />
      </main>
    </div>
  )
}