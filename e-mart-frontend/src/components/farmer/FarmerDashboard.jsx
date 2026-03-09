import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IoStorefrontOutline, IoCartOutline, IoWalletOutline, IoTrendingUpOutline,
  IoAddOutline, IoEyeOutline, IoArrowForwardOutline, IoLeafOutline,
  IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline,
  IoEllipsisHorizontal, IoFlashOutline, IoBarChartOutline
} from 'react-icons/io5'
import Loader from '../common/Loader'
import farmerService from '../../api/services/farmerService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const statusConfig = {
  pending:              { label: 'Pending',   bg: '#fef9c3', color: '#854d0e' },
  accepted:             { label: 'Accepted',  bg: '#dbeafe', color: '#1e40af' },
  payment_confirmed:    { label: 'Paid',      bg: '#dcfce7', color: '#166534' },
  ready_for_collection: { label: 'Ready',     bg: '#dcfce7', color: '#166534' },
  completed:            { label: 'Completed', bg: '#dcfce7', color: '#166534' },
  cancelled:            { label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
}

const FarmerDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await farmerService.getDashboard()
      setStats(data.stats)
      setRecentOrders(data.recentOrders || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader fullScreen text="Loading dashboard..." />

  const firstName = user?.name?.split(' ')[0] || 'Farmer'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts ?? 0,                      icon: IoStorefrontOutline, accent: '#16a34a', light: '#f0fdf4', link: '/farmer/products' },
    { title: 'Active Orders',  value: stats?.activeOrders  ?? 0,                      icon: IoCartOutline,       accent: '#f97316', light: '#fff7ed', link: '/farmer/orders'   },
    { title: 'Total Earnings', value: formatCurrency(stats?.totalEarnings   ?? 0),    icon: IoWalletOutline,     accent: '#2563eb', light: '#eff6ff', link: '/farmer/sales'    },
    { title: 'This Month',     value: formatCurrency(stats?.monthlyEarnings ?? 0),    icon: IoTrendingUpOutline, accent: '#9333ea', light: '#faf5ff', link: '/farmer/sales'    },
  ]

  const quickActions = [
    { to: '/farmer/products/add', icon: IoAddOutline,        label: 'Add Product',  accent: '#16a34a', light: '#f0fdf4' },
    { to: '/farmer/products',     icon: IoStorefrontOutline, label: 'My Products',  accent: '#2563eb', light: '#eff6ff' },
    { to: '/farmer/orders',       icon: IoCartOutline,       label: 'Orders',       accent: '#f97316', light: '#fff7ed' },
    { to: '/farmer/sales',        icon: IoBarChartOutline,   label: 'Sales Report', accent: '#9333ea', light: '#faf5ff' },
  ]

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif", color: '#111', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fd-card  { animation: fadeUp .45s ease both; }
        .fd-d1    { animation-delay: .05s; }
        .fd-d2    { animation-delay: .12s; }
        .fd-d3    { animation-delay: .18s; }
        .fd-d4    { animation-delay: .24s; }
        .fd-d5    { animation-delay: .30s; }

        .fd-stat:hover  { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.10) !important; }
        .fd-stat        { transition: transform .2s, box-shadow .2s; cursor: pointer; }
        .fd-qa:hover    { transform: translateY(-3px); filter: brightness(.97); }
        .fd-qa          { transition: transform .2s, filter .2s; text-decoration: none; }
        .fd-orow:hover  { background: #f9fafb; }
        .fd-orow        { transition: background .15s; }
        .fd-viewbtn     { background: none; border: none; cursor: pointer; padding: 6px 8px; border-radius: 8px; color: #16a34a; transition: background .15s; display: flex; align-items: center; }
        .fd-viewbtn:hover { background: #f0fdf4; }
      `}</style>

      {/* ── Hero Header ───────────────────────────────────────── */}
      <div className="fd-card fd-d1" style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)',
        borderRadius: '20px',
        padding: '32px 32px 28px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'120px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'16px', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'10px' }}>
              <div style={{ background:'rgba(255,255,255,.12)', borderRadius:'8px', padding:'5px 10px', display:'flex', alignItems:'center', gap:'6px' }}>
                <IoLeafOutline size={14} color="#86efac" />
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#86efac', textTransform:'uppercase', letterSpacing:'.08em' }}>Farmer Portal</span>
              </div>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:900, color:'#fff', margin:'0 0 8px', lineHeight:1.15 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color:'#86efac', fontSize:'0.92rem', margin:0, fontWeight:500 }}>
              Here's what's happening on your farm today.
            </p>
          </div>
          <Link to="/farmer/products/add" style={{ textDecoration:'none', alignSelf:'center' }}>
            <button style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'11px 22px', borderRadius:'12px',
              background:'#16a34a', color:'white',
              fontWeight:700, fontSize:'0.88rem', border:'2px solid rgba(255,255,255,.2)',
              cursor:'pointer', fontFamily:'inherit',
              boxShadow:'0 4px 20px rgba(0,0,0,.25)',
              transition:'transform .15s',
            }}>
              <IoAddOutline size={18} /> Add Product
            </button>
          </Link>
        </div>

        {/* mini stat strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
          {[
            { label:'Products',  value: stats?.totalProducts    ?? 0 },
            { label:'Completed', value: stats?.completedOrders  ?? 0 },
            { label:'Rating',    value: `${stats?.rating ?? 0}/5` },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <p style={{ margin:'0 0 3px', fontSize:'1.35rem', fontWeight:800, color:'#fff', fontFamily:"'Playfair Display', serif" }}>{value}</p>
              <p style={{ margin:0, fontSize:'0.73rem', color:'#86efac', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="fd-card fd-d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:'14px', marginBottom:'22px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="fd-stat" onClick={() => window.location.href = s.link}
            style={{ background:'#fff', borderRadius:'16px', padding:'20px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'11px', background:s.light, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon size={20} color={s.accent} />
              </div>
              <IoArrowForwardOutline size={13} color="#d4d4d4" />
            </div>
            <p style={{ margin:'0 0 5px', fontSize:'0.75rem', fontWeight:600, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.05em' }}>{s.title}</p>
            <p style={{ margin:0, fontSize:'1.55rem', fontWeight:800, color:'#111', fontFamily:"'Playfair Display', serif", letterSpacing:'-.02em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Middle row ────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'22px' }}>

        {/* Quick Actions */}
        <div className="fd-card fd-d3" style={{ background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
            <IoFlashOutline size={16} color="#16a34a" />
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Quick Actions</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {quickActions.map(({ to, icon: Icon, label, accent, light }) => (
              <Link key={to} to={to} className="fd-qa"
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'9px', padding:'16px 10px', borderRadius:'13px', background:light, border:`1px solid ${accent}22` }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 2px 8px ${accent}22` }}>
                  <Icon size={18} color={accent} />
                </div>
                <span style={{ fontSize:'0.77rem', fontWeight:700, color:'#333', textAlign:'center' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Performance card */}
        <div className="fd-card fd-d3" style={{
          borderRadius:'16px', padding:'22px', border:'1px solid #bbf7d0',
          background:'linear-gradient(145deg, #f0fdf4, #dcfce7)',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              <IoBarChartOutline size={16} color="#16a34a" />
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#14532d', margin:0 }}>Performance</h2>
            </div>
            <p style={{ fontSize:'0.8rem', color:'#16a34a', margin:'0 0 20px', fontWeight:500 }}>Track your progress over time</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[
              { label:'Products Listed',  value: stats?.totalProducts   ?? 0, max: 20, color:'#16a34a' },
              { label:'Orders Fulfilled', value: stats?.completedOrders ?? 0, max: 50, color:'#2563eb' },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'0.78rem', color:'#15803d', fontWeight:600 }}>{label}</span>
                  <span style={{ fontSize:'0.78rem', fontWeight:800, color:'#14532d' }}>{value}</span>
                </div>
                <div style={{ height:'7px', background:'rgba(255,255,255,.6)', borderRadius:'999px', overflow:'hidden' }}>
                  <div style={{
                    height:'100%',
                    width:`${Math.min((value / max) * 100, 100)}%`,
                    background:`linear-gradient(90deg, ${color}, ${color}cc)`,
                    borderRadius:'999px',
                    transition:'width .9s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          <Link to="/farmer/sales" style={{ textDecoration:'none', marginTop:'18px' }}>
            <button style={{
              width:'100%', padding:'10px', borderRadius:'10px',
              background:'#fff', color:'#15803d',
              fontWeight:700, fontSize:'0.83rem',
              border:'1.5px solid #bbf7d0', cursor:'pointer', fontFamily:'inherit',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
              boxShadow:'0 2px 8px rgba(22,163,74,.1)',
            }}>
              Full Report <IoArrowForwardOutline size={13} />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Recent Orders ─────────────────────────────────────── */}
      <div className="fd-card fd-d4" style={{ background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <IoCartOutline size={16} color="#16a34a" />
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Recent Orders</h2>
          </div>
          <Link to="/farmer/orders" style={{ display:'flex', alignItems:'center', gap:'4px', color:'#16a34a', fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            View All <IoArrowForwardOutline size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'44px 20px' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <IoCartOutline size={26} color="#d4d4d4" />
            </div>
            <p style={{ color:'#525252', fontWeight:600, margin:'0 0 4px', fontSize:'0.95rem' }}>No orders yet</p>
            <p style={{ fontSize:'0.82rem', color:'#a3a3a3', margin:0 }}>Orders from buyers will appear here</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column' }}>
            {recentOrders.map((order, idx) => {
              const sc = statusConfig[order.status] || { label: order.status, bg:'#f5f5f5', color:'#525252' }
              return (
                <div key={order._id} className="fd-orow" style={{
                  display:'flex', alignItems:'center', padding:'13px 10px',
                  borderRadius:'11px',
                  borderBottom: idx < recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  {/* order number dot */}
                  <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'12px', flexShrink:0 }}>
                    <span style={{ fontSize:'0.68rem', fontWeight:800, color:'#737373' }}>#{(idx+1).toString().padStart(2,'0')}</span>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'0.9rem', color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {order.product?.name}
                    </p>
                    <p style={{ margin:0, fontSize:'0.77rem', color:'#a3a3a3', fontWeight:500 }}>
                      {order.quantity} bags · #{order.orderNumber}
                    </p>
                  </div>

                  <div style={{ marginRight:'14px', textAlign:'right', flexShrink:0 }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'0.7rem', fontWeight:700 }}>{sc.label}</span>
                    <p style={{ margin:'4px 0 0', fontSize:'0.88rem', fontWeight:800, color:'#111' }}>{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <Link to={`/farmer/orders/${order._id}`}>
                    <button className="fd-viewbtn"><IoEyeOutline size={16} /></button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmerDashboard