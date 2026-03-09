import { Link } from 'react-router-dom'
import SignupForm from '../../components/auth/SignupForm'
import { IoLeafOutline } from 'react-icons/io5'

const Signup = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:wght@700;900&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.25s; opacity: 0; }
      `}</style>

      {/* Right decorative panel */}
      <div style={{ flex: '0 0 38%', background: 'linear-gradient(160deg, #713f12 0%, #a16207 50%, #ca8a04 100%)', display: 'none', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }} className="lg:flex">
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IoLeafOutline size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>E-MART</span>
        </Link>

        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.6rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Start selling<br />or buying<br />today.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
            Join hundreds of farmers and buyers already growing their business on E-MART.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {['Free to join, no hidden fees', 'Verified buyers and farmers only', 'Secure mobile money payments', 'Real-time order tracking'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: '0.7rem' }}>✓</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', background: '#fafafa', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '460px', paddingTop: '20px', paddingBottom: '40px' }}>
          <div className="fade-up fade-up-1" style={{ marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '28px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoLeafOutline size={15} color="white" />
              </div>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>E-MART</span>
            </Link>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 900, color: '#171717', marginBottom: '8px', letterSpacing: '-0.02em' }}>Create your account</h1>
            <p style={{ color: '#737373', fontSize: '0.95rem' }}>Get started with E-MART in minutes — it's free</p>
          </div>

          <div className="fade-up fade-up-2" style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
            <SignupForm />
          </div>

          <p className="fade-up fade-up-3" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: '#a3a3a3' }}>
            By signing up, you agree to our{' '}
            <Link to="/terms" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Terms</Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup