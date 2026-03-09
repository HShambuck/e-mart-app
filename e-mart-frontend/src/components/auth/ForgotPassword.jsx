import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCall, IoArrowBack } from 'react-icons/io5'
import Input from '../common/Input'
import Button from '../common/Button'
import Alert from '../common/Alert'
import authService from '../../api/services/authService'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!phone) {
      toast.error('Please enter your phone number')
      return
    }

    setLoading(true)
    
    try {
      await authService.forgotPassword(phone)
      setSent(true)
      toast.success('Password reset OTP sent to your phone')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto">
        <Alert
          type="success"
          title="OTP Sent!"
          message={`We've sent a 6-digit OTP to ${phone}. Use it to reset your password.`}
        />
        
        <div className="mt-6 text-center">
          <Link
            to="/reset-password"
            state={{ phone }}
            className="btn-primary inline-block px-6 py-3 rounded-lg"
          >
            Enter OTP & Reset Password
          </Link>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => setSent(false)}
            className="text-sm text-neutral-600 hover:text-neutral-800"
          >
            Didn't receive? Send again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-neutral-600">
          Enter your phone number and we'll send you an OTP to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="e.g., 0XX XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<IoCall size={20} />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Send OTP
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center text-neutral-600 hover:text-neutral-800 text-sm"
        >
          <IoArrowBack className="mr-2" />
          Back to login
        </Link>
      </form>
    </div>
  )
}

export default ForgotPassword