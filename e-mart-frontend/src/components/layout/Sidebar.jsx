import { NavLink, useLocation } from 'react-router-dom'
import {
  IoHomeOutline, IoGridOutline, IoCartOutline, IoWalletOutline,
  IoPersonOutline, IoStorefrontOutline, IoPeopleOutline,
  IoDocumentsOutline, IoAnalyticsOutline, IoShieldOutline,
  IoSettingsOutline, IoLeafOutline, IoChevronForwardOutline,
  IoChatbubbleOutline, IoCloseOutline, IoLogOutOutline,
} from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'

const SIDEBAR_WIDTH = 240

const Sidebar = ({ isOpen, isDesktop, onClose }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Close sidebar on route change (mobile only)
  // We achieve this by passing onClose to NavLink onClick

  const farmerLinks = [
    { to: '/farmer/dashboard', icon: IoHomeOutline,      label: 'Dashboard'      },
    { to: '/farmer/products',  icon: IoStorefrontOutline,label: 'My Products'    },
    { to: '/farmer/orders',    icon: IoCartOutline,      label: 'Orders'         },
    { to: '/farmer/sales',     icon: IoWalletOutline,    label: 'Sales & Earnings'},
    { to: '/farmer/messages',  icon: IoChatbubbleOutline,label: 'Messages'       },
    { to: '/farmer/profile',   icon: IoPersonOutline,    label: 'Profile'        },
  ]

  const buyerLinks = [
    { to: '/buyer/dashboard',   icon: IoHomeOutline,      label: 'Dashboard'  },
    { to: '/buyer/marketplace', icon: IoGridOutline,      label: 'Marketplace'},
    { to: '/buyer/orders',      icon: IoCartOutline,      label: 'My Orders'  },
    { to: '/buyer/messages',    icon: IoChatbubbleOutline,label: 'Messages'   },
    { to: '/buyer/profile',     icon: IoPersonOutline,    label: 'Profile'    },
  ]

  const adminLinks = [
    { to: '/admin/dashboard',     icon: IoHomeOutline,      label: 'Dashboard'    },
    { to: '/admin/users',         icon: IoPeopleOutline,    label: 'Users'        },
    { to: '/admin/verifications', icon: IoShieldOutline,    label: 'Verifications'},
    { to: '/admin/listings',      icon: IoStorefrontOutline,label: 'Listings'     },
    { to: '/admin/transactions',  icon: IoWalletOutline,    label: 'Transactions' },
    { to: '/admin/disputes',      icon: IoDocumentsOutline, label: 'Disputes'     },
    { to: '/admin/reports',       icon: IoAnalyticsOutline, label: 'Reports'      },
    { to: '/admin/settings',      icon: IoSettingsOutline,  label: 'Settings'     },
  ]

  const links = user?.role === 'farmer' ? farmerLinks
              : user?.role === 'buyer'  ? buyerLinks
              : user?.role === 'admin'  ? adminLinks
              : []

  const roleConfig = {
    farmer: { label: 'Farmer Portal', color: '#15803d', gradient: 'linear-gradient(135deg, #16a34a, #15803d)', accent: '#f0fdf4', accentBorder: '#bbf7d0' },
    buyer:  { label: 'Buyer Portal',  color: '#1d4ed8', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)', accent: '#eff6ff', accentBorder: '#bfdbfe' },
    admin:  { label: 'Admin Portal',  color: '#7e22ce', gradient: 'linear-gradient(135deg, #9333ea, #7e22ce)', accent: '#faf5ff', accentBorder: '#e9d5ff' },
  }[user?.role] || { label: 'Portal', color: '#525252', gradient: '#737373', accent: '#f5f5f5', accentBorder: '#e5e5e5' }

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const handleNavClick = () => {
    // On mobile, close after navigation
    if (!isDesktop) onClose()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');

        .sl-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; font-size: 0.86rem; font-weight: 500;
          color: #737373; transition: all 0.15s; position: relative;
          font-family: 'Sora', system-ui, sans-serif;
          white-space: nowrap;
        }
        .sl-link:hover { background: #f5f5f5; color: #171717; }
        .sl-link.active { background: #f0fdf4; color: #15803d; font-weight: 600; }
        .sl-link.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 999px; background: #16a34a;
        }
        .sl-logout:hover { background: #fff1f2; color: #ef4444; }
        .sl-logout {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 10px;
          font-size: 0.86rem; font-weight: 500; color: #a3a3a3;
          border: none; background: none; cursor: pointer;
          font-family: 'Sora', system-ui, sans-serif;
          transition: all 0.15s; text-align: left;
        }
      `}</style>

      {/* Mobile overlay — only shown on mobile when open */}
      {!isDesktop && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: `${SIDEBAR_WIDTH}px`,
        background: 'white',
        borderRight: '1px solid #f0f0f0',
        zIndex: 50,
        // Desktop: slide in/out but content shifts via margin
        // Mobile: overlay drawer
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isOpen && !isDesktop ? '4px 0 24px rgba(0,0,0,0.1)' : 'none',
        overflowY: 'auto',
      }}>

        {/* Brand + close button */}
        <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid #f5f5f5', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IoLeafOutline size={16} color="white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 900, color: '#15803d', letterSpacing: '-0.02em' }}>E-MART</span>
            </div>
            {/* Close button — always visible so user can collapse */}
            <button
              onClick={onClose}
              style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', flexShrink: 0 }}
            >
              <IoCloseOutline size={16} />
            </button>
          </div>

          {/* User card */}
          <div style={{ background: roleConfig.accent, borderRadius: '11px', padding: '11px', border: `1px solid ${roleConfig.accentBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: roleConfig.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: 700, color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: roleConfig.color, fontWeight: 600 }}>{roleConfig.label}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#d4d4d4', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 12px 4px', margin: 0 }}>
            Menu
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={({ isActive }) => `sl-link${isActive ? ' active' : ''}`}
            >
              <link.icon size={17} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 10px 16px', borderTop: '1px solid #f5f5f5', flexShrink: 0 }}>
          <button className="sl-logout" onClick={logout}>
            <IoLogOutOutline size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar