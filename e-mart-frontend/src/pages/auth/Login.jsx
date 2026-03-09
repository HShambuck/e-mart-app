import { Link } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'
import { IoLeafOutline } from 'react-icons/io5'

const Login = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:wght@700;900&display=swap');
        .auth-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
          color: #171717;
        }
        .auth-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .auth-input::placeholder { color: #a3a3a3; }
        .auth-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 4px 14px rgba(22,163,74,0.3);
        }
        .auth-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a3a3a3; pointer-events: none; }
        .input-icon-right { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #a3a3a3; cursor: pointer; background: none; border: none; padding: 0; display: flex; align-items: center; }
        .error-text { color: #ef4444; font-size: 0.8rem; margin-top: 4px; }
        .field-label { display: block; font-size: 0.85rem; font-weight: 600; color: #404040; margin-bottom: 6px; }
        .checkbox-row { display: flex; align-items: center; justify-content: space-between; }
        .remember-label { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #525252; cursor: pointer; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e5e5; }
        .divider span { font-size: 0.8rem; color: #a3a3a3; font-weight: 500; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.25s; opacity: 0; }
      `}</style>

      {/* Left panel - decorative */}
      <div style={{ flex: '0 0 45%', background: 'linear-gradient(160deg, #14532d 0%, #15803d 50%, #16a34a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }} className="hidden lg:flex">
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <IoLeafOutline size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>E-MART</span>
        </Link>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Trusted by farmers across Ghana</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.8rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Your harvest.<br />Your market.<br />Your price.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '320px' }}>
            Connect directly with buyers across Ghana. No middlemen, fair prices, secure payments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[['500+', 'Farmers'], ['2,000+', 'Buyers'], ['₵1M+', 'Traded'], ['10', 'Regions']].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#fafafa' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="fade-up fade-up-1" style={{ marginBottom: '36px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }} className="lg:hidden">
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoLeafOutline size={15} color="white" />
              </div>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>E-MART</span>
            </Link>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 900, color: '#171717', marginBottom: '8px', letterSpacing: '-0.02em' }}>Welcome back</h1>
            <p style={{ color: '#737373', fontSize: '0.95rem' }}>Sign in to your E-MART account</p>
          </div>

          <div className="fade-up fade-up-2" style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
            <LoginForm />
          </div>

          <p className="fade-up fade-up-3" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#737373' }}>
            New to E-MART?{' '}
            <Link to="/signup" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login