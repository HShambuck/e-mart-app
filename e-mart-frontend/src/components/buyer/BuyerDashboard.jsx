import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IoCartOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoStorefrontOutline,
  IoArrowForwardOutline, IoChatbubbleOutline, IoPersonOutline,
  IoGridOutline, IoFlashOutline, IoReceiptOutline, IoWalletOutline,
} from 'react-icons/io5'
import Loader from '../common/Loader'
import buyerService from '../../api/services/buyerService'
import { formatCurrency } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const statusConfig = {
  pending:              { label: 'Pending',         bg: '#fef9c3', color: '#854d0e' },
  accepted:             { label: 'Accepted',         bg: '#dbeafe', color: '#1e40af' },
  payment_pending:      { label: 'Awaiting Payment', bg: '#fff7ed', color: '#9a3412' },
  payment_confirmed:    { label: 'Paid',             bg: '#dcfce7', color: '#166534' },
  ready_for_collection: { label: 'Ready',            bg: '#dcfce7', color: '#166534' },
  completed:            { label: 'Completed',        bg: '#dcfce7', color: '#166534' },
  cancelled:            { label: 'Cancelled',        bg: '#fee2e2', color: '#991b1b' },
}

const BuyerDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await buyerService.getDashboard()
      setStats(data.stats)
      setRecentOrders(data.recentOrders || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader fullScreen text="Loading dashboard..." />

  const firstName = user?.name?.split(' ')[0] || 'Buyer'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { title: 'Total Orders',  value: stats?.totalOrders     ?? 0,                   icon: IoCartOutline,           accent: '#2563eb', light: '#eff6ff', link: '/buyer/orders' },
    { title: 'Active Orders', value: stats?.activeOrders    ?? 0,                   icon: IoTimeOutline,           accent: '#f97316', light: '#fff7ed', link: '/buyer/orders' },
    { title: 'Completed',     value: stats?.completedOrders ?? 0,                   icon: IoCheckmarkCircleOutline,accent: '#16a34a', light: '#f0fdf4', link: '/buyer/orders' },
    { title: 'Total Spent',   value: formatCurrency(stats?.totalSpent ?? 0),        icon: IoWalletOutline,         accent: '#9333ea', light: '#faf5ff', link: '/buyer/orders' },
  ]

  const quickActions = [
    { to: '/buyer/marketplace', icon: IoGridOutline,       label: 'Browse',    accent: '#16a34a', light: '#f0fdf4' },
    { to: '/buyer/orders',      icon: IoReceiptOutline,    label: 'My Orders', accent: '#2563eb', light: '#eff6ff' },
    { to: '/buyer/messages',    icon: IoChatbubbleOutline, label: 'Messages',  accent: '#f97316', light: '#fff7ed' },
    { to: '/buyer/profile',     icon: IoPersonOutline,     label: 'Profile',   accent: '#9333ea', light: '#faf5ff' },
  ]

  return (
    <div style={{ fontFamily:"'Sora', system-ui, sans-serif", color:'#111', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bd-card { animation: fadeUp .45s ease both; }
        .bd-d1   { animation-delay: .05s; }
        .bd-d2   { animation-delay: .12s; }
        .bd-d3   { animation-delay: .18s; }
        .bd-d4   { animation-delay: .24s; }

        .bd-stat:hover  { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.10) !important; }
        .bd-stat        { transition: transform .2s, box-shadow .2s; cursor: pointer; }
        .bd-qa:hover    { transform: translateY(-3px); filter: brightness(.97); }
        .bd-qa          { transition: transform .2s, filter .2s; text-decoration: none; }
        .bd-orow:hover  { background: #f9fafb; }
        .bd-orow        { transition: background .15s; }
      `}</style>

      {/* ── Hero Header ───────────────────────────────────────── */}
      <div className="bd-card bd-d1" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%)',
        borderRadius: '20px',
        padding: '32px 32px 28px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'120px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'16px', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'10px' }}>
              <div style={{ background:'rgba(255,255,255,.12)', borderRadius:'8px', padding:'5px 10px', display:'flex', alignItems:'center', gap:'6px' }}>
                <IoStorefrontOutline size={14} color="#93c5fd" />
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'.08em' }}>Buyer Portal</span>
              </div>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:900, color:'#fff', margin:'0 0 8px', lineHeight:1.15 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color:'#93c5fd', fontSize:'0.92rem', margin:0, fontWeight:500 }}>
              Fresh rice, direct from local farmers.
            </p>
          </div>
          <Link to="/buyer/marketplace" style={{ textDecoration:'none', alignSelf:'center' }}>
            <button style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'11px 22px', borderRadius:'12px',
              background:'rgba(255,255,255,.15)', color:'white',
              fontWeight:700, fontSize:'0.88rem', border:'1.5px solid rgba(255,255,255,.3)',
              cursor:'pointer', fontFamily:'inherit',
              backdropFilter:'blur(8px)',
              transition:'background .15s',
            }}>
              <IoGridOutline size={18} /> Browse Market
            </button>
          </Link>
        </div>

        {/* mini strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
          {[
            { label:'Orders',    value: stats?.totalOrders     ?? 0 },
            { label:'Completed', value: stats?.completedOrders ?? 0 },
            { label:'Spent',     value: formatCurrency(stats?.totalSpent ?? 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <p style={{ margin:'0 0 3px', fontSize:'1.3rem', fontWeight:800, color:'#fff', fontFamily:"'Playfair Display', serif" }}>{value}</p>
              <p style={{ margin:0, fontSize:'0.73rem', color:'#93c5fd', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="bd-card bd-d2" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:'14px', marginBottom:'22px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="bd-stat" onClick={() => window.location.href = s.link}
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

      {/* ── Middle Row ────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'22px' }}>

        {/* Quick Actions */}
        <div className="bd-card bd-d3" style={{ background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
            <IoFlashOutline size={16} color="#2563eb" />
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Quick Actions</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {quickActions.map(({ to, icon: Icon, label, accent, light }) => (
              <Link key={to} to={to} className="bd-qa"
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'9px', padding:'16px 10px', borderRadius:'13px', background:light, border:`1px solid ${accent}22` }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 2px 8px ${accent}22` }}>
                  <Icon size={18} color={accent} />
                </div>
                <span style={{ fontSize:'0.77rem', fontWeight:700, color:'#333', textAlign:'center' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Promo card */}
        <div className="bd-card bd-d3" style={{
          borderRadius:'16px', padding:'22px', border:'1px solid #bfdbfe',
          background:'linear-gradient(145deg, #eff6ff, #dbeafe)',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
        }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1e3a8a', margin:'0 0 8px' }}>
              Why shop on E-MART? 🌾
            </h2>
            <p style={{ fontSize:'0.82rem', color:'#3b82f6', margin:'0 0 18px', lineHeight:1.65, fontWeight:500 }}>
              Connect directly with verified rice farmers across Ghana.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { icon:'💰', text:'No middlemen — direct farm prices' },
              { icon:'🔒', text:'Secure escrow payment system' },
              { icon:'📦', text:'Real-time order tracking' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'1rem', flexShrink:0 }}>{icon}</span>
                <span style={{ fontSize:'0.8rem', color:'#1e40af', fontWeight:600 }}>{text}</span>
              </div>
            ))}
          </div>

          <Link to="/buyer/marketplace" style={{ textDecoration:'none', marginTop:'18px' }}>
            <button style={{
              width:'100%', padding:'10px', borderRadius:'10px',
              background:'linear-gradient(135deg, #2563eb, #1d4ed8)', color:'white',
              fontWeight:700, fontSize:'0.83rem', border:'none', cursor:'pointer',
              fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
              boxShadow:'0 4px 14px rgba(37,99,235,.3)',
            }}>
              Shop Now <IoArrowForwardOutline size={13} />
            </button>
          </Link>
        </div>
      </div>

      {/* ── Recent Orders ─────────────────────────────────────── */}
      <div className="bd-card bd-d4" style={{ background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <IoCartOutline size={16} color="#2563eb" />
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Recent Orders</h2>
          </div>
          <Link to="/buyer/orders" style={{ display:'flex', alignItems:'center', gap:'4px', color:'#2563eb', fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            View All <IoArrowForwardOutline size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'44px 20px' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <IoCartOutline size={26} color="#d4d4d4" />
            </div>
            <p style={{ color:'#525252', fontWeight:600, margin:'0 0 4px', fontSize:'0.95rem' }}>No orders yet</p>
            <p style={{ fontSize:'0.82rem', color:'#a3a3a3', margin:'0 0 16px' }}>Start shopping to see your orders here</p>
            <Link to="/buyer/marketplace" style={{ textDecoration:'none' }}>
              <button style={{ padding:'9px 22px', borderRadius:'10px', background:'linear-gradient(135deg, #2563eb, #1d4ed8)', color:'white', fontWeight:700, fontSize:'0.83rem', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column' }}>
            {recentOrders.map((order, idx) => {
              const sc = statusConfig[order.status] || { label: order.status, bg:'#f5f5f5', color:'#525252' }
              return (
                <div key={order._id} className="bd-orow" style={{
                  display:'flex', alignItems:'center', padding:'13px 10px',
                  borderRadius:'11px',
                  borderBottom: idx < recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'12px', flexShrink:0 }}>
                    <span style={{ fontSize:'0.68rem', fontWeight:800, color:'#2563eb' }}>#{(idx+1).toString().padStart(2,'0')}</span>
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'0.9rem', color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {order.product?.variety}
                    </p>
                    <p style={{ margin:0, fontSize:'0.77rem', color:'#a3a3a3', fontWeight:500 }}>
                      {order.quantity} bags · From {order.farmer?.name}
                    </p>
                  </div>

                  <div style={{ marginRight:'14px', textAlign:'right', flexShrink:0 }}>
                    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'0.7rem', fontWeight:700 }}>{sc.label}</span>
                    <p style={{ margin:'4px 0 0', fontSize:'0.88rem', fontWeight:800, color:'#111' }}>{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <Link to={`/buyer/orders/${order._id}`} style={{ textDecoration:'none' }}>
                    <button style={{ background:'none', border:'none', cursor:'pointer', padding:'6px 8px', borderRadius:'8px', color:'#2563eb', display:'flex', alignItems:'center', transition:'background .15s' }}
                      onMouseOver={e => e.currentTarget.style.background='#eff6ff'}
                      onMouseOut={e => e.currentTarget.style.background='none'}>
                      <IoEyeOutline size={16} />
                    </button>
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

export default BuyerDashboard