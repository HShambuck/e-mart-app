import { formatRelativeTime } from '../../utils/formatters'

const MessageItem = ({ message, isOwn }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '8px',
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isOwn ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'white',
        color: isOwn ? 'white' : '#171717',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: isOwn ? 'none' : '1px solid #f0f0f0',
      }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
          {message.message || message.content}
        </p>
        <p style={{
          margin: 0, fontSize: '0.7rem', textAlign: 'right',
          opacity: isOwn ? 0.7 : 0.5,
          color: isOwn ? 'white' : '#737373',
        }}>
          {formatRelativeTime(message.createdAt)}
          {isOwn && message.isRead && (
            <span style={{ marginLeft: '4px' }}>✓✓</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default MessageItem