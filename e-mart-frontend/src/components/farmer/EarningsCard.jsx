import { IoWalletOutline, IoTrendingUpOutline, IoCalendarOutline, IoDownloadOutline, IoTimeOutline } from 'react-icons/io5'
import { formatCurrency } from '../../utils/formatters'

const EarningsCard = ({ earnings, onExport }) => {
  const cards = [
    {
      label:    'Total Earnings',
      value:    formatCurrency(earnings?.total || 0),
      sub:      'All time',
      subColor: '#a3a3a3',
      icon:     IoWalletOutline,
      accent:   '#16a34a',
      light:    '#f0fdf4',
      gradient: 'linear-gradient(135deg,#16a34a,#15803d)',
    },
    {
      label:    'This Month',
      value:    formatCurrency(earnings?.thisMonth || 0),
      sub:      `+${earnings?.monthGrowth || 0}% from last month`,
      subColor: '#16a34a',
      icon:     IoCalendarOutline,
      accent:   '#2563eb',
      light:    '#eff6ff',
      gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    },
    {
      label:    'In Escrow',
      value:    formatCurrency(earnings?.pending || 0),
      sub:      'Awaiting release',
      subColor: '#f97316',
      icon:     IoTimeOutline,
      accent:   '#f97316',
      light:    '#fff7ed',
      gradient: 'linear-gradient(135deg,#f97316,#ea580c)',
    },
    {
      label:    'Avg. Order Value',
      value:    formatCurrency(earnings?.avgOrder || 0),
      sub:      'Per transaction',
      subColor: '#a3a3a3',
      icon:     IoTrendingUpOutline,
      accent:   '#9333ea',
      light:    '#faf5ff',
      gradient: 'linear-gradient(135deg,#9333ea,#7e22ce)',
    },
  ]

  return (
    <div style={{ fontFamily:"'Sora', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:16, border:'1px solid #f0f0f0',
            boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:20,
            transition:'transform .2s, box-shadow .2s', cursor:'default',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,.09)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.04)'}}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ width:42, height:42, borderRadius:11, background:c.light, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <c.icon size={20} color={c.accent} />
              </div>
            </div>
            <p style={{ margin:'0 0 4px', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em' }}>{c.label}</p>
            <p style={{ margin:'0 0 6px', fontSize:'1.5rem', fontWeight:800, color:'#111', fontFamily:"'Playfair Display',serif", letterSpacing:'-.02em' }}>{c.value}</p>
            <p style={{ margin:0, fontSize:'.75rem', fontWeight:600, color:c.subColor }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Export row */}
      {onExport && (
        <div style={{ marginTop:14, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius:14, border:'1px solid #bbf7d0', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ margin:'0 0 3px', fontFamily:"'Playfair Display',serif", fontSize:'.95rem', fontWeight:700, color:'#14532d' }}>Export Earnings Report</p>
            <p style={{ margin:0, fontSize:'.78rem', color:'#16a34a', fontWeight:500 }}>Download a detailed PDF of all your transactions</p>
          </div>
          <button onClick={onExport} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:700, fontSize:'.85rem', border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 3px 10px rgba(22,163,74,.25)' }}>
            <IoDownloadOutline size={16}/> Export PDF
          </button>
        </div>
      )}
    </div>
  )
}

export default EarningsCard