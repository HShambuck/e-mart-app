import { useState, useEffect, useRef } from 'react'
import { IoSend, IoChatbubbleOutline, IoCall, IoEllipsisVertical } from 'react-icons/io5'
import Avatar from '../common/Avatar'
import MessageItem from './MessageItem'
import messageService from '../../api/services/messageService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const ConversationWindow = ({ conversation, onMessageSent }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (conversation?._id) {
      fetchMessages(conversation._id)
      inputRef.current?.focus()
    }
  }, [conversation?._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (userId) => {
    try {
      setLoading(true)
      const data = await messageService.getMessages(userId)
      setMessages(data.messages || [])
      await messageService.markAsRead(userId)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const text = newMessage.trim()
    if (!text || !conversation?._id || sending) return

    try {
      setSending(true)
      setNewMessage('')
      await messageService.sendMessage({ receiver: conversation._id, message: text })
      fetchMessages(conversation._id)
      if (onMessageSent) onMessageSent()
    } catch {
      toast.error('Failed to send message')
      setNewMessage(text) // restore on failure
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  if (!conversation) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', background: '#fafafa', color: '#a3a3a3' }}>
        <IoChatbubbleOutline size={52} color="#e5e5e5" />
        <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>Select a conversation</p>
        <p style={{ fontSize: '0.82rem', margin: 0, color: '#d4d4d4' }}>Choose someone to start messaging</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa', minWidth: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <Avatar src={conversation.avatar} name={conversation.name} size="md" online={conversation.isOnline} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#171717' }}>{conversation.name}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: conversation.isOnline ? '#16a34a' : '#a3a3a3', fontWeight: 500 }}>
            {conversation.isOnline ? '● Online' : 'Offline'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {conversation.phone && (
            <a href={`tel:${conversation.phone}`} style={{ textDecoration: 'none' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '9px', border: 'none', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}>
                <IoCall size={17} />
              </button>
            </a>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#a3a3a3', fontSize: '0.85rem' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '8px', color: '#a3a3a3' }}>
            <IoChatbubbleOutline size={40} color="#e5e5e5" />
            <p style={{ fontSize: '0.88rem', margin: 0 }}>No messages yet — say hello!</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageItem
                key={msg._id}
                message={msg}
                isOwn={msg.isSent || msg.sender === user?._id || msg.sender?._id === user?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0 }}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={newMessage}
          onChange={e => {
            setNewMessage(e.target.value)
            // Auto-resize
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          style={{
            flex: 1, padding: '10px 14px', border: '1.5px solid #e5e5e5',
            borderRadius: '20px', fontSize: '0.9rem', fontFamily: 'inherit',
            outline: 'none', resize: 'none', lineHeight: 1.5,
            background: '#fafafa', color: '#171717', maxHeight: '120px',
            overflowY: 'auto', transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.background = 'white' }}
          onBlur={e => { e.target.style.borderColor = '#e5e5e5'; e.target.style.background = '#fafafa' }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          style={{
            width: '42px', height: '42px', borderRadius: '50%', border: 'none', flexShrink: 0,
            background: (!newMessage.trim() || sending) ? '#e5e5e5' : 'linear-gradient(135deg, #16a34a, #15803d)',
            color: (!newMessage.trim() || sending) ? '#a3a3a3' : 'white',
            cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', boxShadow: (!newMessage.trim() || sending) ? 'none' : '0 2px 8px rgba(22,163,74,0.3)',
          }}
        >
          <IoSend size={17} />
        </button>
      </form>
    </div>
  )
}

export default ConversationWindow