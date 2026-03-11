import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoNutritionOutline, IoCashOutline, IoLayersOutline,
  IoLocationOutline, IoCalendarOutline, IoDocumentTextOutline,
  IoCheckmarkCircle, IoCloseOutline, IoImageOutline,
} from 'react-icons/io5'
import { useForm } from '../../hooks/useForm'
import { RICE_VARIETIES, BAG_SIZES, GHANA_REGIONS } from '../../utils/constants'
import productService from '../../api/services/productService'
import ImageUpload from '../common/ImageUpload'
import toast from 'react-hot-toast'

// ── Shared style helpers ────────────────────────────────────────
const F = "'Sora', system-ui, sans-serif"

const inputBase = (hasError = false, disabled = false) => ({
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: `1.5px solid ${hasError ? '#fca5a5' : '#e5e5e5'}`,
  background: disabled ? '#fafafa' : '#fff',
  color: disabled ? '#a3a3a3' : '#111',
  fontSize: '0.88rem',
  fontFamily: F,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color .15s, box-shadow .15s',
  cursor: disabled ? 'default' : 'text',
})

const inputWithIcon = (hasError, disabled) => ({
  ...inputBase(hasError, disabled),
  paddingLeft: '38px',
})

const labelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#a3a3a3',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  marginBottom: '6px',
}

const errorStyle = { color: '#ef4444', fontSize: '.75rem', marginTop: 4 }

const iconStyle = {
  position: 'absolute', left: 12, top: '50%',
  transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none',
}

const sectionHead = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '0.95rem', fontWeight: 700, color: '#111',
  margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8,
}

// ── Component ───────────────────────────────────────────────────
const ProductListingForm = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate()
  const [images, setImages] = useState(initialData?.images || [])

  const validate = (values) => {
    const errors = {}
    if (!values.variety)                                errors.variety     = 'Rice variety is required'
    if (!values.pricePerBag || values.pricePerBag <= 0) errors.pricePerBag = 'Valid price is required'
    if (!values.quantity    || values.quantity  <= 0)   errors.quantity    = 'Valid quantity is required'
    if (!values.bagSize)                                errors.bagSize     = 'Bag size is required'
    if (!values.location)                               errors.location    = 'Location is required'
    return errors
  }

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    initialData || {
      variety: '', pricePerBag: '', quantity: '', bagSize: '50',
      location: '', region: '', harvestDate: '', qualityDescription: '', status: 'available',
    },
    validate,
  )

  const onSubmit = async (formValues) => {
    try {
      let response
      if (isEdit) {
        response = await productService.updateProduct(initialData._id, formValues)
        toast.success('Product updated!')
      } else {
        response = await productService.createProduct(formValues)
        toast.success('Product listed!')
      }

      // Only upload images that are actual new File objects (not existing URL strings)
      const newImages = images.filter(img => img instanceof File)
      if (newImages.length > 0) {
        try {
          await productService.uploadImages(response.product._id, newImages)
        } catch {
          // Image upload failure is non-critical — product was saved, just warn
          toast.error("Product saved but images couldn't be uploaded")
        }
      }

      navigate('/farmer/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    }
  }

  const focusGreen  = e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,.1)' }
  const blurDefault = e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ── Section: Product Info ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,.04)', padding: 22 }}>
          <p style={sectionHead}><IoNutritionOutline size={16} color="#16a34a" /> Product Information</p>

          {/* Rice Variety */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Rice Variety <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <IoNutritionOutline size={15} style={iconStyle} />
              <select name="variety" value={values.variety} onChange={handleChange}
                onBlur={(e) => { handleBlur(e); blurDefault(e) }} onFocus={focusGreen}
                style={{ ...inputWithIcon(touched.variety && errors.variety), appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select rice variety</option>
                {RICE_VARIETIES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>
            {touched.variety && errors.variety && <p style={errorStyle}>{errors.variety}</p>}
          </div>

          {/* Price + Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Price per Bag (GHS) <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <IoCashOutline size={15} style={iconStyle} />
                <input type="number" name="pricePerBag" placeholder="e.g. 300"
                  value={values.pricePerBag} onChange={handleChange}
                  onBlur={(e) => { handleBlur(e); blurDefault(e) }} onFocus={focusGreen}
                  style={inputWithIcon(touched.pricePerBag && errors.pricePerBag)} />
              </div>
              {touched.pricePerBag && errors.pricePerBag && <p style={errorStyle}>{errors.pricePerBag}</p>}
            </div>

            <div>
              <label style={labelStyle}>Quantity (bags) <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <IoLayersOutline size={15} style={iconStyle} />
                <input type="number" name="quantity" placeholder="e.g. 50"
                  value={values.quantity} onChange={handleChange}
                  onBlur={(e) => { handleBlur(e); blurDefault(e) }} onFocus={focusGreen}
                  style={inputWithIcon(touched.quantity && errors.quantity)} />
              </div>
              {touched.quantity && errors.quantity && <p style={errorStyle}>{errors.quantity}</p>}
            </div>
          </div>

          {/* Bag Size */}
          <div>
            <label style={labelStyle}>Bag Size <span style={{ color: '#ef4444' }}>*</span></label>
            <select name="bagSize" value={values.bagSize} onChange={handleChange}
              onBlur={(e) => { handleBlur(e); blurDefault(e) }} onFocus={focusGreen}
              style={{ ...inputBase(touched.bagSize && errors.bagSize), appearance: 'none', cursor: 'pointer' }}>
              {BAG_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {touched.bagSize && errors.bagSize && <p style={errorStyle}>{errors.bagSize}</p>}
          </div>
        </div>

        {/* ── Section: Location ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,.04)', padding: 22 }}>
          <p style={sectionHead}><IoLocationOutline size={16} color="#16a34a" /> Location</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Town / Area <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <IoLocationOutline size={15} style={iconStyle} />
                <input type="text" name="location" placeholder="e.g. Asutsuare"
                  value={values.location} onChange={handleChange}
                  onBlur={(e) => { handleBlur(e); blurDefault(e) }} onFocus={focusGreen}
                  style={inputWithIcon(touched.location && errors.location)} />
              </div>
              {touched.location && errors.location && <p style={errorStyle}>{errors.location}</p>}
            </div>

            <div>
              <label style={labelStyle}>Region</label>
              <select name="region" value={values.region} onChange={handleChange}
                onBlur={blurDefault} onFocus={focusGreen}
                style={{ ...inputBase(), appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select region</option>
                {GHANA_REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Section: Details ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,.04)', padding: 22 }}>
          <p style={sectionHead}><IoDocumentTextOutline size={16} color="#16a34a" /> Additional Details</p>

          {/* Harvest Date */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Harvest Date</label>
            <div style={{ position: 'relative' }}>
              <IoCalendarOutline size={15} style={iconStyle} />
              <input type="date" name="harvestDate" value={values.harvestDate}
                onChange={handleChange} onBlur={blurDefault} onFocus={focusGreen}
                style={inputWithIcon()} />
            </div>
          </div>

          {/* Quality Description */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Quality Description <span style={{ color: '#a3a3a3', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea name="qualityDescription" rows={4}
              placeholder="e.g. Organic, pesticide-free, premium grade…"
              value={values.qualityDescription} onChange={handleChange}
              onBlur={blurDefault} onFocus={focusGreen}
              style={{ ...inputBase(), resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Listing Status</label>
            <select name="status" value={values.status} onChange={handleChange}
              onBlur={blurDefault} onFocus={focusGreen}
              style={{ ...inputBase(), appearance: 'none', cursor: 'pointer' }}>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* ── Section: Images ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,.04)', padding: 22 }}>
          <p style={sectionHead}>
            <IoImageOutline size={16} color="#16a34a" /> Product Images
            <span style={{ fontSize: '.75rem', fontWeight: 400, color: '#a3a3a3', fontFamily: F }}>(optional)</span>
          </p>
          <ImageUpload
            value={images[0]}
            onChange={(file) => setImages([file])}
            onRemove={() => setImages([])}
          />
        </div>

        {/* ── Submit ── */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={isSubmitting} style={{
            flex: 1, padding: '13px', borderRadius: 11,
            background: isSubmitting ? '#86efac' : 'linear-gradient(135deg,#16a34a,#15803d)',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: F, boxShadow: '0 4px 14px rgba(22,163,74,.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <IoCheckmarkCircle size={18} />
            {isSubmitting ? 'Saving…' : isEdit ? 'Update Product' : 'List Product'}
          </button>
          <button type="button" onClick={() => navigate('/farmer/products')} style={{
            padding: '13px 24px', borderRadius: 11,
            background: '#fff', color: '#525252',
            fontWeight: 600, fontSize: '0.9rem',
            border: '1.5px solid #e5e5e5', cursor: 'pointer',
            fontFamily: F, display: 'flex', alignItems: 'center', gap: 7,
            transition: 'border-color .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#a3a3a3'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}>
            <IoCloseOutline size={16} /> Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

export default ProductListingForm