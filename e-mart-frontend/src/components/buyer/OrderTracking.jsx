import { IoWarningOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { formatDate } from '../../utils/formatters'

const F = "'Sora', system-ui, sans-serif"

const steps = [
  { status:'pending',              label:'Order Placed',       desc:'Waiting for farmer to accept',       emoji:'📝' },
  { status:'accepted',             label:'Order Accepted',     desc:'Farmer has accepted your order',     emoji:'✅' },
  { status:'payment_pending',      label:'Payment Required',   desc:'Please complete payment to proceed', emoji:'💳' },
  { status:'payment_confirmed',    label:'Payment Confirmed',  desc:'Payment received and verified',      emoji:'💰' },
  { status:'ready_for_collection', label:'Ready for Pickup',   desc:'Your order is ready for collection', emoji:'📦' },
  { status:'completed',            label:'Completed',          desc:'Thank you for your purchase!',       emoji:'🎉' },
]

const OrderTracking = ({ order }) => {
  const currentIdx = steps.findIndex(s => s.status === order.status)
  const isCancelled = order.status === 'cancelled'
  const isDisputed  = order.status === 'disputed'

  if (isCancelled || isDisputed) {
    return (
      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:24, textAlign:'center', fontFamily:F }}>
        <IoWarningOutline size={40} color="#ef4444" style={{ marginBottom:10 }}/>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#991b1b', margin:'0 0 6px' }}>
          {isCancelled ? 'Order Cancelled' : 'Order Disputed'}
        </p>
        <p style={{ fontSize:'.85rem', color:'#b91c1c', margin:0 }}>
          {order.cancellationReason || order.disputeReason || 'No reason provided'}
        </p>
      </div>
    )
  }

  const current = steps[currentIdx]

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Current status banner */}
      <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe', borderRadius:14, padding:'18px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontSize:'2.2rem' }}>{current?.emoji}</span>
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#1e3a8a', margin:'0 0 3px' }}>{current?.label}</p>
          <p style={{ fontSize:'.83rem', color:'#2563eb', margin:'0 0 3px' }}>{current?.desc}</p>
          {order.statusUpdatedAt && <p style={{ fontSize:'.75rem', color:'#93c5fd', margin:0 }}>Updated {formatDate(order.statusUpdatedAt)}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div>
        {steps.map((step, i) => {
          const done    = i <= currentIdx
          const current = i === currentIdx
          const last    = i === steps.length - 1
          return (
            <div key={step.status} style={{ display:'flex', gap:14 }}>
              {/* Spine */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.15rem', background: done?'#eff6ff':'#f5f5f5', border:`2px solid ${done?'#2563eb':'#e5e5e5'}`, flexShrink:0 }}>
                  {step.emoji}
                </div>
                {!last && <div style={{ width:2, flex:1, minHeight:24, background: i < currentIdx ? '#2563eb' : '#f0f0f0', margin:'4px 0' }}/>}
              </div>

              {/* Content */}
              <div style={{ flex:1, paddingBottom: last ? 0 : 16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <p style={{ margin:0, fontSize:'.88rem', fontWeight: done?700:500, color: done?'#111':'#a3a3a3' }}>{step.label}</p>
                  {current && <span style={{ padding:'2px 8px', borderRadius:'999px', background:'#dbeafe', color:'#1d4ed8', fontSize:'.68rem', fontWeight:700 }}>Current</span>}
                  {done && !current && <IoCheckmarkCircle size={15} color="#2563eb"/>}
                </div>
                <p style={{ margin:0, fontSize:'.78rem', color: done?'#737373':'#d4d4d4' }}>{step.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment CTA */}
      {order.status === 'payment_pending' && (
        <div style={{ marginTop:20, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
          <IoWarningOutline size={20} color="#d97706" style={{ flexShrink:0, marginTop:2 }}/>
          <div>
            <p style={{ fontWeight:700, color:'#92400e', fontSize:'.88rem', margin:'0 0 5px' }}>Payment Required</p>
            <p style={{ fontSize:'.8rem', color:'#b45309', margin:'0 0 10px' }}>Please complete payment to proceed with your order</p>
            <a href={`/buyer/payment/${order._id}`} style={{ textDecoration:'none' }}>
              <button style={{ padding:'8px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#d97706,#b45309)', color:'#fff', fontWeight:700, fontSize:'.82rem', cursor:'pointer', fontFamily:F }}>
                Make Payment
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Ready for collection */}
      {order.status === 'ready_for_collection' && (
        <div style={{ marginTop:20, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'14px 16px' }}>
          <p style={{ fontWeight:700, color:'#1e40af', fontSize:'.88rem', margin:'0 0 4px' }}>Ready for Collection</p>
          <p style={{ fontSize:'.82rem', color:'#2563eb', margin:0 }}>
            Your order is ready. Collect from: <strong>{order.pickupLocation}</strong>
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderTracking