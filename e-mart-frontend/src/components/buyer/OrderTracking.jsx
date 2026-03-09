import { IoCheckmarkCircle, IoTime, IoWarning } from 'react-icons/io5'
import Badge from '../common/Badge'
import { formatDate } from '../../utils/formatters'

const OrderTracking = ({ order }) => {
  const statusSteps = [
    {
      status: 'pending',
      label: 'Order Placed',
      description: 'Waiting for farmer to accept',
      icon: '📝',
    },
    {
      status: 'accepted',
      label: 'Order Accepted',
      description: 'Farmer has accepted your order',
      icon: '✅',
    },
    {
      status: 'payment_pending',
      label: 'Payment Required',
      description: 'Please complete payment',
      icon: '💳',
    },
    {
      status: 'payment_confirmed',
      label: 'Payment Confirmed',
      description: 'Payment received and verified',
      icon: '💰',
    },
    {
      status: 'ready_for_collection',
      label: 'Ready for Pickup',
      description: 'Your order is ready for collection',
      icon: '📦',
    },
    {
      status: 'completed',
      label: 'Order Completed',
      description: 'Thank you for your purchase!',
      icon: '🎉',
    },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status)
  const isCancelled = order.status === 'cancelled'
  const isDisputed = order.status === 'disputed'

  if (isCancelled || isDisputed) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <IoWarning className="mx-auto text-red-500 mb-3" size={48} />
        <h3 className="font-semibold text-red-900 mb-2">
          {isCancelled ? 'Order Cancelled' : 'Order Disputed'}
        </h3>
        <p className="text-red-700">
          {order.cancellationReason || order.disputeReason || 'No reason provided'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{statusSteps[currentStepIndex]?.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary-900 mb-1">
              {statusSteps[currentStepIndex]?.label}
            </h3>
            <p className="text-primary-700">
              {statusSteps[currentStepIndex]?.description}
            </p>
            {order.statusUpdatedAt && (
              <p className="text-sm text-primary-600 mt-2">
                Updated {formatDate(order.statusUpdatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={step.status} className="flex items-start gap-4">
              {/* Icon */}
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted
                      ? 'bg-primary-100 border-2 border-primary-600'
                      : 'bg-neutral-100 border-2 border-neutral-300'
                  }`}
                >
                  {step.icon}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-12 w-0.5 h-8 -translate-x-1/2 ${
                      index < currentStepIndex ? 'bg-primary-600' : 'bg-neutral-300'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-semibold ${
                      isCompleted ? 'text-neutral-900' : 'text-neutral-500'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && <Badge variant="info" size="sm">Current</Badge>}
                  {isCompleted && !isCurrent && (
                    <IoCheckmarkCircle className="text-primary-600" size={20} />
                  )}
                </div>
                <p
                  className={`text-sm ${
                    isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment Action */}
      {order.status === 'payment_pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <IoWarning className="text-yellow-600 mt-0.5" size={24} />
            <div className="flex-1">
              <p className="font-medium text-yellow-900 mb-2">Payment Required</p>
              <p className="text-sm text-yellow-700 mb-3">
                Please complete payment to proceed with your order
              </p>
              <a href={`/buyer/payment/${order._id}`}>
                <button className="btn-primary">
                  Make Payment
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Confirmation */}
      {order.status === 'ready_for_collection' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-medium text-blue-900 mb-2">Ready for Collection</p>
          <p className="text-sm text-blue-700">
            Your order is ready. Please collect from: <strong>{order.pickupLocation}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderTracking