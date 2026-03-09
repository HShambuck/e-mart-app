import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLockClosedOutline, IoEye, IoEyeOff, IoLeafOutline, IoCartOutline } from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { validationRules } from '../../utils/validators'

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()

  const validate = (values) => {
    const errors = {}
    if (!values.name || values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    const phoneError = validationRules.phone()(values.phone)
    if (phoneError) errors.phone = phoneError
    if (values.email) {
      const emailError = validationRules.email()(values.email)
      if (emailError) errors.email = emailError
    }
    const passwordError = validationRules.password()(values.password)
    if (passwordError) errors.password = passwordError
    if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!values.role) errors.role = 'Please select your role'
    if (!values.agreedToTerms) errors.agreedToTerms = 'You must agree to the terms'
    return errors
  }

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', phone: '', email: '', password: '', confirmPassword: '', role: '', agreedToTerms: false },
    validate
  )

  const onSubmit = async (formValues) => {
    const { confirmPassword, agreedToTerms, ...userData } = formValues
    await register(userData)
  }

  const fieldStyle = (hasError) => ({
    width: '100%',
    padding: '11px 16px 11px 42px',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e5e5'}`,
    borderRadius: '10px',
    fontSize: '0.92rem',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'white',
    color: '#171717',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  const labelStyle = { display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#404040', marginBottom: '5px' }
  const errorStyle = { color: '#ef4444', fontSize: '0.78rem', marginTop: '3px' }
  const iconStyle = { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }

  const handleFocus = (e) => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }
  const handleBlurStyle = (e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Name */}
      <div>
        <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <IoPersonOutline size={16} style={iconStyle} />
          <input type="text" name="name" placeholder="Your full name" value={values.name}
            onChange={handleChange} onBlur={(e) => { handleBlur(e); handleBlurStyle(e) }} onFocus={handleFocus}
            style={fieldStyle(touched.name && errors.name)} />
        </div>
        {touched.name && errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <IoCallOutline size={16} style={iconStyle} />
          <input type="tel" name="phone" placeholder="0XX XXX XXXX" value={values.phone}
            onChange={handleChange} onBlur={(e) => { handleBlur(e); handleBlurStyle(e) }} onFocus={handleFocus}
            style={fieldStyle(touched.phone && errors.phone)} />
        </div>
        {touched.phone && errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        <p style={{ fontSize: '0.75rem', color: '#a3a3a3', marginTop: '3px' }}>OTP will be sent for verification</p>
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>Email Address <span style={{ color: '#a3a3a3', fontWeight: 400 }}>(Optional)</span></label>
        <div style={{ position: 'relative' }}>
          <IoMailOutline size={16} style={iconStyle} />
          <input type="email" name="email" placeholder="your@email.com" value={values.email}
            onChange={handleChange} onBlur={(e) => { handleBlur(e); handleBlurStyle(e) }} onFocus={handleFocus}
            style={fieldStyle(touched.email && errors.email)} />
        </div>
        {touched.email && errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>

      {/* Role Selection */}
      <div>
        <label style={labelStyle}>I am a <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { value: 'farmer', icon: <IoLeafOutline size={22} />, label: 'Farmer', sub: 'I produce rice' },
            { value: 'buyer', icon: <IoCartOutline size={22} />, label: 'Buyer', sub: 'I want to buy rice' },
          ].map(({ value, icon, label, sub }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleChange({ target: { name: 'role', value } })}
              style={{
                padding: '14px',
                borderRadius: '12px',
                border: `2px solid ${values.role === value ? '#16a34a' : '#e5e5e5'}`,
                background: values.role === value ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{ color: values.role === value ? '#16a34a' : '#a3a3a3', transition: 'color 0.2s' }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: values.role === value ? '#15803d' : '#171717' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: '#737373' }}>{sub}</div>
            </button>
          ))}
        </div>
        {touched.role && errors.role && <p style={errorStyle}>{errors.role}</p>}
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <IoLockClosedOutline size={16} style={iconStyle} />
          <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Create a strong password"
            value={values.password} onChange={handleChange}
            onBlur={(e) => { handleBlur(e); handleBlurStyle(e) }} onFocus={handleFocus}
            style={{ ...fieldStyle(touched.password && errors.password), paddingRight: '42px' }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', padding: 0, display: 'flex' }}>
            {showPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
          </button>
        </div>
        {touched.password && errors.password && <p style={errorStyle}>{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label style={labelStyle}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
        <div style={{ position: 'relative' }}>
          <IoLockClosedOutline size={16} style={iconStyle} />
          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Re-enter your password"
            value={values.confirmPassword} onChange={handleChange}
            onBlur={(e) => { handleBlur(e); handleBlurStyle(e) }} onFocus={handleFocus}
            style={{ ...fieldStyle(touched.confirmPassword && errors.confirmPassword), paddingRight: '42px' }} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', padding: 0, display: 'flex' }}>
            {showConfirmPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
      </div>

      {/* Terms */}
      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
          <input type="checkbox" name="agreedToTerms" checked={values.agreedToTerms} onChange={handleChange}
            style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#16a34a', flexShrink: 0, cursor: 'pointer' }} />
          <span style={{ fontSize: '0.85rem', color: '#525252', lineHeight: 1.5 }}>
            I agree to the{' '}
            <Link to="/terms" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Terms & Conditions</Link>
            {' '}and{' '}
            <Link to="/privacy" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          </span>
        </label>
        {touched.agreedToTerms && errors.agreedToTerms && <p style={errorStyle}>{errors.agreedToTerms}</p>}
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
          marginTop: '4px',
        }}
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#737373', margin: 0 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  )
}

export default SignupForm