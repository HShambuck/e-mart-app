import { Link } from 'react-router-dom'
import { IoEye, IoCheckmark, IoClose, IoCall, IoPersonOutline, IoLayersOutline, IoStorefrontOutline } from 'react-icons/io5'
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

const OrderCard = ({ order, onAccept, onReject }) => {
  const sc = statusConfig[order.status] || { label: order.status, bg:'#f5f5f5', color:'#525252' }
  const canAccept = order.status === 'pending'
  const canReject = ['pending', 'accepted'].includes(order.status)

  const buyerInitials = order.buyer?.name
    ? order.buyer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
    : '?'

  return (
    <div style={{
      background:'#fff', borderRadius:'16px', border:'1px solid #f0f0f0',
      boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:'20px',
      transition:'box-shadow .2s, transform .2s',
      fontFamily:"'Sora', system-ui, sans-serif",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.09)'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.04)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Buyer avatar */}
          <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {order.buyer?.avatar
              ? <img src={order.buyer.avatar} alt="" style={{ width:'100%', height:'100%', borderRadius:10, objectFit:'cover' }} />
              : buyerInitials}
          </div>
          <div>
            <p style={{ margin:'0 0 2px', fontWeight:700, fontSize:'.9rem', color:'#111' }}>{order.buyer?.name}</p>
            <p style={{ margin:0, fontSize:'.73rem', color:'#a3a3a3' }}>#{order.orderNumber} · {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <span style={{ padding:'4px 12px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'.7rem', fontWeight:700, whiteSpace:'nowrap', flexShrink:0 }}>
          {sc.label}
        </span>
      </div>

      {/* Product details strip */}
      <div style={{ background:'#f9fafb', borderRadius:11, padding:'12px 14px', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <IoStorefrontOutline size={14} color="#16a34a" />
          <span style={{ fontSize:'.82rem', fontWeight:700, color:'#111' }}>{order.product?.variety}</span>
          <span style={{ fontSize:'.75rem', color:'#a3a3a3' }}>{order.product?.bagSize}kg bags</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px' }}>
          {[
            ['Quantity', `${order.quantity} bags`],
            ['Price / bag', formatCurrency(order.pricePerBag)],
          ].map(([l,v]) => (
            <div key={l}>
              <p style={{ margin:'0 0 1px', fontSize:'.68rem', color:'#a3a3a3', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>{l}</p>
              <p style={{ margin:0, fontSize:'.88rem', fontWeight:700, color:'#111' }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid #f0f0f0', marginTop:10, paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'.8rem', color:'#737373', fontWeight:500 }}>Total Amount</span>
          <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#16a34a', fontFamily:"'Playfair Display',serif" }}>
            {formatCurrency(order.totalAmount)}
          </span>
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

        {canAccept && onAccept && (
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
}

export default OrderCard