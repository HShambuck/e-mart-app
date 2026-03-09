import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoEye, IoReceipt, IoCall } from 'react-icons/io5'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [filterStatus, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getBuyerOrders()
      setOrders(data.orders || [])
      setFilteredOrders(data.orders || [])
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filterStatus))
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'payment_pending', label: 'Payment Pending' },
    { value: 'payment_confirmed', label: 'Paid' },
    { value: 'ready_for_collection', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  if (loading) {
    return <Loader fullScreen text="Loading orders..." />
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-header">My Orders</h1>
        <p className="text-neutral-600">
          Track and manage your rice orders
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {filterStatus !== 'all' ? 'No orders in this category' : 'No orders yet'}
          </h3>
          <p className="text-neutral-600 mb-6">
            {filterStatus !== 'all'
              ? 'Try selecting a different filter'
              : 'Start shopping to see your orders here'}
          </p>
          {filterStatus === 'all' && (
            <Link to="/buyer/marketplace">
              <Button variant="primary">Browse Products</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

const OrderCard = ({ order }) => {
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

  const formatStatus = (status) => {
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

  return (
    <Card hover>
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg text-neutral-900">
                  {order.product?.variety}
                </h3>
                <Badge variant={getStatusVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </div>
              <p className="text-sm text-neutral-600">
                Order #{order.orderNumber} • {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-neutral-600">Quantity</p>
              <p className="font-medium text-neutral-900">{order.quantity} bags</p>
            </div>
            <div>
              <p className="text-xs text-neutral-600">Bag Size</p>
              <p className="font-medium text-neutral-900">{order.product?.bagSize}kg</p>
            </div>
            <div>
              <p className="text-xs text-neutral-600">Price per Bag</p>
              <p className="font-medium text-neutral-900">{formatCurrency(order.pricePerBag)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-600">Total Amount</p>
              <p className="font-semibold text-primary-600 text-lg">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Farmer Info */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <Avatar
              src={order.farmer?.avatar}
              name={order.farmer?.name}
              size="sm"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{order.farmer?.name}</p>
              <p className="text-xs text-neutral-600">{order.farmer?.location}</p>
            </div>
            <a href={`tel:${order.farmer?.phone}`}>
              <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
                <IoCall className="text-primary-600" size={20} />
              </button>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col gap-3 lg:w-48">
          <Link to={`/buyer/orders/${order._id}`} className="flex-1 lg:flex-none">
            <Button variant="primary" size="sm" fullWidth leftIcon={<IoEye />}>
              View Details
            </Button>
          </Link>

          {order.status === 'payment_pending' && (
            <Link to={`/buyer/payment/${order._id}`} className="flex-1 lg:flex-none">
              <Button variant="success" size="sm" fullWidth leftIcon={<IoReceipt />}>
                Make Payment
              </Button>
            </Link>
          )}

          {order.status === 'completed' && (
            <Button variant="outline" size="sm" fullWidth>
              Leave Review
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MyOrders