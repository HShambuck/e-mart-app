import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoReceipt, IoEye, IoCalendar } from 'react-icons/io5'
import Badge from '../common/Badge'
import Loader from '../common/Loader'
import Pagination from '../common/Pagination'
import orderService from '../../api/services/orderService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const statusVariants = {
  pending: 'warning', accepted: 'info', payment_pending: 'warning',
  payment_confirmed: 'success', ready_for_collection: 'success',
  completed: 'success', cancelled: 'danger', disputed: 'danger',
}
const statusLabels = {
  pending: 'Pending', accepted: 'Accepted', payment_pending: 'Payment Due',
  payment_confirmed: 'Paid', ready_for_collection: 'Ready for Pickup',
  completed: 'Completed', cancelled: 'Cancelled', disputed: 'Disputed',
}

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 8

  useEffect(() => {
    fetchOrders()
  }, [currentPage])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getBuyerOrders({ page: currentPage, limit: PAGE_SIZE, status: 'completed' })
      setOrders(data.orders || [])
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE))
    } catch (error) {
      toast.error('Failed to load purchase history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader size="md" text="Loading history..." />

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <IoReceipt size={28} color="#d4d4d4" />
        </div>
        <p style={{ color: '#737373', fontWeight: 500, margin: '0 0 6px', fontSize: '1rem' }}>No purchase history yet</p>
        <p style={{ fontSize: '0.85rem', color: '#a3a3a3', margin: 0 }}>Completed orders will appear here</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['Order #', 'Product', 'Farmer', 'Qty', 'Amount', 'Date', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f5f5f5' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '13px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#171717', whiteSpace: 'nowrap' }}>
                  #{order.orderNumber}
                </td>
                <td style={{ padding: '13px 14px', fontSize: '0.88rem', color: '#171717', fontWeight: 500 }}>
                  {order.product?.variety}
                  <div style={{ fontSize: '0.75rem', color: '#a3a3a3', fontWeight: 400 }}>{order.product?.bagSize}kg bags</div>
                </td>
                <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: '#525252' }}>
                  {order.farmer?.name}
                </td>
                <td style={{ padding: '13px 14px', fontSize: '0.85rem', color: '#171717' }}>
                  {order.quantity}
                </td>
                <td style={{ padding: '13px 14px', fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap' }}>
                  {formatCurrency(order.totalAmount)}
                </td>
                <td style={{ padding: '13px 14px', fontSize: '0.82rem', color: '#737373', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IoCalendar size={13} />
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                    background: order.status === 'completed' ? '#dcfce7' : order.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                    color: order.status === 'completed' ? '#166534' : order.status === 'cancelled' ? '#991b1b' : '#854d0e',
                  }}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td style={{ padding: '13px 14px' }}>
                  <Link to={`/buyer/orders/${order._id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                    <IoEye size={14} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: '20px' }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory