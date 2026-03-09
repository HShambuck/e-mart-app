import { formatRelativeTime } from '../../utils/formatters'
import { useNotification } from '../../hooks/useNotification'
import { IoCheckmarkCircle, IoClose } from 'react-icons/io5'

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotification()

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
    // Navigate to related page if link exists
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    deleteNotification(notification._id)
  }

  const getIcon = () => {
    const icons = {
      order: '📦',
      payment: '💰',
      message: '💬',
      verification: '✅',
      system: '🔔',
    }
    return icons[notification.type] || icons.system
  }

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-primary-50/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.isRead ? 'font-semibold text-neutral-900' : 'text-neutral-700'}`}>
            {notification.title}
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
          )}
          <button
            onClick={handleDelete}
            className="text-neutral-400 hover:text-red-600 transition-colors"
          >
            <IoClose size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem