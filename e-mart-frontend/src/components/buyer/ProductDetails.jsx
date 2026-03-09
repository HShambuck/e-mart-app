import { useState } from 'react'
import {
  IoLocationOutline, IoCalendarOutline, IoHeart, IoHeartOutline,
  IoCall, IoCloseOutline, IoDocumentTextOutline, IoShieldCheckmark,
  IoLayersOutline, IoCheckmarkCircle,
} from 'react-icons/io5'
import { formatCurrency, formatDate } from '../../utils/formatters'
import buyerService from '../../api/services/buyerService'
import orderService from '../../api/services/orderService'
import OrderForm from './OrderForm'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"

const ProductDetails = ({ product, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false)
  const [orderModal, setOrderModal] = useState(false)

  const total = quantity * product.pricePerBag
  const available = product.status === 'available' && product.quantity > 0

  const toggleFav = async () => {
    try {
      if (isFavorite) { await buyerService.removeFromFavorites(product._id); toast.success('Removed from saved') }
      else            { await buyerService.addToFavorites(product._id);      toast.success('Saved!') }
      setIsFavorite(!isFavorite)
    } catch { toast.error('Failed to update') }
  }

  const farmerInitials = product.farmer?.name
    ? product.farmer.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
    : '?'

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24, alignItems:'start' }}>

        {/* ── Left: Image + info ── */}
        <div>
          {/* Image */}
          <div style={{ borderRadius:20, overflow:'hidden', marginBottom:20, height:360, background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {product.images?.length > 0
              ? <img src={product.images[0]} alt={product.variety} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <span style={{ fontSize:'6rem' }}>🌾</span>}
          </div>

          {/* Title row */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontWeight:900, color:'#111', margin:0 }}>{product.variety}</h1>
                <span style={{ padding:'4px 12px', borderRadius:'999px', background:available?'#dcfce7':'#f5f5f5', color:available?'#166534':'#737373', fontSize:'.72rem', fontWeight:700 }}>
                  {available ? 'Available' : 'Out of Stock'}
                </span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.83rem', color:'#737373' }}>
                  <IoLocationOutline size={14}/> {product.location}, {product.region}
                </span>
                {product.harvestDate && (
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.83rem', color:'#737373' }}>
                    <IoCalendarOutline size={14}/> Harvested {formatDate(product.harvestDate)}
                  </span>
                )}
              </div>
            </div>
            <button onClick={toggleFav} style={{ width:44, height:44, borderRadius:12, background:isFavorite?'#fef2f2':'#f5f5f5', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {isFavorite ? <IoHeart size={22} color="#ef4444"/> : <IoHeartOutline size={22} color="#a3a3a3"/>}
            </button>
          </div>

          {/* Price band */}
          <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe', borderRadius:16, padding:'20px 22px', marginBottom:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:'.72rem', fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 4px' }}>Price per bag</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', fontWeight:900, color:'#1d4ed8' }}>{formatCurrency(product.pricePerBag)}</span>
                <span style={{ fontSize:'.9rem', color:'#2563eb' }}>/ {product.bagSize}kg</span>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:'.72rem', color:'#3b82f6', margin:'0 0 4px', fontWeight:600 }}>Stock</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#1e3a8a', margin:0 }}>{product.quantity} bags</p>
            </div>
          </div>

          {/* Quality description */}
          {product.qualityDescription && (
            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:'.75rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 8px', display:'flex', alignItems:'center', gap:6 }}>
                <IoDocumentTextOutline size={13}/> About this rice
              </p>
              <p style={{ fontSize:'.88rem', color:'#525252', lineHeight:1.7, margin:0 }}>{product.qualityDescription}</p>
            </div>
          )}

          {/* Farmer card */}
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #f0f0f0', padding:'16px 18px' }}>
            <p style={{ fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 12px' }}>Sold by</p>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.82rem', fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden' }}>
                {product.farmer?.avatar ? <img src={product.farmer.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : farmerInitials}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <p style={{ margin:0, fontWeight:700, fontSize:'.9rem', color:'#111' }}>{product.farmer?.name}</p>
                  {product.farmer?.isVerified && <IoShieldCheckmark size={14} color="#16a34a"/>}
                </div>
                <p style={{ margin:0, fontSize:'.78rem', color:'#a3a3a3' }}>{product.farmer?.location}</p>
              </div>
              <a href={`tel:${product.farmer?.phone}`} style={{ textDecoration:'none' }}>
                <button style={{ padding:'8px 16px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:6 }}>
                  <IoCall size={14}/> Call
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* ── Right: Order box ── */}
        <div style={{ position:'sticky', top:20 }}>
          <div style={{ background:'#fff', borderRadius:18, border:'1px solid #f0f0f0', boxShadow:'0 4px 24px rgba(0,0,0,.07)', padding:24 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 18px', display:'flex', alignItems:'center', gap:8 }}>
              <IoLayersOutline size={16} color="#2563eb"/> Place Order
            </p>

            {/* Qty */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Quantity (bags)</label>
              <div style={{ display:'flex', alignItems:'center', gap:0, border:'1.5px solid #e5e5e5', borderRadius:10, overflow:'hidden' }}>
                <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} style={{ width:44, height:44, background:'#f9fafb', border:'none', cursor:'pointer', fontSize:'1.2rem', color:'#525252', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                <input type="number" min="1" max={product.quantity} value={quantity}
                  onChange={e=>setQuantity(Math.max(1,Math.min(product.quantity,parseInt(e.target.value)||1)))}
                  style={{ flex:1, textAlign:'center', border:'none', outline:'none', fontSize:'.95rem', fontWeight:700, fontFamily:F, color:'#111', background:'#fff', height:44 }}/>
                <button onClick={()=>setQuantity(q=>Math.min(product.quantity,q+1))} style={{ width:44, height:44, background:'#f9fafb', border:'none', cursor:'pointer', fontSize:'1.2rem', color:'#525252', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
              </div>
              <p style={{ fontSize:'.73rem', color:'#a3a3a3', marginTop:5 }}>Max available: {product.quantity} bags</p>
            </div>

            {/* Total */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderRadius:10, background:'#f9fafb', marginBottom:18 }}>
              <span style={{ fontSize:'.88rem', color:'#737373' }}>Total Amount</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#2563eb' }}>{formatCurrency(total)}</span>
            </div>

            <button disabled={!available} onClick={()=>setOrderModal(true)} style={{
              width:'100%', padding:'13px', borderRadius:11,
              background: available ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#e5e5e5',
              color: available ? '#fff' : '#a3a3a3',
              fontWeight:700, fontSize:'.95rem', border:'none',
              cursor: available ? 'pointer' : 'not-allowed', fontFamily:F,
              boxShadow: available ? '0 4px 14px rgba(37,99,235,.3)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              <IoCheckmarkCircle size={17}/> {available ? 'Place Order' : 'Out of Stock'}
            </button>

            {/* Escrow note */}
            <div style={{ display:'flex', gap:9, padding:'12px 14px', borderRadius:10, background:'#f0fdf4', border:'1px solid #bbf7d0', marginTop:14 }}>
              <IoShieldCheckmark size={16} color="#16a34a" style={{ flexShrink:0, marginTop:1 }}/>
              <p style={{ fontSize:'.75rem', color:'#166534', margin:0, lineHeight:1.5 }}>Payment held in escrow until you confirm delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Modal ── */}
      {orderModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={()=>setOrderModal(false)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:700, color:'#111', margin:0 }}>Confirm Your Order</h3>
              <button onClick={()=>setOrderModal(false)} style={{ width:30, height:30, borderRadius:8, border:'none', background:'#f5f5f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#737373' }}>
                <IoCloseOutline size={16}/>
              </button>
            </div>
            <OrderForm
              product={product}
              quantity={quantity}
              onSuccess={()=>{ setOrderModal(false); if(onOrderPlaced) onOrderPlaced() }}
              onCancel={()=>setOrderModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails