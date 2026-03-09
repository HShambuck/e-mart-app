import { useState } from 'react'
import {
  IoPerson, IoCall, IoMail, IoLocationOutline, IoShieldCheckmark,
  IoBusiness, IoCreateOutline, IoCheckmarkCircle, IoCloseOutline,
  IoCartOutline, IoHeartOutline,
} from 'react-icons/io5'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { GHANA_REGIONS } from '../../utils/constants'

const F = "'Sora', system-ui, sans-serif"
const inputBase = (disabled, hasError) => ({
  width:'100%', padding:'11px 14px', borderRadius:10,
  border:`1.5px solid ${hasError?'#fca5a5':disabled?'#f0f0f0':'#e5e5e5'}`,
  background:disabled?'#fafafa':'#fff', color:disabled?'#a3a3a3':'#111',
  fontSize:'.88rem', fontFamily:F, outline:'none',
  boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s',
})
const withIcon = (disabled, hasError) => ({ ...inputBase(disabled, hasError), paddingLeft:38 })
const labelStyle = { display:'block', fontSize:'.72rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }
const iconPos = { position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }
const card = { background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', padding:24, marginBottom:16 }
const focusBlue = e => { e.target.style.borderColor='#2563eb'; e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)' }
const blurReset = e => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }

const BuyerProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    name: user?.name||'', phone: user?.phone||'', email: user?.email||'',
    businessName: user?.buyerProfile?.businessName||'',
    location: user?.buyerProfile?.location||'', region: user?.buyerProfile?.region||'',
  })

  const onSubmit = async (v) => { await updateProfile(v); setIsEditing(false) }

  const initials = user?.name ? user.name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : '?'
  const stats = [
    { icon:<IoCartOutline size={18} color="#2563eb"/>, label:'Total Orders',    val:user?.stats?.totalOrders||0 },
    { icon:<IoCheckmarkCircle size={18} color="#16a34a"/>, label:'Completed',   val:user?.stats?.completedOrders||0 },
    { icon:<IoHeartOutline size={18} color="#ef4444"/>, label:'Saved Products', val:user?.stats?.favoriteProducts||0 },
  ]

  return (
    <div style={{ fontFamily:F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');`}</style>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0c1d4a 0%,#1e3a8a 55%,#1d4ed8 100%)', borderRadius:20, padding:'28px 32px', marginBottom:20, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          <div style={{ width:72, height:72, borderRadius:18, background:'linear-gradient(135deg,#3b82f6,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:800, color:'#fff', flexShrink:0, boxShadow:'0 4px 16px rgba(37,99,235,.4)', overflow:'hidden' }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : initials}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:900, color:'#fff', margin:0 }}>{user?.name}</h2>
              {user?.isVerified && <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:'999px', background:'rgba(34,197,94,.2)', color:'#86efac', fontSize:'.72rem', fontWeight:700 }}><IoShieldCheckmark size={12}/> Verified</span>}
            </div>
            <p style={{ color:'rgba(255,255,255,.55)', fontSize:'.85rem', margin:'0 0 2px' }}>{user?.email||user?.phone}</p>
            <p style={{ color:'rgba(255,255,255,.35)', fontSize:'.75rem', margin:0 }}>Member since {new Date(user?.createdAt).toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</p>
          </div>
          <button onClick={()=>setIsEditing(!isEditing)} style={{ padding:'9px 20px', borderRadius:10, background:'rgba(255,255,255,.15)', border:'1.5px solid rgba(255,255,255,.2)', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:7 }}>
            {isEditing ? <><IoCloseOutline size={15}/> Cancel</> : <><IoCreateOutline size={15}/> Edit Profile</>}
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:20 }}>
          {stats.map(s=>(
            <div key={s.label} style={{ background:'rgba(255,255,255,.08)', borderRadius:12, padding:'12px 14px', textAlign:'center' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>{s.icon}</div>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:900, color:'#fff', margin:'0 0 2px' }}>{s.val}</p>
              <p style={{ fontSize:'.68rem', color:'rgba(255,255,255,.5)', margin:0, fontWeight:600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={card}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:'#111', margin:'0 0 18px', display:'flex', alignItems:'center', gap:8 }}>
          <IoPerson size={16} color="#2563eb"/> Personal Information
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            {[
              { name:'name', label:'Full Name', type:'text', icon:<IoPerson size={14} color={isEditing?'#2563eb':'#d4d4d4'}/>, err:touched.name&&errors.name },
              { name:'phone', label:'Phone Number', type:'tel', icon:<IoCall size={14} color={isEditing?'#2563eb':'#d4d4d4'}/>, err:touched.phone&&errors.phone },
              { name:'email', label:'Email Address', type:'email', icon:<IoMail size={14} color={isEditing?'#2563eb':'#d4d4d4'}/> },
              { name:'businessName', label:'Business Name', type:'text', icon:<IoBusiness size={14} color={isEditing?'#2563eb':'#d4d4d4'}/>, optional:true },
              { name:'location', label:'Town / Location', type:'text', icon:<IoLocationOutline size={14} color={isEditing?'#2563eb':'#d4d4d4'}/> },
            ].map(f=>(
              <div key={f.name}>
                <label style={labelStyle}>{f.label}{f.optional&&<span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:'.68rem' }}> (optional)</span>}</label>
                <div style={{ position:'relative' }}>
                  <span style={iconPos}>{f.icon}</span>
                  <input name={f.name} type={f.type} value={values[f.name]} disabled={!isEditing}
                    onChange={handleChange} onBlur={e=>{handleBlur(e);blurReset(e)}} onFocus={isEditing?focusBlue:undefined}
                    style={withIcon(!isEditing, f.err)}/>
                </div>
                {f.err && <p style={{ color:'#ef4444', fontSize:'.72rem', marginTop:3 }}>{f.err}</p>}
              </div>
            ))}
            <div>
              <label style={labelStyle}>Region</label>
              <select name="region" value={values.region} disabled={!isEditing}
                onChange={handleChange} onBlur={blurReset} onFocus={isEditing?focusBlue:undefined}
                style={{ ...inputBase(!isEditing), appearance:'none', cursor:isEditing?'pointer':'default' }}>
                <option value="">Select region</option>
                {GHANA_REGIONS.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          {isEditing && (
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button type="submit" disabled={isSubmitting} style={{ padding:'11px 28px', borderRadius:10, border:'none', background:isSubmitting?'#93c5fd':'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontWeight:700, fontSize:'.9rem', cursor:isSubmitting?'not-allowed':'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:7, boxShadow:'0 4px 14px rgba(37,99,235,.25)' }}>
                <IoCheckmarkCircle size={16}/> {isSubmitting?'Saving…':'Save Changes'}
              </button>
              <button type="button" onClick={()=>setIsEditing(false)} style={{ padding:'11px 20px', borderRadius:10, border:'1.5px solid #e5e5e5', background:'#fff', color:'#525252', fontWeight:600, fontSize:'.88rem', cursor:'pointer', fontFamily:F }}>Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default BuyerProfile