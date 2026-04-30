import { NavLink } from 'react-router-dom'

interface SidebarLink {
  label: string
  to: string
}

interface SidebarProps {
  links: SidebarLink[]
}

export default function Sidebar({ links }: SidebarProps) {
  return (
    <aside>
      {links.map(link => (
        <NavLink key={link.to} to={link.to}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  )
}