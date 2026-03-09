const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium'
  
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  }
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded'
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedClass} ${className}`}>
      {children}
    </span>
  )
}

export default Badge