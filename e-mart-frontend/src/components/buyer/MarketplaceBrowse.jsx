import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoSearch, IoFilter, IoLocationOutline, IoHeart, IoHeartOutline, IoCloseOutline, IoLeafOutline, IoRefreshOutline } from 'react-icons/io5'
import Loader from '../common/Loader'
import productService from '../../api/services/productService'
import buyerService from '../../api/services/buyerService'
import { useDebounce } from '../../hooks/useDebounce'
import { formatCurrency } from '../../utils/formatters'
import { RICE_VARIETIES, GHANA_REGIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"
const inputBase = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#111', fontSize:'.88rem', fontFamily:F, outline:'none', boxSizing:'border-box' }
const labelStyle = { display:'block', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }
const focusBlue = e => { e.target.style.borderColor='#2563eb'; e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)' }
const blurReset = e => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }

const MarketplaceBrowse = () => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [filters, setFilters] = useState({ variety:'all', region:'all', minPrice:'', maxPrice:'', sortBy:'newest' })
  const debounced = useDebounce(searchQuery, 300)

  useEffect(() => { fetchProducts(); fetchFavorites() }, [])
  useEffect(() => { applyFilters() }, [debounced, filters, products])

  const fetchProducts = async () => {
    try { setLoading(true); const d = await productService.getAllProducts({ status:'available' }); setProducts(d.products||[]) }
    catch { toast.error('Failed to fetch products') }
    finally { setLoading(false) }
  }
  const fetchFavorites = async () => {
    try { const d = await buyerService.getFavorites(); setFavorites(d.favorites?.map(f=>f._id)||[]) }
    catch {}
  }
  const applyFilters = () => {
    let f = [...products]
    if (debounced) f = f.filter(p => [p.variety, p.location, p.farmer?.name].join(' ').toLowerCase().includes(debounced.toLowerCase()))
    if (filters.variety !== 'all') f = f.filter(p => p.variety === filters.variety)
    if (filters.region !== 'all') f = f.filter(p => p.region === filters.region)
    if (filters.minPrice) f = f.filter(p => p.pricePerBag >= parseFloat(filters.minPrice))
    if (filters.maxPrice) f = f.filter(p => p.pricePerBag <= parseFloat(filters.maxPrice))
    if (filters.sortBy === 'price_low') f.sort((a,b)=>a.pricePerBag-b.pricePerBag)
    else if (filters.sortBy === 'price_high') f.sort((a,b)=>b.pricePerBag-a.pricePerBag)
    else f.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    setFiltered(f)
  }
  const setFilter = (k,v) => setFilters(p=>({...p,[k]:v}))
  const resetFilters = () => { setFilters({ variety:'all', region:'all', minPrice:'', maxPrice:'', sortBy:'newest' }); setSearchQuery('') }
  const toggleFav = async (id) => {
    try {
      if (favorites.includes(id)) { await buyerService.removeFromFavorites(id); setFavorites(f=>f.filter(x=>x!==id)); toast.success('Removed from saved') }
      else { await buyerService.addToFavorites(id); setFavorites(f=>[...f,id]); toast.success('Saved!') }
    } catch { toast.error('Failed to update') }
  }

  if (loading) return <Loader fullScreen text="Loading products…"/>

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Search bar */}
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ flex:1, position:'relative' }}>
          <IoSearch size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }}/>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
            placeholder="Search rice varieties, locations, farmers…"
            style={{ ...inputBase, paddingLeft:40, paddingRight: searchQuery?36:14 }}
            onFocus={focusBlue} onBlur={blurReset}/>
          {searchQuery && <button onClick={()=>setSearchQuery('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#a3a3a3', display:'flex' }}><IoCloseOutline size={16}/></button>}
        </div>
        <button onClick={()=>setShowFilters(!showFilters)} style={{ padding:'10px 18px', borderRadius:10, border:`1.5px solid ${showFilters?'#2563eb':'#e5e5e5'}`, background:showFilters?'#eff6ff':'#fff', color:showFilters?'#2563eb':'#525252', fontWeight:600, fontSize:'.85rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:7, transition:'all .15s' }}>
          <IoFilter size={15}/> Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e5e5e5', padding:20, marginBottom:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
            <div>
              <label style={labelStyle}>Rice Variety</label>
              <select value={filters.variety} onChange={e=>setFilter('variety',e.target.value)} style={{ ...inputBase, appearance:'none', cursor:'pointer' }} onFocus={focusBlue} onBlur={blurReset}>
                <option value="all">All Varieties</option>
                {RICE_VARIETIES.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <select value={filters.region} onChange={e=>setFilter('region',e.target.value)} style={{ ...inputBase, appearance:'none', cursor:'pointer' }} onFocus={focusBlue} onBlur={blurReset}>
                <option value="all">All Regions</option>
                {GHANA_REGIONS.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Min Price (GHS)</label>
              <input type="number" value={filters.minPrice} onChange={e=>setFilter('minPrice',e.target.value)} placeholder="Min" style={inputBase} onFocus={focusBlue} onBlur={blurReset}/>
            </div>
            <div>
              <label style={labelStyle}>Max Price (GHS)</label>
              <input type="number" value={filters.maxPrice} onChange={e=>setFilter('maxPrice',e.target.value)} placeholder="Max" style={inputBase} onFocus={focusBlue} onBlur={blurReset}/>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
            <button onClick={resetFilters} style={{ padding:'8px 16px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.8rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:6 }}>
              <IoRefreshOutline size={14}/> Reset
            </button>
          </div>
        </div>
      )}

      {/* Count + sort */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <p style={{ fontSize:'.82rem', color:'#a3a3a3', margin:0 }}>
          Showing <strong style={{ color:'#111' }}>{filtered.length}</strong> of <strong style={{ color:'#111' }}>{products.length}</strong> products
        </p>
        <select value={filters.sortBy} onChange={e=>setFilter('sortBy',e.target.value)}
          style={{ padding:'7px 12px', borderRadius:9, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontSize:'.8rem', fontFamily:F, outline:'none', cursor:'pointer' }}
          onFocus={focusBlue} onBlur={blurReset}>
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 20px', background:'#fff', borderRadius:16, border:'1px solid #f0f0f0' }}>
          <div style={{ width:60, height:60, borderRadius:14, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <IoLeafOutline size={26} color="#93c5fd"/>
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>No products found</p>
          <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:'0 0 14px' }}>Try adjusting your filters or search terms</p>
          <button onClick={resetFilters} style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:F }}>Reset Filters</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
          {filtered.map(p=>(
            <ProductCard key={p._id} product={p} isFavorite={favorites.includes(p._id)} onToggleFavorite={toggleFav}/>
          ))}
        </div>
      )}
    </div>
  )
}

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', overflow:'hidden', boxShadow: hovered?'0 8px 28px rgba(0,0,0,.1)':'0 2px 10px rgba(0,0,0,.04)', transform: hovered?'translateY(-3px)':'translateY(0)', transition:'all .2s', position:'relative' }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

      {/* Fav button */}
      <button onClick={e=>{e.preventDefault();onToggleFavorite(product._id)}}
        style={{ position:'absolute', top:10, right:10, zIndex:2, width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.12)', backdropFilter:'blur(4px)' }}>
        {isFavorite ? <IoHeart size={16} color="#ef4444"/> : <IoHeartOutline size={16} color="#a3a3a3"/>}
      </button>

      <Link to={`/buyer/marketplace/${product._id}`} style={{ textDecoration:'none', color:'inherit', display:'block' }}>
        {/* Image */}
        <div style={{ height:160, background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {product.images?.length > 0
            ? <img src={product.images[0]} alt={product.variety} style={{ width:'100%', height:'100%', objectFit:'cover', transform:hovered?'scale(1.05)':'scale(1)', transition:'transform .3s' }}/>
            : <span style={{ fontSize:'3rem' }}>🌾</span>}
        </div>

        <div style={{ padding:'14px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'.95rem', fontWeight:700, color:'#111', margin:0 }}>{product.variety}</h3>
            <span style={{ padding:'3px 9px', borderRadius:'999px', background:'#dcfce7', color:'#166534', fontSize:'.68rem', fontWeight:700 }}>Available</span>
          </div>

          <div style={{ marginBottom:10 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:900, color:'#2563eb' }}>{formatCurrency(product.pricePerBag)}</span>
            <span style={{ fontSize:'.78rem', color:'#a3a3a3', marginLeft:4 }}>/ {product.bagSize}kg bag</span>
          </div>

          <div style={{ marginBottom:12 }}>
            <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.78rem', color:'#737373', margin:'0 0 3px' }}>
              <IoLocationOutline size={13}/> {product.location}, {product.region}
            </p>
            <p style={{ fontSize:'.78rem', color:'#737373', margin:'0 0 3px' }}>
              <span style={{ color:'#a3a3a3' }}>Stock: </span><strong style={{ color:'#111' }}>{product.quantity} bags</strong>
            </p>
            <p style={{ fontSize:'.78rem', color:'#737373', margin:0 }}>
              <span style={{ color:'#a3a3a3' }}>By: </span><strong style={{ color:'#111' }}>{product.farmer?.name}</strong>
            </p>
          </div>

          <div style={{ padding:'9px', borderRadius:10, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', textAlign:'center', fontWeight:700, fontSize:'.82rem', fontFamily:F }}>
            View Details
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MarketplaceBrowse