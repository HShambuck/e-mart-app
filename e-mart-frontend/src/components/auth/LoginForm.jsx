import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCallOutline, IoLockClosedOutline, IoEye, IoEyeOff } from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const validate = (values) => {
    const errors = {}
    if (!values.emailOrPhone) errors.emailOrPhone = 'Email or phone number is required'
    if (!values.password) errors.password = 'Password is required'
    return errors
  }

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { emailOrPhone: '', password: '', rememberMe: false },
    validate
  )

  const onSubmit = async (formValues) => {
    await login(formValues)
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e5e5'}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'white',
    color: '#171717',
    boxSizing: 'border-box',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Email/Phone */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
          Email or Phone Number
        </label>
        <div style={{ position: 'relative' }}>
          <IoCallOutline size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Enter email or phone"
            value={values.emailOrPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle(touched.emailOrPhone && errors.emailOrPhone)}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
          />
        </div>
        {touched.emailOrPhone && errors.emailOrPhone && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.emailOrPhone}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <IoLockClosedOutline size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ ...inputStyle(touched.password && errors.password), paddingRight: '44px' }}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', padding: 0, display: 'flex' }}
          >
            {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{errors.password}</p>
        )}
      </div>

      {/* Remember + Forgot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#525252' }}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
            style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
          />
          Remember me
        </label>
        <Link to="/forgot-password" style={{ fontSize: '0.88rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: '10px',
          background: isSubmitting ? '#86efac' : 'linear-gradient(135deg, #16a34a, #15803d)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1rem',
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 4px 14px rgba(22,163,74,0.25)',
          transition: 'opacity 0.2s',
        }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#737373', margin: 0 }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
      </p>
    </div>
  )
}

export default LoginForm