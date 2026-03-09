import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  IoArrowBack, IoCall, IoMail, IoLocationOutline, IoCalendarOutline,
  IoCheckmarkCircle, IoCloseOutline, IoChatbubbleOutline,
  IoStorefrontOutline, IoShieldCheckmark, IoReceiptOutline,
} from 'react-icons/io5'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"

const statusConfig = {
  pending:              { label:'Pending',         bg:'#fef9c3', color:'#854d0e' },
  accepted:             { label:'Accepted',         bg:'#dbeafe', color:'#1e40af' },
  payment_pending:      { label:'Awaiting Payment', bg:'#fff7ed', color:'#9a3412' },
  payment_confirmed:    { label:'Paid',             bg:'#dcfce7', color:'#166534' },
  ready_for_collection: { label:'Ready for Pickup', bg:'#dcfce7', color:'#166534' },
  completed:            { label:'Completed',        bg:'#dcfce7', color:'#166534' },
  cancelled:            { label:'Cancelled',        bg:'#fee2e2', color:'#991b1b' },
  disputed:             { label:'Disputed',         bg:'#fee2e2', color:'#991b1b' },
}

const paymentStatusConfig = {
  pending:  { label:'Pending',    bg:'#fef9c3', color:'#854d0e' },
  held:     { label:'In Escrow',  bg:'#dbeafe', color:'#1e40af' },
  released: { label:'Released',   bg:'#dcfce7', color:'#166534' },
  failed:   { label:'Failed',     bg:'#fee2e2', color:'#991b1b' },
}

const timeline = [
  { status:'pending',              label:'Order Placed',       emoji:'📝' },
  { status:'accepted',             label:'Accepted',           emoji:'✅' },
  { status:'payment_confirmed',    label:'Payment Confirmed',  emoji:'💰' },
  { status:'ready_for_collection', label:'Ready for Pickup',   emoji:'📦' },
  { status:'completed',            label:'Completed',          emoji:'🎉' },
]

