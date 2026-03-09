import { Link } from 'react-router-dom'
import OTPVerification from '../../components/auth/OTPVerification'
import { IoLeafOutline } from 'react-icons/io5'

const VerifyOTP = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #f0fdf4 0%, #fefce8 100%)', padding: '24px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@900&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoLeafOutline size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>E-MART</span>
          </Link>
        </div>

        <div className="fade-up" style={{ background: 'white', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
          <OTPVerification />
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP