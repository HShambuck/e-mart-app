import { useState } from 'react'
import {
  IoCheckmarkCircle, IoTimeOutline, IoCloseCircle,
  IoReceiptOutline, IoChevronBackOutline, IoChevronForwardOutline,
} from 'react-icons/io5'
import { formatCurrency, formatDate } from '../../utils/formatters'

const statusConfig = {
  completed: { label:'Completed', bg:'#dcfce7', color:'#166534', Icon:IoCheckmarkCircle  },
  pending:   { label:'Pending',   bg:'#fef9c3', color:'#854d0e', Icon:IoTimeOutline       },
  held:      { label:'In Escrow', bg:'#dbeafe', color:'#1e40af', Icon:IoTimeOutline       },
  released:  { label:'Released',  bg:'#dcfce7', color:'#166534', Icon:IoCheckmarkCircle  },
  failed:    { label:'Failed',    bg:'#fee2e2', color:'#991b1b', Icon:IoCloseCircle       },
}

const ITEMS = 10

const TransactionHistory = ({ transactions = [] }) => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(transactions.length / ITEMS)
  const slice = transactions.slice((page-1)*ITEMS, page*ITEMS)

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'56px 20px', background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', fontFamily:"'Sora',system-ui,sans-serif" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <IoReceiptOutline size={28} color="#86efac" />
        </div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:700, color:'#111', margin:'0 0 6px' }}>No transactions yet</p>
        <p style={{ fontSize:'.83rem', color:'#a3a3a3', margin:0 }}>Your payment history will appear here</p>
      </div>
    )
  }

  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #f0f0f0', boxShadow:'0 2px 10px rgba(0,0,0,.04)', overflow:'hidden', fontFamily:"'Sora',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        .th-row:hover { background: #fafafa; }
        .th-row { transition: background .12s; }
      `}</style>

      {/* Table header */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.5fr 1fr 1fr', gap:8, padding:'12px 20px', background:'#fafafa', borderBottom:'1px solid #f0f0f0' }}>
        {['Date','Order #','Buyer','Amount','Status'].map(h => (
          <p key={h} style={{ margin:0, fontSize:'.67rem', fontWeight:700, color:'#a3a3a3', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div>
        {slice.map((tx, idx) => {
          const sc = statusConfig[tx.status] || { label:tx.status, bg:'#f5f5f5', color:'#525252', Icon:IoTimeOutline }
          return (
            <div key={tx._id} className="th-row" style={{
              display:'grid', gridTemplateColumns:'1fr 1fr 1.5fr 1fr 1fr', gap:8,
              padding:'14px 20px', alignItems:'center',
              borderBottom: idx < slice.length-1 ? '1px solid #f5f5f5' : 'none',
            }}>
              <p style={{ margin:0, fontSize:'.82rem', color:'#525252' }}>{formatDate(tx.createdAt)}</p>
              <p style={{ margin:0, fontSize:'.82rem', fontWeight:700, color:'#111' }}>#{tx.orderNumber}</p>
              <p style={{ margin:0, fontSize:'.82rem', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tx.buyer?.name}</p>
              <p style={{ margin:0, fontSize:'.88rem', fontWeight:800, color:'#111', fontFamily:"'Playfair Display',serif" }}>{formatCurrency(tx.amount)}</p>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:'999px', background:sc.bg, color:sc.color, fontSize:'.7rem', fontWeight:700, width:'fit-content' }}>
                <sc.Icon size={12}/> {sc.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderTop:'1px solid #f5f5f5' }}>
          <p style={{ margin:0, fontSize:'.78rem', color:'#a3a3a3' }}>
            Showing {(page-1)*ITEMS+1}–{Math.min(page*ITEMS, transactions.length)} of {transactions.length}
          </p>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e5e5e5', background:page===1?'#fafafa':'#fff', color:page===1?'#d4d4d4':'#525252', cursor:page===1?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s' }}>
              <IoChevronBackOutline size={14}/>
            </button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)} style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${n===page?'#16a34a':'#e5e5e5'}`, background:n===page?'linear-gradient(135deg,#16a34a,#15803d)':'#fff', color:n===page?'#fff':'#525252', cursor:'pointer', fontSize:'.8rem', fontWeight:700, fontFamily:'inherit', transition:'all .12s' }}>
                {n}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e5e5e5', background:page===totalPages?'#fafafa':'#fff', color:page===totalPages?'#d4d4d4':'#525252', cursor:page===totalPages?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s' }}>
              <IoChevronForwardOutline size={14}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory