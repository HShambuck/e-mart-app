import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { IoArrowBack, IoShieldCheckmark, IoPhonePortraitOutline, IoCardOutline, IoWalletOutline, IoCheckmarkCircle } from 'react-icons/io5'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import paymentService from '../../api/services/paymentService'
import { formatCurrency } from '../../utils/formatters'
import { PAYMENT_METHODS } from '../../utils/constants'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"
const card = { background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:24, marginBottom:16 }
const rowStyle = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #f5f5f5' }
const focusBlue = e => { e.target.style.borderColor='#2563eb'; e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)' }
const blurReset = e => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }

const methodIcons = {
  mtn_momo:        IoPhonePortraitOutline,
  vodafone_cash:   IoPhonePortraitOutline,
  airteltigo_money:IoPhonePortraitOutline,
  bank_transfer:   IoWalletOutline,
  paystack:        IoCardOutline,
}

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order,          setOrder]          = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [processing,     setProcessing]     = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [phoneNumber,    setPhoneNumber]    = useState('')

  useEffect(() => { fetchOrder() }, [orderId])

  const fetchOrder = async () => {
    try { setLoading(true); const d = await orderService.getOrder(orderId); setOrder(d.order) }
    catch { toast.error('Failed to load order'); navigate('/buyer/orders') }
    finally { setLoading(false) }
  }

  const isMomo = selectedMethod && selectedMethod !== 'paystack' && selectedMethod !== 'bank_transfer'

  const handlePay = async () => {
    if (!selectedMethod) return toast.error('Please select a payment method')
    if (isMomo && !phoneNumber.trim()) return toast.error('Please enter your mobile money number')
    try {
      setProcessing(true)
      const payload = { orderId: order._id, amount: order.totalAmount, method: selectedMethod, ...(isMomo && { phoneNumber }) }
      if (selectedMethod === 'paystack') {
        const res = await paymentService.cardPayment(payload)
        window.location.href = res.authorizationUrl
      } else {
        await paymentService.mobileMoney(payload)
        toast.success('Payment initiated! Approve the prompt on your phone.')
        setTimeout(() => navigate(`/buyer/orders/${orderId}`), 3000)
      }
    } catch(err) { toast.error(err.response?.data?.message || 'Payment failed') }
    finally { setProcessing(false) }
  }

  if (loading) return <Loader fullScreen text="Loading payment details…"/>

  if (!['payment_pending','accepted'].includes(order.status)) {
    return (
      <div style={{ fontFamily:F, maxWidth:520, margin:'0 auto' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>
        <div style={{ ...card, textAlign:'center', padding:'48px 28px' }}>
          <div style={{ width:64, height:64, borderRadius:16, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <IoCheckmarkCircle size={30} color="#16a34a"/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color:'#111', margin:'0 0 8px' }}>Already Paid</h2>
          <p style={{ fontSize:'.88rem', color:'#737373', margin:'0 0 20px' }}>This order has already been paid for.</p>
          <Link to={`/buyer/orders/${orderId}`} style={{ textDecoration:'none' }}>
            <button style={{ padding:'11px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:F }}>
              View Order Details
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      <div style={{ marginBottom:24 }}>
        <Link to={`/buyer/orders/${orderId}`} style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#2563eb', fontWeight:600, fontSize:'.85rem', textDecoration:'none', marginBottom:14 }}>
          <IoArrowBack size={15}/> Back to Order
        </Link>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, color:'#111', margin:'0 0 5px' }}>Complete Payment</h1>
        <p style={{ color:'#737373', fontSize:'.9rem', margin:0 }}>Secure payment for Order #{order.orderNumber}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' }}>

        {/* Payment form */}
        <div style={card}>
          {/* Amount banner */}
          <div style={{ textAlign:'center', padding:'20px', background:'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius:14, border:'1px solid #bfdbfe', marginBottom:24 }}>
            <p style={{ fontSize:'.72rem', color:'#2563eb', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 4px' }}>Amount Due</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.4rem', fontWeight:900, color:'#1e3a8a', margin:'0 0 4px', letterSpacing:'-.02em' }}>{formatCurrency(order.totalAmount)}</p>
            <p style={{ fontSize:'.8rem', color:'#3b82f6', margin:0 }}>Order #{order.orderNumber}</p>
          </div>

          <p style={{ fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 12px' }}>Select Payment Method</p>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            {PAYMENT_METHODS.map(method => {
              const Icon = methodIcons[method.value] || IoWalletOutline
              const sel = selectedMethod === method.value
              return (
                <button key={method.value} type="button" onClick={()=>setSelectedMethod(method.value)} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12,
                  border:`2px solid ${sel?'#2563eb':'#e5e5e5'}`, background:sel?'#eff6ff':'#fff',
                  cursor:'pointer', fontFamily:F, textAlign:'left', transition:'all .15s',
                }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:sel?'#dbeafe':'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1.2rem' }}>
                    {method.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontWeight:600, fontSize:'.9rem', color:sel?'#1d4ed8':'#111' }}>{method.label}</p>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${sel?'#2563eb':'#d4d4d4'}`, background:sel?'#2563eb':'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {sel && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Momo number */}
          {isMomo && (
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>
                Mobile Money Number <span style={{ color:'#ef4444' }}>*</span>
              </label>
              <div style={{ position:'relative' }}>
                <IoPhonePortraitOutline size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }}/>
                <input type="tel" placeholder="e.g. 0XX XXX XXXX" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)}
                  style={{ width:'100%', padding:'11px 14px 11px 38px', borderRadius:10, border:'1.5px solid #e5e5e5', fontSize:'.88rem', fontFamily:F, outline:'none', boxSizing:'border-box' }}
                  onFocus={focusBlue} onBlur={blurReset}/>
              </div>
              <p style={{ fontSize:'.75rem', color:'#a3a3a3', marginTop:5 }}>You'll receive a prompt on this number to approve payment</p>
            </div>
          )}

          {/* Escrow */}
          <div style={{ display:'flex', gap:12, padding:'14px 16px', background:'#eff6ff', borderRadius:10, border:'1px solid #bfdbfe', marginBottom:20 }}>
            <IoShieldCheckmark size={20} color="#2563eb" style={{ flexShrink:0, marginTop:1 }}/>
            <p style={{ fontSize:'.82rem', color:'#1e40af', margin:0, lineHeight:1.5 }}>
              Your payment is held securely in escrow. Funds are only released after you confirm delivery.
            </p>
          </div>

          <button onClick={handlePay} disabled={!selectedMethod || processing} style={{
            width:'100%', padding:'14px', borderRadius:12,
            background: (!selectedMethod||processing) ? '#e5e5e5' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color: (!selectedMethod||processing) ? '#a3a3a3' : '#fff',
            fontWeight:700, fontSize:'1rem', border:'none',
            cursor: (!selectedMethod||processing) ? 'not-allowed' : 'pointer',
            fontFamily:F, boxShadow: (!selectedMethod||processing) ? 'none' : '0 4px 14px rgba(37,99,235,.3)',
            transition:'all .2s',
          }}>
            {processing ? 'Processing…' : selectedMethod ? `Pay ${formatCurrency(order.totalAmount)}` : 'Select a payment method'}
          </button>
        </div>

        {/* Order summary */}
        <div>
          <div style={card}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:'0 0 16px' }}>Order Summary</p>
            <div>
              <p style={{ fontSize:'.72rem', color:'#a3a3a3', fontWeight:600, margin:'0 0 4px' }}>Product</p>
              <p style={{ fontWeight:700, fontSize:'.92rem', color:'#111', margin:'0 0 14px' }}>{order.product?.variety}</p>
            </div>
            {[
              ['Quantity',    `${order.quantity} bags`],
              ['Price / bag', formatCurrency(order.pricePerBag)],
              ['Bag size',    `${order.product?.bagSize}kg`],
            ].map(([l,v])=>(
              <div key={l} style={rowStyle}>
                <span style={{ fontSize:'.82rem', color:'#737373' }}>{l}</span>
                <span style={{ fontSize:'.85rem', fontWeight:600, color:'#111' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:14 }}>
              <span style={{ fontSize:'.9rem', fontWeight:700, color:'#111' }}>Total</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#2563eb' }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Farmer */}
          <div style={card}>
            <p style={{ fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 12px' }}>Selling Farmer</p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                {order.farmer?.name?.charAt(0)?.toUpperCase()||'?'}
              </div>
              <div>
                <p style={{ margin:0, fontWeight:700, fontSize:'.9rem', color:'#111' }}>{order.farmer?.name}</p>
                <p style={{ margin:0, fontSize:'.78rem', color:'#a3a3a3' }}>{order.farmer?.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment