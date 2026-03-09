import { Link } from 'react-router-dom'
import { IoEye, IoCheckmark, IoClose, IoCall, IoTimeOutline, IoStorefrontOutline } from 'react-icons/io5'
import { formatCurrency, formatDate } from '../../utils/formatters'

const statusConfig = {
  pending:              { label:'Pending',         bg:'#fef9c3', color:'#854d0e' },
  accepted:             { label:'Accepted',         bg:'#dbeafe', color:'#1e40af' },
  payment_pending:      { label:'Awaiting Payment', bg:'#fff7ed', color:'#9a3412' },
  payment_confirmed:    { label:'Paid',             bg:'#dcfce7', color:'#166534' },
  ready_for_collection: { label:'Ready',            bg:'#dcfce7', color:'#166534' },
  completed:            { label:'Completed',        bg:'#dcfce7', color:'#166534' },
  cancelled:            { label:'Cancelled',        bg:'#fee2e2', color:'#991b1b' },
  disputed:             { label:'Disputed',         bg:'#fee2e2', color:'#991b1b' },
}

const OrderList = ({ orders = [], onAccept, onReject, emptyMessage = 'No orders yet' }) => {
  if (orders.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'56px 20px', background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', fontFamily:"'Sora', system-ui, sans-serif" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <IoTimeOutline size={28} color="#86efac" />
        </div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>{emptyMessage}</p>
        <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:0 }}>New orders from buyers will appear here</p>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, fontFamily:"'Sora', system-ui, sans-serif" }}>
      {orders.map((order) => {
        const sc = statusConfig[order.status] || { label:order.status, bg:'#f5f5f5', color:'#525252' }
        const isPending = order.status === 'pending'
        const canReject = ['pending','accepted'].includes(order.status)

        const buyerInitials = order.buyer?.name
          ? order.buyer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
          : '?'

        return (
          <div key={order._id} style={{
            background:'#fff', borderRadius:14, border:'1px solid #f0f0f0',
            boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:18,
            transition:'box-shadow .2s',
          }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.08)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.04)'}
          >
            {/* Top row */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14, gap:12, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.73rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                  {order.buyer?.avatar
                    ? <img src={order.buyer.avatar} alt="" style={{ width:'100%', height:'100%', borderRadius:9, objectFit:'cover' }} />
                    : buyerInitials}
                </div>
                <div>
                  <p style={{ margin:'0 0 2px', fontWeight:700, fontSize:'.88rem', color:'#111' }}>{order.buyer?.name}</p>
                  <p style={{ margin:0, fontSize:'.73rem', color:'#a3a3a3' }}>#{order.orderNumber} · {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <span style={{ padding:'4px 12px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap' }}>
                {sc.label}
              </span>
            </div>

            {/* Product grid */}
            <div style={{ background:'#f9fafb', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <IoStorefrontOutline size={13} color="#16a34a" />
                <span style={{ fontSize:'.82rem', fontWeight:700, color:'#111' }}>{order.product?.variety}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                {[
                  ['Bag Size',   `${order.product?.bagSize}kg`],
                  ['Quantity',   `${order.quantity} bags`],
                  ['Price/bag',  formatCurrency(order.pricePerBag)],
                  ['Total',      formatCurrency(order.totalAmount)],
                ].map(([l,v],i) => (
                  <div key={l} style={i===3 ? { gridColumn:'span 1' } : {}}>
                    <p style={{ margin:'0 0 2px', fontSize:'.65rem', color:'#a3a3a3', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em' }}>{l}</p>
                    <p style={{ margin:0, fontSize:'.85rem', fontWeight:i===3?800:600, color:i===3?'#16a34a':'#111' }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Link to={`/farmer/orders/${order._id}`} style={{ flex:1, minWidth:80, textDecoration:'none' }}>
                <button style={{ width:'100%', padding:'9px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'border-color .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#a3a3a3'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e5e5'}>
                  <IoEye size={14}/> View
                </button>
              </Link>

              {isPending && onAccept && (
                <button onClick={()=>onAccept(order._id)} style={{ flex:1, minWidth:80, padding:'9px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow:'0 2px 8px rgba(22,163,74,.25)' }}>
                  <IoCheckmark size={14}/> Accept
                </button>
              )}

              {canReject && onReject && (
                <button onClick={()=>onReject(order._id)} style={{ flex:1, minWidth:80, padding:'9px', borderRadius:9, border:'1.5px solid #fecaca', background:'#fff5f5', color:'#dc2626', fontWeight:600, fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                  <IoClose size={14}/> Reject
                </button>
              )}

              {order.buyer?.phone && (
                <a href={`tel:${order.buyer.phone}`} style={{ textDecoration:'none' }}>
                  <button style={{ padding:'9px 12px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#16a34a', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <IoCall size={15}/>
                  </button>
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderList