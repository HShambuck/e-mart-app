import { useState } from 'react'
import { IoLocation, IoCalendar, IoDocumentText } from 'react-icons/io5'
import Input from '../common/Input'
import Button from '../common/Button'
import { formatCurrency } from '../../utils/formatters'
import orderService from '../../api/services/orderService'
import toast from 'react-hot-toast'

const OrderForm = ({ product, quantity, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({
    pickupLocation: '',
    pickupDate: '',
    notes: '',
  })

  const totalAmount = quantity * (product?.pricePerBag || 0)

  const handleChange = (field) => (e) => {
    setDetails((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!details.pickupLocation.trim()) {
      toast.error('Please provide a pickup location')
      return
    }

    try {
      setLoading(true)
      await orderService.createOrder({
        product: product._id,
        quantity,
        pricePerBag: product.pricePerBag,
        totalAmount,
        ...details,
      })
      toast.success('Order placed successfully!')
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Order Summary */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Order Summary</p>
        {[
          ['Product', product?.variety],
          ['Bag Size', `${product?.bagSize}kg`],
          ['Quantity', `${quantity} bags`],
          ['Price per bag', formatCurrency(product?.pricePerBag)],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.88rem', color: '#737373' }}>{label}</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#171717' }}>{value}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #bbf7d0', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: '#171717' }}>Total</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Pickup Location */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
          Pickup Location <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <IoLocation size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Where should farmer bring your order?"
            value={details.pickupLocation}
            onChange={handleChange('pickupLocation')}
            required
            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#171717' }}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>

      {/* Pickup Date */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
          Preferred Pickup Date <span style={{ fontSize: '0.78rem', color: '#a3a3a3', fontWeight: 400 }}>(optional)</span>
        </label>
        <div style={{ position: 'relative' }}>
          <IoCalendar size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
          <input
            type="date"
            value={details.pickupDate}
            onChange={handleChange('pickupDate')}
            min={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'white', color: '#171717' }}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#404040', marginBottom: '6px' }}>
          Additional Notes <span style={{ fontSize: '0.78rem', color: '#a3a3a3', fontWeight: 400 }}>(optional)</span>
        </label>
        <div style={{ position: 'relative' }}>
          <IoDocumentText size={17} style={{ position: 'absolute', left: '13px', top: '14px', color: '#a3a3a3', pointerEvents: 'none' }} />
          <textarea
            rows={3}
            placeholder="Any special instructions for the farmer..."
            value={details.notes}
            onChange={handleChange('notes')}
            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: 'white', color: '#171717' }}
            onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'white', border: '1.5px solid #e5e5e5', color: '#525252', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
          onMouseEnter={e => e.target.style.borderColor = '#a3a3a3'}
          onMouseLeave={e => e.target.style.borderColor = '#e5e5e5'}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', background: loading ? '#86efac' : 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(22,163,74,0.25)', transition: 'opacity 0.2s' }}
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </div>
    </form>
  )
}

export default OrderForm