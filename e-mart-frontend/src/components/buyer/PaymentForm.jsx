import { useState } from 'react'
import { IoShieldCheckmark, IoPhonePortraitOutline, IoCardOutline, IoWalletOutline } from 'react-icons/io5'
import { PAYMENT_METHODS } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'
import paymentService from '../../api/services/paymentService'
import toast from 'react-hot-toast'

const PaymentForm = ({ order, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const isMomo = selectedMethod && selectedMethod !== 'paystack' && selectedMethod !== 'bank_transfer'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMethod) {
      toast.error('Please select a payment method')
      return
    }
    if (isMomo && !phoneNumber.trim()) {
      toast.error('Please enter your mobile money number')
      return
    }

    try {
      setLoading(true)
      const payload = {
        orderId: order._id,
        amount: order.totalAmount,
        method: selectedMethod,
        ...(isMomo && { phoneNumber }),
      }

      if (selectedMethod === 'paystack') {
        const res = await paymentService.cardPayment(payload)
        window.location.href = res.authorizationUrl
      } else {
        await paymentService.mobileMoney(payload)
        toast.success('Payment initiated! Approve the prompt on your phone.')
        setTimeout(() => { if (onSuccess) onSuccess() }, 2500)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const methodIcons = {
    mtn_momo: IoPhonePortraitOutline,
    vodafone_cash: IoPhonePortraitOutline,
    airteltigo_money: IoPhonePortraitOutline,
    bank_transfer: IoWalletOutline,
    paystack: IoCardOutline,
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Amount banner */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
        <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Amount to Pay</p>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 900, color: '#14532d', margin: 0, letterSpacing: '-0.02em' }}>{formatCurrency(order?.totalAmount)}</p>
        <p style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '4px' }}>Order #{order?.orderNumber}</p>
      </div>

      {/* Payment Methods */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '10px' }}>Select Payment Method</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PAYMENT_METHODS.map((method) => {
            const Icon = methodIcons[method.value] || IoWalletOutline
            const isSelected = selectedMethod === method.value
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setSelectedMethod(method.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                  border: `2px solid ${isSelected ? '#16a34a' : '#e5e5e5'}`,
                  background: isSelected ? '#f0fdf4' : 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isSelected ? '#dcfce7' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.3rem' }}>{method.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: isSelected ? '#15803d' : '#171717' }}>{method.label}</p>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? '#16a34a' : '#d4d4d4'}`, background: isSelected ? '#16a34a' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Money Number */}
      {isMomo && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
            Mobile Money Number <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <IoPhonePortraitOutline size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
            <input
              type="tel"
              placeholder="e.g., 0XX XXX XXXX"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#171717' }}
              onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: '#737373', marginTop: '5px' }}>You'll receive a payment prompt on this number to approve</p>
        </div>
      )}

      {/* Escrow notice */}
      <div style={{ display: 'flex', gap: '12px', padding: '14px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
        <IoShieldCheckmark size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '1px' }} />
        <p style={{ fontSize: '0.82rem', color: '#1e40af', margin: 0, lineHeight: 1.5 }}>
          Your payment is protected by escrow. Funds are only released to the farmer after you confirm delivery.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!selectedMethod || loading}
        style={{
          width: '100%', padding: '14px',
          borderRadius: '12px',
          background: (!selectedMethod || loading) ? '#e5e5e5' : 'linear-gradient(135deg, #16a34a, #15803d)',
          color: (!selectedMethod || loading) ? '#a3a3a3' : 'white',
          fontWeight: 700, fontSize: '1rem', border: 'none',
          cursor: (!selectedMethod || loading) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          boxShadow: (!selectedMethod || loading) ? 'none' : '0 4px 14px rgba(22,163,74,0.3)',
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'Processing...' : selectedMethod ? `Pay ${formatCurrency(order?.totalAmount)}` : 'Select a payment method'}
      </button>
    </form>
  )
}

export default PaymentForm