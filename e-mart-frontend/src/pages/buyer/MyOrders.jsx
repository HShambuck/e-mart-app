import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoCartOutline, IoEyeOutline, IoReceiptOutline, IoStarOutline, IoCallOutline } from 'react-icons/io5'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"

const statusConfig = {
  pending:              { label:'Pending',           bg:'#fef9c3', color:'#854d0e' },
  accepted:             { label:'Accepted',           bg:'#dbeafe', color:'#1e40af' },
  payment_pending:      { label:'Payment Required',   bg:'#fff7ed', color:'#c2410c' },
  payment_confirmed:    { label:'Paid',               bg:'#dcfce7', color:'#166534' },
  ready_for_collection: { label:'Ready for Pickup',   bg:'#dcfce7', color:'#166534' },
  completed:            { label:'Completed',          bg:'#f3e8ff', color:'#6b21a8' },
  cancelled:            { label:'Cancelled',          bg:'#fee2e2', color:'#991b1b' },
  disputed:             { label:'Disputed',           bg:'#fee2e2', color:'#991b1b' },
}

const statusOptions = [
  { value:'all',                  label:'All Orders' },
  { value:'pending',              label:'Pending' },
  { value:'accepted',             label:'Accepted' },
  { value:'payment_pending',      label:'Pay Now' },
  { value:'payment_confirmed',    label:'Paid' },
  { value:'ready_for_collection', label:'Ready' },
  { value:'completed',            label:'Completed' },
  { value:'cancelled',            label:'Cancelled' },
]

const MyOrders = () => {
  const [orders, setOrders]       = useState([])
  const [filtered, setFiltered]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => { setFiltered(filter==='all' ? orders : orders.filter(o=>o.status===filter)) }, [filter, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const d = await orderService.getBuyerOrders()
      setOrders(d.orders||[])
    } catch { toast.error('Failed to fetch orders') }
    finally  { setLoading(false) }
  }

  if (loading) return <Loader fullScreen text="Loading orders…"/>

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <IoCartOutline size={18} color="#2563eb"/>
          <span style={{ fontSize:'.72rem', fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'.08em' }}>Buyer Portal</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:900, color:'#111', margin:'0 0 6px' }}>My Orders</h1>
        <p style={{ color:'#737373', fontSize:'.92rem', margin:0 }}>Track and manage your rice orders</p>
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {statusOptions.map(opt=>(
          <button key={opt.value} onClick={()=>setFilter(opt.value)} style={{
            padding:'7px 16px', borderRadius:10, border:'none',
            background: filter===opt.value ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#f5f5f5',
            color: filter===opt.value ? '#fff' : '#525252',
            fontWeight:700, fontSize:'.8rem', cursor:'pointer', fontFamily:F,
            whiteSpace:'nowrap', flexShrink:0,
            boxShadow: filter===opt.value ? '0 3px 10px rgba(37,99,235,.25)' : 'none',
            transition:'all .15s',
          }}>{opt.label}</button>
        ))}
      </div>

      <p style={{ fontSize:'.82rem', color:'#a3a3a3', marginBottom:16 }}>
        Showing <strong style={{ color:'#111' }}>{filtered.length}</strong> of <strong style={{ color:'#111' }}>{orders.length}</strong> orders
      </p>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 20px', background:'#fff', borderRadius:16, border:'1px solid #f0f0f0' }}>
          <div style={{ width:60, height:60, borderRadius:14, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <IoCartOutline size={26} color="#93c5fd"/>
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>
            {filter!=='all' ? 'No orders in this category' : 'No orders yet'}
          </p>
          <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:'0 0 14px' }}>
            {filter!=='all' ? 'Try a different filter' : 'Start shopping to see orders here'}
          </p>
          {filter==='all' && (
            <Link to="/buyer/marketplace" style={{ textDecoration:'none' }}>
              <button style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:F }}>Browse Products</button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(order => <OrderRow key={order._id} order={order}/>)}
        </div>
      )}
    </div>
  )
}

const OrderRow = ({ order }) => {
  const [hovered, setHovered] = useState(false)
  const sc = statusConfig[order.status] || { label:order.status, bg:'#f5f5f5', color:'#525252' }
  const farmerInitials = order.farmer?.name ? order.farmer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : '?'

  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', padding:20, boxShadow: hovered?'0 6px 20px rgba(0,0,0,.07)':'0 2px 8px rgba(0,0,0,.04)', transition:'all .2s', cursor:'default' }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14, gap:12, flexWrap:'wrap' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:0 }}>{order.product?.variety}</h3>
            <span style={{ padding:'3px 10px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'.7rem', fontWeight:700 }}>{sc.label}</span>
          </div>
          <p style={{ fontSize:'.78rem', color:'#a3a3a3', margin:0 }}>Order #{order.orderNumber} · {formatDate(order.createdAt)}</p>
        </div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:900, color:'#2563eb' }}>{formatCurrency(order.totalAmount)}</span>
      </div>

      {/* Details grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14, padding:'12px 14px', background:'#f9fafb', borderRadius:10 }}>
        {[
          ['Quantity',   `${order.quantity} bags`],
          ['Bag Size',   `${order.product?.bagSize}kg`],
          ['Per Bag',    formatCurrency(order.pricePerBag)],
          ['Total',      formatCurrency(order.totalAmount)],
        ].map(([l,v])=>(
          <div key={l}>
            <p style={{ fontSize:'.68rem', color:'#a3a3a3', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 2px' }}>{l}</p>
            <p style={{ fontSize:'.85rem', fontWeight:700, color:'#111', margin:0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Farmer row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'#f5f5f5', borderRadius:10, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden' }}>
            {order.farmer?.avatar ? <img src={order.farmer.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : farmerInitials}
          </div>
          <div>
            <p style={{ margin:0, fontSize:'.82rem', fontWeight:700, color:'#111' }}>{order.farmer?.name}</p>
            <p style={{ margin:0, fontSize:'.72rem', color:'#a3a3a3' }}>{order.farmer?.location}</p>
          </div>
        </div>
        <a href={`tel:${order.farmer?.phone}`} style={{ textDecoration:'none' }}>
          <button style={{ width:32, height:32, borderRadius:8, background:'#fff', border:'1.5px solid #e5e5e5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IoCallOutline size={14} color="#2563eb"/>
          </button>
        </a>
      </div>

      {/* Action buttons */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <Link to={`/buyer/orders/${order._id}`} style={{ textDecoration:'none' }}>
          <button style={{ padding:'8px 16px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:6 }}>
            <IoEyeOutline size={14}/> View Details
          </button>
        </Link>
        {order.status === 'payment_pending' && (
          <Link to={`/buyer/payment/${order._id}`} style={{ textDecoration:'none' }}>
            <button style={{ padding:'8px 16px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:6 }}>
              <IoReceiptOutline size={14}/> Pay Now
            </button>
          </Link>
        )}
        {order.status === 'completed' && (
          <button style={{ padding:'8px 16px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:6 }}>
            <IoStarOutline size={14}/> Leave Review
          </button>
        )}
      </div>
    </div>
  )
}

export default MyOrders