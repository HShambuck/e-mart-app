import { useState } from 'react'
import { IoSearch, IoChatbubbleOutline } from 'react-icons/io5'
import Avatar from '../common/Avatar'
import { formatRelativeTime } from '../../utils/formatters'

const ChatList = ({ conversations = [], selectedId, onSelect, loading = false }) => {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      {/* Header + Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 900, color: '#171717', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          Messages
        </p>
        <div style={{ position: 'relative' }}>
          <IoSearch size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1.5px solid #e5e5e5', borderRadius: '8px',
              fontSize: '0.83rem', fontFamily: 'inherit', outline: 'none',
              background: '#fafafa', color: '#171717', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#16a34a'}
            onBlur={e => e.target.style.borderColor = '#e5e5e5'}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#a3a3a3', fontSize: '0.85rem' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <IoChatbubbleOutline size={36} color="#e5e5e5" style={{ margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontSize: '0.85rem', color: '#a3a3a3', margin: 0 }}>
              {search ? 'No results found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filtered.map(conv => {
            const isActive = conv._id === selectedId
            return (
              <button
                key={conv._id}
                onClick={() => onSelect(conv)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                  background: isActive ? '#f0fdf4' : 'white',
                  borderLeft: `3px solid ${isActive ? '#16a34a' : 'transparent'}`,
                  borderBottom: '1px solid #fafafa',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#fafafa' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white' }}
              >
                <Avatar src={conv.avatar} name={conv.name} size="md" online={conv.isOnline} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <p style={{ margin: 0, fontWeight: isActive ? 700 : 600, fontSize: '0.88rem', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '8px' }}>
                      {conv.name}
                    </p>
                    {conv.lastMessageTime && (
                      <span style={{ fontSize: '0.7rem', color: '#a3a3a3', flexShrink: 0 }}>
                        {formatRelativeTime(conv.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '6px' }}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', padding: '0 4px', borderRadius: '999px', background: '#16a34a', color: 'white', fontSize: '0.68rem', fontWeight: 700, flexShrink: 0 }}>
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList