import { useState } from 'react'
import {
  IoPerson, IoCall, IoMail, IoLocation, IoShield,
  IoCreate, IoCheckmarkCircle, IoLeafOutline, IoBusinessOutline,
  IoResizeOutline, IoPeopleOutline, IoNutritionOutline,
} from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { GHANA_REGIONS } from '../../utils/constants'

const field = (label, icon, content) => ({ label, icon, content })

const FarmerProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    name:         user?.name || '',
    phone:        user?.phone || '',
    email:        user?.email || '',
    location:     user?.farmerProfile?.location || '',
    region:       user?.farmerProfile?.region || '',
    farmSize:     user?.farmerProfile?.farmSize || '',
    cooperative:  user?.farmerProfile?.cooperative || '',
    riceVarieties:user?.farmerProfile?.riceVarieties?.join(', ') || '',
  })

  const onSubmit = async (formValues) => {
    await updateProfile(formValues)
    setIsEditing(false)
  }

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const inputStyle = (hasError, disabled) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#fca5a5' : disabled ? '#f5f5f5' : '#e5e5e5'}`,
    background: disabled ? '#fafafa' : '#fff',
    color: disabled ? '#a3a3a3' : '#111',
    fontSize: '0.88rem',
    fontFamily: "'Sora', system-ui, sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .15s',
    cursor: disabled ? 'default' : 'text',
  })

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px',
  }

  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fp-card { animation: fadeUp .4s ease both; }
        .fp-d1   { animation-delay: .05s; }
        .fp-d2   { animation-delay: .12s; }
        .fp-input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,.1); }
        .fp-btn-primary { background: linear-gradient(135deg,#16a34a,#15803d); color:#fff; border:none; padding:10px 22px; border-radius:10px; font-weight:700; font-size:.88rem; cursor:pointer; font-family:inherit; transition:opacity .15s; }
        .fp-btn-primary:hover { opacity:.9; }
        .fp-btn-outline { background:#fff; color:#525252; border:1.5px solid #e5e5e5; padding:10px 22px; border-radius:10px; font-weight:600; font-size:.88rem; cursor:pointer; font-family:inherit; transition:border-color .15s; }
        .fp-btn-outline:hover { border-color:#a3a3a3; }
      `}</style>

      {/* ── Profile Hero ─────────────────────────────── */}
      <div className="fp-card fp-d1" style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)',
        borderRadius: '20px', padding: '32px', marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap', position:'relative' }}>
          {/* Avatar */}
          <div style={{ width:'72px', height:'72px', borderRadius:'18px', background:'rgba(255,255,255,.15)', border:'2px solid rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', borderRadius:'16px', objectFit:'cover' }} />
              : initials}
          </div>

          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px', flexWrap:'wrap' }}>
              <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.6rem', fontWeight:900, color:'#fff', margin:0 }}>
                {user?.name}
              </h1>
              {user?.isVerified && (
                <span style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(134,239,172,.15)', border:'1px solid rgba(134,239,172,.3)', color:'#86efac', fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:'999px' }}>
                  <IoShield size={11} /> Verified Farmer
                </span>
              )}
            </div>
            <p style={{ color:'#86efac', fontSize:'0.85rem', margin:'0 0 4px', fontWeight:500 }}>{user?.email || user?.phone}</p>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:'0.75rem', margin:0 }}>
              Member since {new Date(user?.createdAt).toLocaleDateString('en-GB', { month:'long', year:'numeric' })}
            </p>
          </div>

          <button
            className={isEditing ? 'fp-btn-outline' : 'fp-btn-primary'}
            onClick={() => setIsEditing(!isEditing)}
            style={isEditing ? { background:'rgba(255,255,255,.1)', borderColor:'rgba(255,255,255,.2)', color:'#fff' } : {}}
          >
            {isEditing ? 'Cancel' : <><IoCreate style={{marginRight:6,verticalAlign:'middle'}} size={14}/>Edit Profile</>}
          </button>
        </div>
      </div>

      {/* ── Form Card ─────────────────────────────────── */}
      <div className="fp-card fp-d2" style={{ background:'#fff', borderRadius:'16px', border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:'28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'24px' }}>
          <IoLeafOutline size={16} color="#16a34a" />
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#111', margin:0 }}>
            {isEditing ? 'Edit Profile' : 'Profile Details'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'18px', marginBottom:'24px' }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position:'relative' }}>
                <IoPerson size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="text" name="name" value={values.name}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(touched.name && errors.name, !isEditing), paddingLeft:36 }} />
              </div>
              {touched.name && errors.name && <p style={{ color:'#ef4444', fontSize:'.75rem', marginTop:4 }}>{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position:'relative' }}>
                <IoCall size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="tel" name="phone" value={values.phone}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(touched.phone && errors.phone, !isEditing), paddingLeft:36 }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position:'relative' }}>
                <IoMail size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="email" name="email" value={values.email}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(false, !isEditing), paddingLeft:36 }} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Farm Location</label>
              <div style={{ position:'relative' }}>
                <IoLocation size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="text" name="location" value={values.location}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(false, !isEditing), paddingLeft:36 }} />
              </div>
            </div>

            {/* Region */}
            <div>
              <label style={labelStyle}>Region</label>
              <select name="region" value={values.region} onChange={handleChange} onBlur={handleBlur}
                disabled={!isEditing} className="fp-input"
                style={{ ...inputStyle(false, !isEditing), appearance:'none' }}>
                <option value="">Select region</option>
                {GHANA_REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Farm Size */}
            <div>
              <label style={labelStyle}>Farm Size (acres)</label>
              <div style={{ position:'relative' }}>
                <IoResizeOutline size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="number" name="farmSize" value={values.farmSize}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(false, !isEditing), paddingLeft:36 }} />
              </div>
            </div>

            {/* Cooperative */}
            <div>
              <label style={labelStyle}>Cooperative / Group</label>
              <div style={{ position:'relative' }}>
                <IoPeopleOutline size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="text" name="cooperative" value={values.cooperative}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(false, !isEditing), paddingLeft:36 }} />
              </div>
            </div>

            {/* Rice Varieties */}
            <div>
              <label style={labelStyle}>Rice Varieties Produced</label>
              <div style={{ position:'relative' }}>
                <IoNutritionOutline size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a3a3a3', pointerEvents:'none' }} />
                <input className="fp-input" type="text" name="riceVarieties"
                  placeholder="e.g., Jasmine, Long grain"
                  value={values.riceVarieties}
                  onChange={handleChange} onBlur={handleBlur} disabled={!isEditing}
                  style={{ ...inputStyle(false, !isEditing), paddingLeft:36 }} />
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ display:'flex', gap:'12px', paddingTop:'8px', borderTop:'1px solid #f5f5f5' }}>
              <button type="submit" className="fp-btn-primary" disabled={isSubmitting}
                style={{ opacity: isSubmitting ? .6 : 1 }}>
                <IoCheckmarkCircle style={{ marginRight:6, verticalAlign:'middle' }} size={15} />
                {isSubmitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="fp-btn-outline" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FarmerProfile