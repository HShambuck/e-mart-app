import { useState } from 'react'
import { FaUser } from 'react-icons/fa'

const Avatar = ({ 
  src, 
  alt = 'User',
  size = 'md',
  name,
  online = false,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  const showImage = src && !imageError

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-primary-100 flex items-center justify-center`}>
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : name ? (
          <span className="font-medium text-primary-700">
            {getInitials(name)}
          </span>
        ) : (
          <FaUser className="text-primary-600" />
        )}
      </div>
      
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  )
}

export default Avatar