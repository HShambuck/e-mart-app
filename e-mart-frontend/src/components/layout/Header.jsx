import { Link } from 'react-router-dom'
import {
  IoMenuOutline, IoLogOutOutline, IoPersonOutline,
  IoSettingsOutline, IoLeafOutline, IoChevronDownOutline, IoCloseOutline,
} from 'react-icons/io5'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

const Header = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const roleBadge = {
    farmer: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    buyer:  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    admin:  { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  }[user?.role] || { bg: '#f5f5f5', color: '#525252', border: '#e5e5e5' }

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <header style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      fontFamily: "'Sora', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        .hdr-btn {
          width: 36px; height: 36px; border-radius: 9px; border: none;
          background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #737373; transition: background 0.15s, color 0.15s;
        }
        .hdr-btn:hover { background: #f5f5f5; color: #171717; }
        .dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px; cursor: pointer;
          font-size: 0.85rem; font-weight: 500; color: #404040;
          transition: background 0.15s; border: none; background: none;
          width: 100%; text-align: left; font-family: inherit;
        }
        .dd-item:hover { background: #f5f5f5; }
        .dd-danger { color: #ef4444 !important; }
        .dd-danger:hover { background: #fff1f2 !important; }
      `}</style>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px' }}>

          {/* Left: menu toggle + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="hdr-btn"
              onClick={onMenuClick}
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen
                ? <IoCloseOutline size={21} />
                : <IoMenuOutline size={21} />
              }
            </button>

            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoLeafOutline size={15} color="white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 900, color: '#15803d', letterSpacing: '-0.02em' }}>E-MART</span>
            </Link>

            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', background: roleBadge.bg, color: roleBadge.color, border: `1px solid ${roleBadge.border}`, textTransform: 'capitalize', letterSpacing: '0.03em' }}>
              {user?.role}
            </span>
          </div>

          {/* Right: notifications + user menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <NotificationBell />

            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px 5px 5px', borderRadius: '10px',
                  border: '1px solid #f0f0f0',
                  background: dropdownOpen ? '#f9f9f9' : 'white',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden' }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#262626', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <IoChevronDownOutline size={13} color="#a3a3a3" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '210px', background: 'white', borderRadius: '13px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', padding: '6px', zIndex: 100 }}>
                  {/* User info */}
                  <div style={{ padding: '10px 12px 11px', borderBottom: '1px solid #f5f5f5', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.73rem', color: '#a3a3a3', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || user?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button className="dd-item" onClick={() => { window.location.href = `/${user?.role}/profile`; setDropdownOpen(false) }}>
                    <IoPersonOutline size={15} /> My Profile
                  </button>
                  <button className="dd-item" onClick={() => { window.location.href = `/${user?.role}/settings`; setDropdownOpen(false) }}>
                    <IoSettingsOutline size={15} /> Settings
                  </button>

                  <div style={{ height: '1px', background: '#f5f5f5', margin: '5px 0' }} />

                  <button className="dd-item dd-danger" onClick={() => { logout(); setDropdownOpen(false) }}>
                    <IoLogOutOutline size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header