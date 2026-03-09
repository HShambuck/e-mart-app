import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  IoArrowBack, IoCall, IoMail, IoLocationOutline, IoCalendarOutline,
  IoCheckmarkCircle, IoCloseOutline, IoReceiptOutline, IoChatbubbleOutline,
  IoWarningOutline, IoStarOutline,
} from 'react-icons/io5'
import Loader from '../../components/common/Loader'
import OrderTracking from '../../components/buyer/OrderTracking'
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

const payConfig = {
  pending:  { label:'Pending',   bg:'#fef9c3', color:'#854d0e' },
  held:     { label:'In Escrow', bg:'#dbeafe', color:'#1e40af' },
  released: { label:'Released',  bg:'#dcfce7', color:'#166534' },
  failed:   { label:'Failed',    bg:'#fee2e2', color:'#991b1b' },
}

const card = { background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:22, marginBottom:16 }
const rowStyle = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f5f5f5' }
const sectionHead = { fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal]   = useState({ open:false, reason:'' })
  const [confirmModal, setConfirmModal] = useState(false)
  const [reviewModal, setReviewModal]   = useState({ open:false, rating:5, review:'' })
  const [cancelling, setCancelling] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => { fetchOrder() }, [id])

  const fetchOrder = async () => {
    try { setLoading(true); const d = await orderService.getOrder(id); setOrder(d.order) }
    catch { toast.error('Failed to load order'); navigate('/buyer/orders') }
    finally { setLoading(false) }
  }

  const handleCancel = async () => {
    if (!cancelModal.reason) return toast.error('Please provide a reason')
    try {
      setCancelling(true)
      await orderService.cancelOrder(id, cancelModal.reason)
      toast.success('Order cancelled')
      setCancelModal({ open:false, reason:'' })
      fetchOrder()
    } catch { toast.error('Failed to cancel order') }
    finally { setCancelling(false) }
  }

  const handleConfirmDelivery = async () => {
    try {
      setConfirming(true)
      await orderService.confirmDelivery(id)
      toast.success('Delivery confirmed! Payment released to farmer.')
      setConfirmModal(false)
      setReviewModal(r=>({...r, open:true}))
      fetchOrder()
    } catch { toast.error('Failed to confirm delivery') }
    finally { setConfirming(false) }
  }

  const handleReview = async () => {
    try {
      await orderService.submitReview?.(id, reviewModal.rating, reviewModal.review)
      toast.success('Review submitted!')
      setReviewModal({ open:false, rating:5, review:'' })
    } catch { toast.error('Failed to submit review') }
  }

  if (loading) return <Loader fullScreen text="Loading order…"/>

  const sc  = statusConfig[order.status] || { label:order.status, bg:'#f5f5f5', color:'#525252' }
  const psc = payConfig[order.paymentStatus] || { label:order.paymentStatus||'Pending', bg:'#f5f5f5', color:'#525252' }
  const canCancel  = ['pending','accepted'].includes(order.status)
  const canPay     = order.status === 'payment_pending'
  const canConfirm = order.status === 'ready_for_collection'

  const farmerInitials = order.farmer?.name ? order.farmer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : '?'

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Back + title */}
      <div style={{ marginBottom:24 }}>
        <Link to="/buyer/orders" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#2563eb', fontWeight:600, fontSize:'.85rem', textDecoration:'none', marginBottom:14 }}>
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

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}>

        {/* Left */}
        <div>
          {/* Tracking */}
          <div style={card}>
            <p style={sectionHead}><IoReceiptOutline size={16} color="#2563eb"/>Order Tracking</p>
            <OrderTracking order={order}/>
          </div>

          {/* Product */}
          <div style={card}>
            <p style={sectionHead}><IoReceiptOutline size={16} color="#2563eb"/>Product Details</p>
            {[
              ['Rice Variety', order.product?.variety],
              ['Bag Size',     `${order.product?.bagSize}kg`],
              ['Quantity',     `${order.quantity} bags`],
              ['Price per Bag', formatCurrency(order.pricePerBag)],
            ].map(([l,v])=>(
              <div key={l} style={rowStyle}>
                <span style={{ fontSize:'.85rem', color:'#737373' }}>{l}</span>
                <span style={{ fontSize:'.88rem', fontWeight:600, color:'#111' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:14, marginTop:4 }}>
              <span style={{ fontSize:'.95rem', fontWeight:700, color:'#111' }}>Total Amount</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#2563eb' }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Pickup */}
          {order.pickupLocation && (
            <div style={card}>
              <p style={sectionHead}><IoLocationOutline size={16} color="#2563eb"/>Pickup Details</p>
              {[
                { icon:<IoLocationOutline size={17} color="#2563eb"/>, label:'Location', val:order.pickupLocation },
                order.pickupDate && { icon:<IoCalendarOutline size={17} color="#2563eb"/>, label:'Pickup Date', val:formatDate(order.pickupDate) },
              ].filter(Boolean).map(item=>(
                <div key={item.label} style={{ display:'flex', gap:12, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{item.icon}</div>
                  <div><p style={{ margin:'0 0 2px', fontSize:'.72rem', color:'#a3a3a3', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>{item.label}</p><p style={{ margin:0, fontWeight:600, fontSize:'.9rem', color:'#111' }}>{item.val}</p></div>
                </div>
              ))}
            </div>
          )}

          {order.notes && (
            <div style={card}>
              <p style={sectionHead}><IoReceiptOutline size={16} color="#2563eb"/>Your Notes</p>
              <p style={{ fontSize:'.88rem', color:'#525252', lineHeight:1.7, margin:0 }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div>
          {/* Farmer */}
          <div style={card}>
            <p style={sectionHead}><IoCheckmarkCircle size={16} color="#16a34a"/>Farmer</p>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.82rem', fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden' }}>
                {order.farmer?.avatar ? <img src={order.farmer.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : farmerInitials}
              </div>
              <div>
                <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'.92rem', color:'#111' }}>{order.farmer?.name}</p>
                {order.farmer?.isVerified && <span style={{ fontSize:'.68rem', fontWeight:700, color:'#166534', background:'#dcfce7', padding:'2px 8px', borderRadius:'999px' }}>✓ Verified</span>}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { href:`tel:${order.farmer?.phone}`, icon:<IoCall size={15} color="#16a34a"/>, lab:'PHONE', val:order.farmer?.phone },
                order.farmer?.email && { href:`mailto:${order.farmer.email}`, icon:<IoMail size={15} color="#16a34a"/>, lab:'EMAIL', val:order.farmer?.email },
                { icon:<IoLocationOutline size={15} color="#16a34a"/>, lab:'LOCATION', val:order.farmer?.location },
              ].filter(Boolean).map(item=>(
                <a key={item.lab} href={item.href||'#'} onClick={!item.href?e=>e.preventDefault():undefined}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:'#f9fafb', textDecoration:'none', transition:'background .12s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f0fdf4'} onMouseLeave={e=>e.currentTarget.style.background='#f9fafb'}>
                  {item.icon}
                  <div><p style={{ margin:'0 0 1px', fontSize:'.65rem', color:'#a3a3a3', fontWeight:700 }}>{item.lab}</p><p style={{ margin:0, fontSize:'.85rem', fontWeight:600, color:'#111' }}>{item.val}</p></div>
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={card}>
            <p style={sectionHead}><IoCheckmarkCircle size={16} color="#2563eb"/>Actions</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {canPay && (
                <Link to={`/buyer/payment/${order._id}`} style={{ textDecoration:'none' }}>
                  <button style={{ width:'100%', padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                    <IoReceiptOutline size={15}/> Make Payment
                  </button>
                </Link>
              )}
              {canConfirm && (
                <button onClick={()=>setConfirmModal(true)} style={{ width:'100%', padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  <IoCheckmarkCircle size={15}/> Confirm Delivery
                </button>
              )}
              {canCancel && (
                <button onClick={()=>setCancelModal({ open:true, reason:'' })} style={{ width:'100%', padding:'11px', borderRadius:10, border:'1.5px solid #fecaca', background:'#fff5f5', color:'#dc2626', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  <IoCloseOutline size={15}/> Cancel Order
                </button>
              )}
              <button style={{ width:'100%', padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <IoChatbubbleOutline size={15}/> Message Farmer
              </button>
              <button style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'transparent', color:'#a3a3a3', fontWeight:600, fontSize:'.82rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <IoWarningOutline size={14}/> Report Issue
              </button>
            </div>
          </div>

          {/* Payment */}
          <div style={card}>
            <p style={sectionHead}><IoReceiptOutline size={16} color="#2563eb"/>Payment</p>
            <div style={rowStyle}>
              <span style={{ fontSize:'.82rem', color:'#737373' }}>Method</span>
              <span style={{ fontSize:'.85rem', fontWeight:600, color:'#111' }}>{order.paymentMethod||'—'}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12 }}>
              <span style={{ fontSize:'.82rem', color:'#737373' }}>Status</span>
              <span style={{ padding:'4px 12px', borderRadius:'999px', background:psc.bg, color:psc.color, fontSize:'.72rem', fontWeight:700 }}>{psc.label}</span>
            </div>
            {order.transactionRef && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid #f5f5f5', marginTop:10 }}>
                <span style={{ fontSize:'.78rem', color:'#737373' }}>Ref</span>
                <span style={{ fontFamily:'monospace', fontSize:'.75rem', color:'#111' }}>{order.transactionRef}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {/* Cancel */}
      {cancelModal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={()=>setCancelModal({ open:false, reason:'' })}>
          <div style={{ background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:440, boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Cancel Order</h3>
              <button onClick={()=>setCancelModal({ open:false, reason:'' })} style={{ width:28, height:28, borderRadius:7, border:'none', background:'#f5f5f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><IoCloseOutline size={15}/></button>
            </div>
            <p style={{ fontSize:'.88rem', color:'#525252', marginBottom:14 }}>Are you sure? Please provide a reason:</p>
            <textarea value={cancelModal.reason} onChange={e=>setCancelModal(m=>({...m,reason:e.target.value}))} placeholder="Reason for cancellation…" rows={3}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e5e5e5', fontSize:'.88rem', fontFamily:F, outline:'none', resize:'vertical', boxSizing:'border-box', marginBottom:16 }}
              onFocus={e=>{e.target.style.borderColor='#2563eb';e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)'}}
              onBlur={e=>{e.target.style.borderColor='#e5e5e5';e.target.style.boxShadow='none'}}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setCancelModal({ open:false, reason:'' })} style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>Keep Order</button>
              <button onClick={handleCancel} disabled={cancelling} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:cancelling?'not-allowed':'pointer', fontFamily:F, opacity:cancelling?.6:1 }}>
                {cancelling?'Cancelling…':'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delivery */}
      {confirmModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={()=>setConfirmModal(false)}>
          <div style={{ background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F, textAlign:'center' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ width:56, height:56, borderRadius:14, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <IoCheckmarkCircle size={26} color="#16a34a"/>
            </div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#111', margin:'0 0 10px' }}>Confirm Delivery?</h3>
            <p style={{ fontSize:'.88rem', color:'#525252', margin:'0 0 20px', lineHeight:1.6 }}>
              Have you received your order in good condition? Confirming will release payment to the farmer.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setConfirmModal(false)} style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>Not Yet</button>
              <button onClick={handleConfirmDelivery} disabled={confirming} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:confirming?'not-allowed':'pointer', fontFamily:F, opacity:confirming?.6:1 }}>
                {confirming?'Confirming…':'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review */}
      {reviewModal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={()=>setReviewModal(r=>({...r,open:false}))}>
          <div style={{ background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:440, boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Rate Your Experience</h3>
              <button onClick={()=>setReviewModal(r=>({...r,open:false}))} style={{ width:28, height:28, borderRadius:7, border:'none', background:'#f5f5f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><IoCloseOutline size={15}/></button>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 10px' }}>Rating</p>
              <div style={{ display:'flex', gap:8 }}>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setReviewModal(r=>({...r,rating:s}))} style={{ fontSize:'1.8rem', background:'none', border:'none', cursor:'pointer', transition:'transform .1s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                    {s<=reviewModal.rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={reviewModal.review} onChange={e=>setReviewModal(r=>({...r,review:e.target.value}))} placeholder="Share your experience with this farmer…" rows={3}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e5e5e5', fontSize:'.88rem', fontFamily:F, outline:'none', resize:'vertical', boxSizing:'border-box', marginBottom:16 }}
              onFocus={e=>{e.target.style.borderColor='#2563eb';e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)'}}
              onBlur={e=>{e.target.style.borderColor='#e5e5e5';e.target.style.boxShadow='none'}}/>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setReviewModal(r=>({...r,open:false}))} style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>Skip</button>
              <button onClick={handleReview} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <IoStarOutline size={14}/> Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails