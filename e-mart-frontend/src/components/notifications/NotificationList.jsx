import { useNotification } from '../../hooks/useNotification'
import NotificationItem from './NotificationItem'
import Button from '../common/Button'
import Loader from '../common/Loader'

const NotificationList = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotification()

  if (loading) {
    return (
      <div className="p-8">
        <Loader size="md" />
      </div>
    )
  }

  return (
    <div className="max-h-[32rem] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={clearAllNotifications}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}

export default NotificationList