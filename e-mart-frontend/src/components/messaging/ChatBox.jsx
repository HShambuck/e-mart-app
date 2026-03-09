import { useState, useEffect, useRef } from 'react'
import { IoSearch, IoSend, IoChatbubbleOutline, IoPersonOutline } from 'react-icons/io5'
import Avatar from '../common/Avatar'
import Loader from '../common/Loader'
import messageService from '../../api/services/messageService'
import { useAuth } from '../../hooks/useAuth'
import { formatRelativeTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => { fetchConversations() }, [])
  useEffect(() => { if (selected) fetchMessages(selected._id) }, [selected])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const data = await messageService.getConversations()
      const convs = data.conversations || []
      setConversations(convs)
      if (convs.length > 0) setSelected(convs[0])
    } catch {
      toast.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const data = await messageService.getMessages(userId)
      setMessages(data.messages || [])
      await messageService.markAsRead(userId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selected) return
    try {
      setSending(true)
      await messageService.sendMessage({ receiver: selected._id, message: newMessage })
      setNewMessage('')
      fetchMessages(selected._id)
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const filteredConvs = conversations.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  const sidebarStyle = { width: '300px', flexShrink: 0, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', background: 'white' }
  const chatAreaStyle = { flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa', minWidth: 0 }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px' }}><Loader size="md" text="Loading messages..." /></div>

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)', background: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>

      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Search */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 900, color: '#171717', margin: '0 0 12px', letterSpacing: '-0.01em' }}>Messages</p>
          <div style={{ position: 'relative' }}>
            <IoSearch size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', background: '#fafafa', boxSizing: 'border-box', color: '#171717' }}
              onFocus={e => e.target.style.borderColor = '#16a34a'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvs.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <IoChatbubbleOutline size={32} color="#d4d4d4" style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontSize: '0.85rem', color: '#a3a3a3', margin: 0 }}>No conversations yet</p>
            </div>
          ) : filteredConvs.map(conv => {
            const isActive = selected?._id === conv._id
            return (
              <button key={conv._id} onClick={() => setSelected(conv)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: 'none', background: isActive ? '#f0fdf4' : 'white', cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid #fafafa', borderLeft: isActive ? '3px solid #16a34a' : '3px solid transparent', transition: 'background 0.15s', textAlign: 'left' }}>
                <Avatar src={conv.avatar} name={conv.name} size="md" online={conv.isOnline} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#171717' }}>{conv.name}</p>
                    {conv.unreadCount > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#16a34a', color: 'white', fontSize: '0.68rem', fontWeight: 700, flexShrink: 0 }}>{conv.unreadCount}</span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMessage || 'No messages yet'}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={chatAreaStyle}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar src={selected.avatar} name={selected.name} size="md" online={selected.isOnline} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#171717' }}>{selected.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: selected.isOnline ? '#16a34a' : '#a3a3a3' }}>{selected.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#a3a3a3' }}>
                  <IoChatbubbleOutline size={36} />
                  <p style={{ fontSize: '0.88rem', margin: 0 }}>Start the conversation</p>
                </div>
              ) : messages.map(msg => {
                const isMine = msg.isSent || msg.sender === user?._id
                return (
                  <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMine ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'white',
                      color: isMine ? 'white' : '#171717',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.message}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.65, textAlign: 'right' }}>{formatRelativeTime(msg.createdAt)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #e5e5e5', borderRadius: '24px', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', background: '#fafafa', color: '#171717' }}
                onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.background = 'white' }}
                onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.background = '#fafafa' }}
              />
              <button type="submit" disabled={!newMessage.trim() || sending}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: (!newMessage.trim() || sending) ? '#e5e5e5' : 'linear-gradient(135deg, #16a34a, #15803d)', color: (!newMessage.trim() || sending) ? '#a3a3a3' : 'white', cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                <IoSend size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', color: '#a3a3a3' }}>
            <IoChatbubbleOutline size={48} />
            <p style={{ fontSize: '0.95rem', margin: 0 }}>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBox