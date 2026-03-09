import { ImSpinner2 } from 'react-icons/im'

const Loader = ({ 
  size = 'md', 
  fullScreen = false,
  text = '',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const loader = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <ImSpinner2 
        className={`${sizes[size]} animate-spin text-primary-600`}
      />
      {text && (
        <p className="mt-4 text-sm text-neutral-600">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {loader}
      </div>
    )
  }

  return loader
}

export default Loader