const card = { background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:22, marginBottom:16 }
const sectionHead = { fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }
const rowStyle = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f5f5f5' }

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order,       setOrder]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [modal,       setModal]       = useState({ open:false, status:null, note:'' })
  const [updating,    setUpdating]    = useState(false)

  useEffect(() => { fetchOrder() }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrder(id)
      setOrder(data.order)
    } catch {
      toast.error('Failed to load order')
      navigate('/farmer/orders')
    } finally { setLoading(false) }
  }

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      await orderService.updateOrderStatus(id, modal.status, modal.note)
      toast.success('Status updated!')
      setModal({ open:false, status:null, note:'' })
      fetchOrder()
    } catch { toast.error('Failed to update status') }
    finally  { setUpdating(false) }
  }

  if (loading) return <Loader fullScreen text="Loading order…" />

  const sc  = statusConfig[order.status]  || { label:order.status,  bg:'#f5f5f5', color:'#525252' }
  const psc = paymentStatusConfig[order.paymentStatus] || { label: order.paymentStatus || 'Pending', bg:'#f5f5f5', color:'#525252' }
  const currentIdx = timeline.findIndex(t => t.status === order.status)

  const buyerInitials = order.buyer?.name
    ? order.buyer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
    : '?'

  return (
    <div style={{ fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* ── Back + title ── */}
      <div style={{ marginBottom:24 }}>
        <Link to="/farmer/orders" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#16a34a', fontWeight:600, fontSize:'.85rem', textDecoration:'none', marginBottom:14 }}>
          <IoArrowBack size={15}/> Back to Orders
        </Link>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, color:'#111', margin:'0 0 4px' }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ color:'#a3a3a3', fontSize:'.85rem', margin:0 }}>Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span style={{ padding:'5px 14px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'.78rem', fontWeight:700 }}>{sc.label}</span>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ ...card }}>
        <p style={sectionHead}><IoReceiptOutline size={16} color="#16a34a"/>Order Progress</p>
        <div style={{ display:'flex', alignItems:'center', overflowX:'auto' }}>
          {timeline.map((t, i) => (
            <div key={t.status} style={{ display:'flex', alignItems:'center', flex: i < timeline.length-1 ? 1 : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:72 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', background: i <= currentIdx ? '#f0fdf4' : '#f5f5f5', border: i <= currentIdx ? '2px solid #16a34a' : '2px solid #e5e5e5', marginBottom:6 }}>
                  {t.emoji}
                </div>
                <p style={{ margin:0, fontSize:'.68rem', fontWeight: i <= currentIdx ? 700 : 500, color: i <= currentIdx ? '#15803d' : '#a3a3a3', textAlign:'center', lineHeight:1.3 }}>{t.label}</p>
              </div>
              {i < timeline.length-1 && (
                <div style={{ flex:1, height:3, borderRadius:999, background: i < currentIdx ? 'linear-gradient(90deg,#16a34a,#22c55e)' : '#f0f0f0', margin:'0 6px', marginBottom:20, minWidth:20 }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Two column layout ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}>

        {/* Left column */}
        <div>
          {/* Product details */}
          <div style={card}>
            <p style={sectionHead}><IoStorefrontOutline size={16} color="#16a34a"/>Product Details</p>
            {[
              ['Rice Variety',   order.product?.variety],
              ['Bag Size',       `${order.product?.bagSize}kg`],
              ['Quantity',       `${order.quantity} bags`],
              ['Price per Bag',  formatCurrency(order.pricePerBag)],
            ].map(([l,v]) => (
              <div key={l} style={rowStyle}>
                <span style={{ fontSize:'.85rem', color:'#737373' }}>{l}</span>
                <span style={{ fontSize:'.88rem', fontWeight:600, color:'#111' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:14, marginTop:4 }}>
              <span style={{ fontSize:'.95rem', fontWeight:700, color:'#111' }}>Total Amount</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#16a34a' }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Pickup */}
          {order.pickupLocation && (
            <div style={card}>
              <p style={sectionHead}><IoLocationOutline size={16} color="#16a34a"/>Pickup Details</p>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <IoLocationOutline size={17} color="#16a34a"/>
                </div>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'.73rem', color:'#a3a3a3', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>Location</p>
                  <p style={{ margin:0, fontSize:'.9rem', fontWeight:600, color:'#111' }}>{order.pickupLocation}</p>
                </div>
              </div>
              {order.pickupDate && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IoCalendarOutline size={17} color="#16a34a"/>
                  </div>
                  <div>
                    <p style={{ margin:'0 0 2px', fontSize:'.73rem', color:'#a3a3a3', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>Pickup Date</p>
                    <p style={{ margin:0, fontSize:'.9rem', fontWeight:600, color:'#111' }}>{formatDate(order.pickupDate)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div style={card}>
              <p style={sectionHead}><IoReceiptOutline size={16} color="#16a34a"/>Order Notes</p>
              <p style={{ fontSize:'.88rem', color:'#525252', lineHeight:1.7, margin:0 }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Buyer info */}
          <div style={card}>
            <p style={sectionHead}><IoShieldCheckmark size={16} color="#16a34a"/>Buyer</p>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.82rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                {order.buyer?.avatar ? <img src={order.buyer.avatar} alt="" style={{ width:'100%', height:'100%', borderRadius:11, objectFit:'cover' }}/> : buyerInitials}
              </div>
              <div>
                <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'.92rem', color:'#111' }}>{order.buyer?.name}</p>
                {order.buyer?.isVerified && (
                  <span style={{ fontSize:'.68rem', fontWeight:700, color:'#166534', background:'#dcfce7', padding:'2px 8px', borderRadius:'999px' }}>✓ Verified</span>
                )}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <a href={`tel:${order.buyer?.phone}`} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:'#f9fafb', textDecoration:'none', transition:'background .12s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#f0fdf4'}
                onMouseLeave={e=>e.currentTarget.style.background='#f9fafb'}>
                <IoCall size={16} color="#16a34a"/>
                <div>
                  <p style={{ margin:'0 0 1px', fontSize:'.68rem', color:'#a3a3a3', fontWeight:600 }}>PHONE</p>
                  <p style={{ margin:0, fontSize:'.85rem', fontWeight:600, color:'#111' }}>{order.buyer?.phone}</p>
                </div>
              </a>
              {order.buyer?.email && (
                <a href={`mailto:${order.buyer.email}`} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:'#f9fafb', textDecoration:'none', transition:'background .12s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f0fdf4'}
                  onMouseLeave={e=>e.currentTarget.style.background='#f9fafb'}>
                  <IoMail size={16} color="#16a34a"/>
                  <div>
                    <p style={{ margin:'0 0 1px', fontSize:'.68rem', color:'#a3a3a3', fontWeight:600 }}>EMAIL</p>
                    <p style={{ margin:0, fontSize:'.85rem', fontWeight:600, color:'#111' }}>{order.buyer?.email}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={card}>
            <p style={sectionHead}><IoCheckmarkCircle size={16} color="#16a34a"/>Actions</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {order.status === 'pending' && <>
                <button onClick={()=>setModal({ open:true, status:'accepted', note:'' })} style={{ padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F, boxShadow:'0 3px 10px rgba(22,163,74,.25)' }}>
                  Accept Order
                </button>
                <button onClick={()=>setModal({ open:true, status:'cancelled', note:'' })} style={{ padding:'11px', borderRadius:10, border:'1.5px solid #fecaca', background:'#fff5f5', color:'#dc2626', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>
                  Reject Order
                </button>
              </>}
              {order.status === 'payment_confirmed' && (
                <button onClick={()=>setModal({ open:true, status:'ready_for_collection', note:'' })} style={{ padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>
                  Mark Ready for Pickup
                </button>
              )}
              {order.status === 'ready_for_collection' && (
                <button onClick={()=>setModal({ open:true, status:'completed', note:'' })} style={{ padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  <IoCheckmarkCircle size={16}/> Mark Completed
                </button>
              )}
              <button style={{ padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <IoChatbubbleOutline size={15}/> Message Buyer
              </button>
            </div>
          </div>

          {/* Payment status */}
          <div style={card}>
            <p style={sectionHead}><IoReceiptOutline size={16} color="#16a34a"/>Payment</p>
            <div style={rowStyle}>
              <span style={{ fontSize:'.82rem', color:'#737373' }}>Method</span>
              <span style={{ fontSize:'.85rem', fontWeight:600, color:'#111' }}>{order.paymentMethod || '—'}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12 }}>
              <span style={{ fontSize:'.82rem', color:'#737373' }}>Status</span>
              <span style={{ padding:'4px 12px', borderRadius:'999px', background:psc.bg, color:psc.color, fontSize:'.72rem', fontWeight:700 }}>{psc.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Modal ── */}
      {modal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={()=>setModal({ open:false, status:null, note:'' })}>
          <div style={{ background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:440, boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Confirm Status Update</h3>
              <button onClick={()=>setModal({ open:false, status:null, note:'' })}
                style={{ width:28, height:28, borderRadius:7, border:'none', background:'#f5f5f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#737373' }}>
                <IoCloseOutline size={15}/>
              </button>
            </div>
            <p style={{ fontSize:'.88rem', color:'#525252', marginBottom:14, lineHeight:1.6 }}>
              Update this order to <strong style={{ color:'#111' }}>{modal.status?.replace(/_/g,' ')}</strong>?
            </p>
            <textarea value={modal.note} onChange={e=>setModal(m=>({...m,note:e.target.value}))}
              placeholder="Add a note (optional)" rows={3}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e5e5e5', fontSize:'.88rem', fontFamily:F, outline:'none', resize:'vertical', lineHeight:1.6, boxSizing:'border-box', marginBottom:16 }}
              onFocus={e=>{e.target.style.borderColor='#16a34a';e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,.1)'}}
              onBlur={e=>{e.target.style.borderColor='#e5e5e5';e.target.style.boxShadow='none'}}
            />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setModal({ open:false, status:null, note:'' })}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={updating}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor: updating?'not-allowed':'pointer', fontFamily:F, opacity: updating?.6:1 }}>
                {updating ? 'Updating…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails