import { useState, useRef, useEffect } from 'react'
import { IoNotifications } from 'react-icons/io5'
import { useNotification } from '../../hooks/useNotification'
import NotificationList from './NotificationList'

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { unreadCount } = useNotification()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <IoNotifications size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 animate-slide-down">
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default NotificationBell