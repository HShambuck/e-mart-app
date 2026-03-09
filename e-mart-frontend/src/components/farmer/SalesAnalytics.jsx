import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { IoBarChartOutline, IoTrendingUpOutline, IoStorefrontOutline } from 'react-icons/io5'
import Loader from '../common/Loader'
import farmerService from '../../api/services/farmerService'
import { formatCurrency } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:10, padding:'10px 14px', boxShadow:'0 4px 16px rgba(0,0,0,.1)', fontFamily:"'Sora',system-ui,sans-serif" }}>
      <p style={{ margin:'0 0 6px', fontSize:'.75rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin:'2px 0', fontSize:'.85rem', fontWeight:700, color: p.color }}>
          {p.name}: {p.name.toLowerCase().includes('revenue') ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

const SalesAnalytics = () => {
  const [period, setPeriod] = useState('month')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await farmerService.getAnalytics(period)
      setAnalytics(data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader size="lg" text="Loading analytics…" />

  const summaryCards = [
    { label:'Total Sales',   value: analytics?.totalSales ?? 0,                     sub:`+${analytics?.salesGrowth??0}% vs last ${period}`,   subColor:'#16a34a', icon:IoStorefrontOutline, accent:'#16a34a', light:'#f0fdf4' },
    { label:'Revenue',       value: formatCurrency(analytics?.revenue ?? 0),         sub:`+${analytics?.revenueGrowth??0}% vs last ${period}`, subColor:'#16a34a', icon:IoTrendingUpOutline,  accent:'#2563eb', light:'#eff6ff' },
    { label:'Avg Order Val', value: formatCurrency(analytics?.avgOrderValue ?? 0),   sub:'Per transaction',                                     subColor:'#a3a3a3', icon:IoBarChartOutline,    accent:'#9333ea', light:'#faf5ff' },
  ]

  return (
    <div style={{ fontFamily:"'Sora', system-ui, sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Period pills */}
      <div style={{ display:'flex', gap:8 }}>
        {['week','month','year'].map(p => (
          <button key={p} onClick={()=>setPeriod(p)} style={{
            padding:'8px 18px', borderRadius:10,
            background: period===p ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#f5f5f5',
            color: period===p ? '#fff' : '#525252',
            fontWeight:700, fontSize:'.83rem', border:'none', cursor:'pointer',
            fontFamily:'inherit', boxShadow: period===p ? '0 3px 10px rgba(22,163,74,.25)' : 'none',
            transition:'all .15s',
          }}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
        {summaryCards.map((c,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:'20px' }}>
            <div style={{ width:42, height:42, borderRadius:11, background:c.light, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
              <c.icon size={20} color={c.accent} />
            </div>
            <p style={{ margin:'0 0 4px', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em' }}>{c.label}</p>
            <p style={{ margin:'0 0 5px', fontSize:'1.5rem', fontWeight:800, color:'#111', fontFamily:"'Playfair Display',serif" }}>{c.value}</p>
            <p style={{ margin:0, fontSize:'.75rem', fontWeight:600, color:c.subColor }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Sales Trend chart */}
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:'22px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <IoTrendingUpOutline size={16} color="#16a34a" />
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Sales Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={analytics?.salesData || []} margin={{ top:5, right:10, left:0, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="date" tick={{ fontSize:11, fill:'#a3a3a3', fontFamily:'Sora' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#a3a3a3', fontFamily:'Sora' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize:'.8rem', fontFamily:'Sora' }} />
            <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Sales" />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Revenue (GHS)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top products chart */}
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:'22px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <IoStorefrontOutline size={16} color="#16a34a" />
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:0 }}>Top Products</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analytics?.topProducts || []} margin={{ top:5, right:10, left:0, bottom:5 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize:11, fill:'#a3a3a3', fontFamily:'Sora' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#a3a3a3', fontFamily:'Sora' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize:'.8rem', fontFamily:'Sora' }} />
            <Bar dataKey="sales" fill="#16a34a" name="Units Sold" radius={[6,6,0,0]} />
            <Bar dataKey="revenue" fill="#2563eb" name="Revenue (GHS)" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SalesAnalytics