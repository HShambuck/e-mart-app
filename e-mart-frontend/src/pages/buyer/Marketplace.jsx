// ── Marketplace.jsx ────────────────────────────────────────────
import MarketplaceBrowse from '../../components/buyer/MarketplaceBrowse'

const F = "'Sora', system-ui, sans-serif"

const Marketplace = () => {
  return (
    <div style={{ fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg,#0c1d4a 0%,#1e3a8a 55%,#1d4ed8 100%)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <span style={{ fontSize:'.72rem', fontWeight:700, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:8 }}>E-MART</span>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, color:'#fff', margin:'0 0 6px' }}>
          Marketplace
        </h1>
        <p style={{ color:'rgba(255,255,255,.6)', fontSize:'.88rem', margin:0 }}>
          Browse and buy fresh rice directly from local farmers across Ghana
        </p>
      </div>

      <MarketplaceBrowse />
    </div>
  )
}

export default Marketplace