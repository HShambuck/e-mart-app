import { IoClose, IoCheckmarkCircle, IoWarning, IoInformationCircle, IoAlertCircle } from 'react-icons/io5'

const Alert = ({ 
  type = 'info',
  title,
  message,
  onClose,
  className = '' 
}) => {
  const types = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: <IoCheckmarkCircle className="w-5 h-5 text-green-400" />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: <IoAlertCircle className="w-5 h-5 text-red-400" />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <IoWarning className="w-5 h-5 text-yellow-400" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <IoInformationCircle className="w-5 h-5 text-blue-400" />,
    },
  }

  const currentType = types[type]

  return (
    <div className={`border rounded-lg p-4 ${currentType.container} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {currentType.icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {message && (
            <div className="text-sm">{message}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 inline-flex text-current hover:opacity-75 transition-opacity"
          >
            <IoClose className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert