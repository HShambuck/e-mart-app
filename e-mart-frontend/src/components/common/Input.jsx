import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseStyles = 'px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200'
  const normalStyles = 'border-neutral-300 focus:ring-primary-500 focus:border-transparent'
  const errorStyles = 'border-red-500 focus:ring-red-500'
  const disabledStyles = 'bg-neutral-100 cursor-not-allowed'
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const inputStyles = `${baseStyles} ${error ? errorStyles : normalStyles} ${disabled ? disabledStyles : ''} ${widthClass} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputStyles}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {!error && helperText && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input