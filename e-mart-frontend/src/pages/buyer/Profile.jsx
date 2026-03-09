import BuyerProfile from '../../components/buyer/BuyerProfile'

const F = "'Sora', system-ui, sans-serif"

const Profile = () => {
  return (
    <div style={{ fontFamily: F, maxWidth: 860, margin: '0 auto' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize:'.72rem', fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:8 }}>Buyer Portal</span>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, color:'#111', margin:'0 0 6px' }}>My Profile</h1>
        <p style={{ color:'#737373', fontSize:'.9rem', margin:0 }}>Manage your account information and preferences</p>
      </div>

      <BuyerProfile />
    </div>
  )
}

export default Profile