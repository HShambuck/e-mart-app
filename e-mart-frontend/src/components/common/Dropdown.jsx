import { useState, useRef, useEffect } from 'react'
import { IoChevronDown } from 'react-icons/io5'

const Dropdown = ({ 
  trigger,
  children,
  align = 'left',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignmentClass = align === 'right' ? 'right-0' : 'left-0'

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 transition-colors">
            <span>Options</span>
            <IoChevronDown className="ml-2" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={`absolute ${alignmentClass} mt-2 w-56 rounded-lg bg-white shadow-lg border border-neutral-200 py-1 z-50 animate-slide-down`}>
          {children}
        </div>
      )}
    </div>
  )
}

export const DropdownItem = ({ onClick, children, icon, danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left text-sm flex items-center hover:bg-neutral-50 transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-neutral-700'
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  )
}

export const DropdownDivider = () => {
  return <div className="h-px bg-neutral-200 my-1" />
}

export default Dropdown