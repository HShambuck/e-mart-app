import { NavLink } from 'react-router-dom'
import { IoHome, IoGrid, IoCart, IoMail, IoPerson } from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'

const MobileNav = () => {
  const { user } = useAuth()

  const farmerLinks = [
    { to: '/farmer/dashboard', icon: IoHome, label: 'Home' },
    { to: '/farmer/products', icon: IoGrid, label: 'Products' },
    { to: '/farmer/orders', icon: IoCart, label: 'Orders' },
    { to: '/farmer/messages', icon: IoMail, label: 'Messages' },
    { to: '/farmer/profile', icon: IoPerson, label: 'Profile' },
  ]

  const buyerLinks = [
    { to: '/buyer/dashboard', icon: IoHome, label: 'Home' },
    { to: '/buyer/marketplace', icon: IoGrid, label: 'Shop' },
    { to: '/buyer/orders', icon: IoCart, label: 'Orders' },
    { to: '/buyer/messages', icon: IoMail, label: 'Messages' },
    { to: '/buyer/profile', icon: IoPerson, label: 'Profile' },
  ]

  const getLinks = () => {
    return user?.role === 'farmer' ? farmerLinks : buyerLinks
  }

  const links = getLinks()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex justify-around">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-neutral-500'
              }`
            }
          >
            <link.icon size={24} />
            <span className="text-xs mt-1">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav