const Card = ({
  children,
  className = '',
  hover = false,
  padding = true,
  shadow = true,
  onClick,
  style = {},
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        padding: padding ? '24px' : undefined,
        boxShadow: shadow ? '0 1px 8px rgba(0,0,0,0.05)' : 'none',
        cursor: onClick || hover ? 'pointer' : 'default',
        transition: hover || onClick ? 'box-shadow 0.2s ease, transform 0.2s ease' : undefined,
        ...style,
      }}
      className={className}
      onMouseEnter={hover || onClick ? (e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      } : undefined}
      onMouseLeave={hover || onClick ? (e) => {
        e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      } : undefined}
    >
      {children}
    </div>
  )
}

export default Card