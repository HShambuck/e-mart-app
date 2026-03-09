import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  IoArrowBack,
  IoCall,
  IoMail,
  IoLocation,
  IoCalendar,
  IoCheckmarkCircle,
  IoClose,
  IoReceipt,
} from 'react-icons/io5'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import OrderTracking from '../../components/buyer/OrderTracking'
import orderService from '../../api/services/orderService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState({ isOpen: false, reason: '' })
  const [confirmModal, setConfirmModal] = useState(false)
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    rating: 5,
    review: '',
  })

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrder(id)
      setOrder(data.order)
    } catch (error) {
      toast.error('Failed to fetch order details')
      navigate('/buyer/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!cancelModal.reason) {
      toast.error('Please provide a reason for cancellation')
      return
    }

    try {
      await orderService.cancelOrder(id, cancelModal.reason)
      toast.success('Order cancelled successfully')
      setCancelModal({ isOpen: false, reason: '' })
      fetchOrderDetails()
    } catch (error) {
      toast.error('Failed to cancel order')
    }
  }

  const handleConfirmDelivery = async () => {
    try {
      await orderService.confirmDelivery(id)
      toast.success('Delivery confirmed! Thank you for your purchase.')
      setConfirmModal(false)
      setReviewModal({ ...reviewModal, isOpen: true })
      fetchOrderDetails()
    } catch (error) {
      toast.error('Failed to confirm delivery')
    }
  }

  const handleSubmitReview = async () => {
    try {
      await orderService.confirmDelivery(id, reviewModal.rating, reviewModal.review)
      toast.success('Review submitted successfully!')
      setReviewModal({ isOpen: false, rating: 5, review: '' })
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading order details..." />
  }

  const canCancel = ['pending', 'accepted'].includes(order.status)
  const canPay = order.status === 'payment_pending'
  const canConfirm = order.status === 'ready_for_collection'

  return (
    <div className="page-container max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/buyer/orders"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <IoArrowBack className="mr-2" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-header">Order #{order.orderNumber}</h1>
            <p className="text-neutral-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(order.status)} size="lg">
            {formatOrderStatus(order.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Order Status
            </h2>
            <OrderTracking order={order} />
          </Card>

          {/* Product Details */}
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Product Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Rice Variety</span>
                <span className="font-medium text-neutral-900">
                  {order.product?.variety}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Bag Size</span>
                <span className="font-medium text-neutral-900">
                  {order.product?.bagSize}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Quantity</span>
                <span className="font-medium text-neutral-900">
                  {order.quantity} bags
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Price per Bag</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(order.pricePerBag)}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="text-lg font-semibold text-neutral-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </Card>

          {/* Pickup Details */}
          {order.pickupLocation && (
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Pickup Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IoLocation className="text-primary-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-600">Location</p>
                    <p className="font-medium text-neutral-900">
                      {order.pickupLocation}
                    </p>
                  </div>
                </div>
                {order.pickupDate && (
                  <div className="flex items-start gap-3">
                    <IoCalendar className="text-primary-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-neutral-600">Pickup Date</p>
                      <p className="font-medium text-neutral-900">
                        {formatDate(order.pickupDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Your Notes
              </h2>
              <p className="text-neutral-700">{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Farmer Information */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Farmer Information
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={order.farmer?.avatar}
                name={order.farmer?.name}
                size="lg"
              />
              <div>
                <p className="font-semibold text-neutral-900">
                  {order.farmer?.name}
                </p>
                {order.farmer?.isVerified && (
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${order.farmer?.phone}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <IoCall className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-neutral-600">Phone</p>
                  <p className="font-medium text-neutral-900">
                    {order.farmer?.phone}
                  </p>
                </div>
              </a>

              {order.farmer?.email && (
                <a
                  href={`mailto:${order.farmer?.email}`}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <IoMail className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-neutral-600">Email</p>
                    <p className="font-medium text-neutral-900">
                      {order.farmer?.email}
                    </p>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <IoLocation className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-neutral-600">Location</p>
                  <p className="font-medium text-neutral-900">
                    {order.farmer?.location}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              {canPay && (
                <Link to={`/buyer/payment/${order._id}`}>
                  <Button
                    variant="success"
                    fullWidth
                    leftIcon={<IoReceipt />}
                  >
                    Make Payment
                  </Button>
                </Link>
              )}

              {canConfirm && (
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => setConfirmModal(true)}
                  leftIcon={<IoCheckmarkCircle />}
                >
                  Confirm Delivery
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setCancelModal({ isOpen: true, reason: '' })}
                  leftIcon={<IoClose />}
                >
                  Cancel Order
                </Button>
              )}

              <Button variant="outline" fullWidth>
                Message Farmer
              </Button>

              <Button variant="ghost" fullWidth>
                Report Issue
              </Button>
            </div>
          </Card>

          {/* Payment Status */}
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Payment Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Method</span>
                <span className="font-medium text-neutral-900">
                  {order.paymentMethod || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Status</span>
                <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                  {order.paymentStatus || 'Pending'}
                </Badge>
              </div>
              {order.transactionRef && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Reference</span>
                  <span className="font-mono text-sm text-neutral-900">
                    {order.transactionRef}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, reason: '' })}
        title="Cancel Order"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setCancelModal({ isOpen: false, reason: '' })}
            >
              Keep Order
            </Button>
            <Button variant="danger" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Are you sure you want to cancel this order?
          </p>
          <textarea
            value={cancelModal.reason}
            onChange={(e) =>
              setCancelModal({ ...cancelModal, reason: e.target.value })
            }
            placeholder="Please provide a reason for cancellation..."
            rows="4"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
      </Modal>

      {/* Confirm Delivery Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Delivery"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setConfirmModal(false)}>
              Not Yet
            </Button>
            <Button variant="success" onClick={handleConfirmDelivery}>
              Confirm Delivery
            </Button>
          </div>
        }
      >
        <p className="text-neutral-700">
          Have you received your order in good condition? Confirming delivery will
          release payment to the farmer.
        </p>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, rating: 5, review: '' })}
        title="Rate Your Experience"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() =>
                setReviewModal({ isOpen: false, rating: 5, review: '' })
              }
            >
              Skip
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setReviewModal({ ...reviewModal, rating: star })
                  }
                  className="text-3xl transition-transform hover:scale-110"
                >
                  {star <= reviewModal.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Review (Optional)</label>
            <textarea
              value={reviewModal.review}
              onChange={(e) =>
                setReviewModal({ ...reviewModal, review: e.target.value })
              }
              placeholder="Share your experience with this farmer..."
              rows="4"
              className="input"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

const getStatusVariant = (status) => {
  const variants = {
    pending: 'warning',
    accepted: 'info',
    payment_pending: 'warning',
    payment_confirmed: 'success',
    ready_for_collection: 'success',
    completed: 'success',
    cancelled: 'danger',
    disputed: 'danger',
  }
  return variants[status] || 'default'
}

const getPaymentStatusVariant = (status) => {
  const variants = {
    pending: 'warning',
    held: 'info',
    released: 'success',
    failed: 'danger',
  }
  return variants[status] || 'default'
}

const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    accepted: 'Accepted',
    payment_pending: 'Payment Required',
    payment_confirmed: 'Payment Confirmed',
    ready_for_collection: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  }
  return statusMap[status] || status
}

export default OrderDetails