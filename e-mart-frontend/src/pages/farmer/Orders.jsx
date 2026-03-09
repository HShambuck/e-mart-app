import { useState, useEffect } from 'react'
import { IoCartOutline, IoCloseOutline, IoFilterOutline } from 'react-icons/io5'
import OrderCard from '../../components/farmer/OrderCard'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import toast from 'react-hot-toast'

const F = "'Sora', system-ui, sans-serif"

const statusOptions = [
  { value: 'all',                   label: 'All Orders'          },
  { value: 'pending',               label: 'Pending'             },
  { value: 'accepted',              label: 'Accepted'            },
  { value: 'payment_confirmed',     label: 'Payment Confirmed'   },
  { value: 'ready_for_collection',  label: 'Ready for Pickup'    },
  { value: 'completed',             label: 'Completed'           },
  { value: 'cancelled',             label: 'Cancelled'           },
]

const Orders = () => {
  const [orders,         setOrders]         = useState([])
  const [filtered,       setFiltered]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [filterStatus,   setFilterStatus]   = useState('all')
  const [rejectModal,    setRejectModal]    = useState({ open: false, orderId: null, note: '' })
  const [rejecting,      setRejecting]      = useState(false)

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => {
    setFiltered(filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus))
  }, [filterStatus, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getFarmerOrders()
      setOrders(data.orders || [])
    } catch { toast.error('Failed to fetch orders') }
    finally  { setLoading(false) }
  }

  const handleAccept = async (orderId) => {
    try {
      await orderService.acceptOrder(orderId)
      toast.success('Order accepted!')
      fetchOrders()
    } catch { toast.error('Failed to accept order') }
  }

  const openReject = (orderId) => setRejectModal({ open: true, orderId, note: '' })

  const confirmReject = async () => {
    try {
      setRejecting(true)
      await orderService.rejectOrder(rejectModal.orderId, rejectModal.note)
      toast.success('Order rejected')
      setRejectModal({ open: false, orderId: null, note: '' })
      fetchOrders()
    } catch { toast.error('Failed to reject order') }
    finally  { setRejecting(false) }
  }

  if (loading) return <Loader fullScreen text="Loading orders…" />

  return (
    <div style={{ fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <IoCartOutline size={18} color="#16a34a" />
          <span style={{ fontSize:'.72rem', fontWeight:700, color:'#16a34a', textTransform:'uppercase', letterSpacing:'.08em' }}>Farmer Portal</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:900, color:'#111', margin:'0 0 6px' }}>
          Orders
        </h1>
        <p style={{ color:'#737373', fontSize:'.92rem', margin:0 }}>Manage incoming orders from buyers</p>
      </div>

      {/* ── Filter pills ── */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        <IoFilterOutline size={15} color="#a3a3a3" style={{ flexShrink:0 }} />
        {statusOptions.map(opt => (
          <button key={opt.value} onClick={() => setFilterStatus(opt.value)} style={{
            padding: '7px 16px', borderRadius: 10, border: 'none',
            background: filterStatus === opt.value ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#f5f5f5',
            color: filterStatus === opt.value ? '#fff' : '#525252',
            fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
            fontFamily: F, whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: filterStatus === opt.value ? '0 3px 10px rgba(22,163,74,.25)' : 'none',
            transition: 'all .15s',
          }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Count ── */}
      <p style={{ fontSize:'.82rem', color:'#a3a3a3', marginBottom:16 }}>
        Showing <strong style={{ color:'#111' }}>{filtered.length}</strong> of <strong style={{ color:'#111' }}>{orders.length}</strong> orders
      </p>

      {/* ── Orders grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 20px', background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)' }}>
          <div style={{ width:60, height:60, borderRadius:14, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <IoCartOutline size={26} color="#86efac" />
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>
            {filterStatus !== 'all' ? 'No orders in this category' : 'No orders yet'}
          </p>
          <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:0 }}>
            {filterStatus !== 'all' ? 'Try selecting a different filter' : 'Orders from buyers will appear here'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))', gap:16 }}>
          {filtered.map(order => (
            <OrderCard key={order._id} order={order} onAccept={handleAccept} onReject={openReject} />
          ))}
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal.open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => setRejectModal({ open:false, orderId:null, note:'' })}>
          <div style={{ background:'#fff', borderRadius:18, padding:28, width:'100%', maxWidth:460, boxShadow:'0 20px 60px rgba(0,0,0,.2)', fontFamily:F }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#111', margin:0 }}>Reject Order</h3>
              <button onClick={() => setRejectModal({ open:false, orderId:null, note:'' })}
                style={{ width:30, height:30, borderRadius:8, border:'none', background:'#f5f5f5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#737373' }}>
                <IoCloseOutline size={16} />
              </button>
            </div>

            <p style={{ fontSize:'.88rem', color:'#525252', marginBottom:14, lineHeight:1.6 }}>
              Please provide a reason for rejecting this order:
            </p>

            <textarea value={rejectModal.note}
              onChange={e => setRejectModal(m => ({ ...m, note: e.target.value }))}
              placeholder="e.g. Out of stock, price changed…"
              rows={4}
              style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e5e5e5', fontSize:'.88rem', fontFamily:F, outline:'none', resize:'vertical', lineHeight:1.6, boxSizing:'border-box' }}
              onFocus={e => { e.target.style.borderColor='#16a34a'; e.target.style.boxShadow='0 0 0 3px rgba(22,163,74,.1)' }}
              onBlur={e => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }}
            />

            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button onClick={() => setRejectModal({ open:false, orderId:null, note:'' })}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>
                Cancel
              </button>
              <button onClick={confirmReject} disabled={rejecting}
                style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontWeight:700, fontSize:'.88rem', cursor: rejecting?'not-allowed':'pointer', fontFamily:F, opacity: rejecting?.6:1 }}>
                {rejecting ? 'Rejecting…' : 'Reject Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders