import { forwardRef } from 'react'
import { ImSpinner2 } from 'react-icons/im'

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #16a34a, #15803d)',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #ca8a04, #a16207)',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(202,138,4,0.25)',
  },
  outline: {
    background: 'transparent',
    color: '#15803d',
    border: '1.5px solid #16a34a',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#525252',
    border: 'none',
    boxShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(239,68,68,0.25)',
  },
  success: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(34,197,94,0.25)',
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    border: 'none',
    boxShadow: '0 2px 8px rgba(245,158,11,0.25)',
  },
}

const sizeStyles = {
  sm: { padding: '7px 14px', fontSize: '0.82rem', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '0.92rem', borderRadius: '10px' },
  lg: { padding: '12px 28px', fontSize: '1rem', borderRadius: '11px' },
  xl: { padding: '15px 36px', fontSize: '1.1rem', borderRadius: '12px' },
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  style = {},
  ...props
}, ref) => {
  const vStyle = variantStyles[variant] || variantStyles.primary
  const sStyle = sizeStyles[size] || sizeStyles.md

  const isDisabled = disabled || loading

  const hoverMap = {
    primary: { opacity: 0.88 },
    secondary: { opacity: 0.88 },
    outline: { background: '#f0fdf4' },
    ghost: { background: '#f5f5f5' },
    danger: { opacity: 0.88 },
    success: { opacity: 0.88 },
    warning: { opacity: 0.88 },
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        fontWeight: 600,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'opacity 0.15s, background 0.15s, transform 0.15s',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        ...vStyle,
        ...sStyle,
        ...style,
      }}
      onMouseEnter={!isDisabled ? (e) => {
        const h = hoverMap[variant]
        if (h) Object.assign(e.currentTarget.style, h)
        e.currentTarget.style.transform = 'translateY(-1px)'
      } : undefined}
      onMouseLeave={!isDisabled ? (e) => {
        if (variant === 'outline') e.currentTarget.style.background = 'transparent'
        else if (variant === 'ghost') e.currentTarget.style.background = 'transparent'
        else e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'translateY(0)'
      } : undefined}
      {...props}
    >
      {loading && <ImSpinner2 style={{ animation: 'spin 1s linear infinite' }} size={14} />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </button>
  )
})

Button.displayName = 'Button'

export default Button