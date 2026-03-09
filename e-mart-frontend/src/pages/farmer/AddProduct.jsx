import { Link } from 'react-router-dom'
import { IoArrowBack, IoLeafOutline, IoInformationCircleOutline } from 'react-icons/io5'
import ProductListingForm from '../../components/farmer/ProductListingForm'

const F = "'Sora', system-ui, sans-serif"

const AddProduct = () => {
  return (
    <div style={{ fontFamily: F, maxWidth: 860, margin: '0 auto' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <Link to="/farmer/products" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#16a34a', fontWeight: 600, fontSize: '.85rem',
          textDecoration: 'none', marginBottom: 16,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <IoArrowBack size={16} /> Back to Products
        </Link>

        <div style={{
          background: 'linear-gradient(135deg,#052e16 0%,#14532d 55%,#166534 100%)',
          borderRadius: 20, padding: '28px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IoLeafOutline size={17} color="#86efac" />
            </div>
            <span style={{ fontSize:'.72rem', fontWeight:700, color:'#86efac', textTransform:'uppercase', letterSpacing:'.08em' }}>New Listing</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, color:'#fff', margin:'0 0 6px', lineHeight:1.2 }}>
            Add New Product
          </h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'.88rem', margin:0 }}>
            List your rice for buyers to discover across Ghana
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <ProductListingForm />

      {/* ── Tips ── */}
      <div style={{
        marginTop: 20, borderRadius: 14, padding: '18px 20px',
        background: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
        border: '1px solid #bfdbfe',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <IoInformationCircleOutline size={17} color="#2563eb" />
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'.92rem', fontWeight:700, color:'#1e3a8a', margin:0 }}>Tips for a great listing</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 20px' }}>
          {[
            'Accurate pricing attracts serious buyers',
            'Clear product photos increase sales by 3×',
            'Include harvest date for freshness trust',
            'Update stock quantity when it changes',
          ].map(tip => (
            <div key={tip} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
              <span style={{ color:'#2563eb', fontSize:'.85rem', flexShrink:0, marginTop:1 }}>•</span>
              <span style={{ fontSize:'.8rem', color:'#1e40af', fontWeight:500, lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddProduct