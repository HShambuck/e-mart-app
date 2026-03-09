import { Link } from 'react-router-dom'
import { IoCreate, IoTrash, IoLocationOutline, IoLayersOutline } from 'react-icons/io5'
import { formatCurrency, formatDate } from '../../utils/formatters'

const statusConfig = {
  available:    { label: 'Available',    bg: '#dcfce7', color: '#166534', dot: '#16a34a' },
  out_of_stock: { label: 'Out of Stock', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  sold:         { label: 'Sold Out',     bg: '#f5f5f5', color: '#525252', dot: '#a3a3a3' },
}

const ProductCard = ({ product, onDelete }) => {
  const sc = statusConfig[product.status] || { label: product.status, bg: '#f5f5f5', color: '#525252', dot: '#a3a3a3' }

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
      boxShadow: '0 2px 10px rgba(0,0,0,.04)', overflow: 'hidden',
      transition: 'transform .2s, box-shadow .2s',
      fontFamily: "'Sora', system-ui, sans-serif",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,.04)' }}
    >
      {/* Image */}
      <div style={{ height: '160px', background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
        {product.images?.length > 0
          ? <img src={product.images[0]} alt={product.variety} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>🌾</div>
        }
        {/* Status pill */}
        <span style={{
          position:'absolute', top:10, right:10,
          display:'flex', alignItems:'center', gap:5,
          padding:'3px 10px', borderRadius:'999px',
          background: sc.bg, color: sc.color, fontSize:'.7rem', fontWeight:700,
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background: sc.dot, display:'inline-block' }} />
          {sc.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:'0 0 4px' }}>
          {product.variety}
        </h3>

        <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:12 }}>
          <span style={{ fontSize:'1.3rem', fontWeight:800, color:'#16a34a', fontFamily:"'Playfair Display',serif" }}>
            {formatCurrency(product.pricePerBag)}
          </span>
          <span style={{ fontSize:'.78rem', color:'#a3a3a3' }}>per {product.bagSize}kg bag</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <IoLayersOutline size={13} color="#a3a3a3" />
            <span style={{ fontSize:'.8rem', color:'#737373' }}>
              <strong style={{ color:'#111', fontWeight:600 }}>{product.quantity} bags</strong> in stock
            </span>
          </div>
          {product.location && (
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <IoLocationOutline size={13} color="#a3a3a3" />
              <span style={{ fontSize:'.8rem', color:'#737373' }}>{product.location}</span>
            </div>
          )}
          {product.harvestDate && (
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ fontSize:'.75rem', color:'#a3a3a3', paddingLeft:1 }}>🌱</span>
              <span style={{ fontSize:'.78rem', color:'#737373' }}>Harvested {formatDate(product.harvestDate)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8 }}>
          <Link to={`/farmer/products/edit/${product._id}`} style={{ flex:1, textDecoration:'none' }}>
            <button style={{
              width:'100%', padding:'9px', borderRadius:'9px',
              border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252',
              fontWeight:600, fontSize:'.82rem', cursor:'pointer',
              fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
              transition:'border-color .15s, color .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#16a34a'; e.currentTarget.style.color='#16a34a' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e5e5'; e.currentTarget.style.color='#525252' }}>
              <IoCreate size={14} /> Edit
            </button>
          </Link>
          {onDelete && (
            <button onClick={() => onDelete(product._id)} style={{
              flex:1, padding:'9px', borderRadius:'9px',
              border:'1.5px solid #fecaca', background:'#fff5f5', color:'#dc2626',
              fontWeight:600, fontSize:'.82rem', cursor:'pointer',
              fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
            }}>
              <IoTrash size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard