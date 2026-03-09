import { Link } from 'react-router-dom'
import { IoStorefrontOutline } from 'react-icons/io5'
import ProductCard from './ProductCard'

const ProductList = ({ products = [], onDelete, emptyMessage = 'No products yet' }) => {
  if (products.length === 0) {
    return (
      <div style={{
        textAlign:'center', padding:'56px 20px',
        background:'#fff', borderRadius:'16px',
        border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)',
        fontFamily:"'Sora', system-ui, sans-serif",
      }}>
        <div style={{ width:64, height:64, borderRadius:16, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <IoStorefrontOutline size={28} color="#86efac" />
        </div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>{emptyMessage}</p>
        <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:'0 0 20px' }}>Add your first product to start selling on E-MART</p>
        <Link to="/farmer/products/add" style={{ textDecoration:'none' }}>
          <button style={{ padding:'10px 24px', borderRadius:'10px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.88rem', border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(22,163,74,.25)' }}>
            Add First Product
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(272px,1fr))', gap:16 }}>
      {products.map(product => (
        <ProductCard key={product._id} product={product} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ProductList