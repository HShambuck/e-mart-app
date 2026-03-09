import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const SIDEBAR_WIDTH = 240

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  // Track screen size
  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      // Auto-open sidebar on desktop, close on mobile
      if (desktop) setSidebarOpen(true)
      else setSidebarOpen(false)
    }

    // Set initial state
    if (window.innerWidth >= 1024) setSidebarOpen(true)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggle = () => setSidebarOpen(prev => !prev)

  // On desktop: sidebar pushes content (margin-left)
  // On mobile: sidebar overlays content (drawer)
  const contentMargin = isDesktop && sidebarOpen ? SIDEBAR_WIDTH : 0

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Sora', system-ui, sans-serif" }}>

      <Sidebar
        isOpen={sidebarOpen}
        isDesktop={isDesktop}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Wrapper shifts right when sidebar is open on desktop */}
      <div style={{
        marginLeft: contentMargin,
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header onMenuClick={toggle} sidebarOpen={sidebarOpen} />

        <main style={{ flex: 1, padding: '28px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Navigation