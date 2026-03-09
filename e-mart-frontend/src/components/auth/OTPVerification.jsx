import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoPhonePortraitOutline, IoArrowBackOutline } from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  const { verifyOTP, resendOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, phone, type } = location.state || {}

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((p) => p - 1), 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  useEffect(() => {
    if (!userId || !phone) {
      toast.error('Invalid verification request')
      navigate('/login')
    }
  }, [userId, phone, navigate])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pasted)) return
    const newOtp = pasted.split('')
    while (newOtp.length < 6) newOtp.push('')
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) { toast.error('Please enter the complete 6-digit code'); return }
    await verifyOTP({ userId, otp: otpCode, phone })
  }

  const handleResend = async () => {
    if (!canResend) return
    const result = await resendOTP(phone)
    if (result.success) {
      setTimer(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const isComplete = otp.join('').length === 6
  const progress = (otp.filter(d => d !== '').length / 6) * 100

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@900&display=swap');
        .otp-input {
          width: 48px;
          height: 56px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
          font-family: 'Fraunces', serif;
          background: white;
          color: #171717;
          caret-color: #16a34a;
        }
        .otp-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
          background: #f0fdf4;
        }
        .otp-input.filled {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #15803d;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes checkmark {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
        .verify-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s;
        }
        .verify-btn.active {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          box-shadow: 0 6px 20px rgba(22,163,74,0.3);
        }
        .verify-btn.active:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(22,163,74,0.35); }
        .verify-btn.inactive {
          background: #f5f5f5;
          color: #a3a3a3;
          cursor: not-allowed;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #dcfce7, #f0fdf4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid #bbf7d0' }}>
          <IoPhonePortraitOutline size={30} color="#16a34a" />
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.7rem', fontWeight: 900, color: '#171717', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Verify your phone
        </h2>
        <p style={{ color: '#737373', fontSize: '0.92rem', lineHeight: 1.6 }}>
          We sent a 6-digit code to
        </p>
        <p style={{ color: '#171717', fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{phone}</p>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: '#f0f0f0', borderRadius: '999px', marginBottom: '28px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '999px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP inputs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`otp-input${digit ? ' filled' : ''}`}
            />
          ))}
        </div>

        {/* Submit */}
        <button type="submit" className={`verify-btn ${isComplete ? 'active' : 'inactive'}`} disabled={!isComplete}>
          {isComplete ? 'Verify & Continue' : `Enter ${6 - otp.filter(d => d).length} more digit${6 - otp.filter(d => d).length !== 1 ? 's' : ''}`}
        </button>

        {/* Timer / Resend */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {canResend ? (
            <button type="button" onClick={handleResend}
              style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s' }}
              onMouseEnter={e => e.target.style.background = '#f0fdf4'}
              onMouseLeave={e => e.target.style.background = 'none'}>
              Resend code
            </button>
          ) : (
            <p style={{ color: '#a3a3a3', fontSize: '0.88rem' }}>
              Resend code in{' '}
              <span style={{ color: '#16a34a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                0:{String(timer).padStart(2, '0')}
              </span>
            </p>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button type="button" onClick={() => navigate('/signup')}
            style={{ background: 'none', border: 'none', color: '#a3a3a3', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IoArrowBackOutline size={14} /> Wrong number? Go back
          </button>
        </div>
      </form>
    </div>
  )
}

export default OTPVerification