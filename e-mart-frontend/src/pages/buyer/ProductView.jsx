import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import ProductDetails from '../../components/buyer/ProductDetails'
import Loader from '../../components/common/Loader'
import productService from '../../api/services/productService'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"

const ProductView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try { setLoading(true); const d = await productService.getProduct(id); setProduct(d.product) }
    catch { toast.error('Failed to load product'); navigate('/buyer/marketplace') }
    finally { setLoading(false) }
  }

  if (loading) return <Loader fullScreen text="Loading product…"/>

  return (
    <div style={{ fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      <div style={{ marginBottom: 20 }}>
        <Link to="/buyer/marketplace" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#2563eb', fontWeight:600, fontSize:'.85rem', textDecoration:'none' }}
          onMouseEnter={e=>e.currentTarget.style.opacity='.75'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
          <IoArrowBack size={15}/> Back to Marketplace
        </Link>
      </div>

      <ProductDetails product={product} onOrderPlaced={() => navigate('/buyer/orders')} />

      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color:'#111', margin:'0 0 8px' }}>Similar Products</h2>
        <p style={{ fontSize:'.85rem', color:'#a3a3a3' }}>More products from this region coming soon…</p>
      </div>
    </div>
  )
}

export default ProductView