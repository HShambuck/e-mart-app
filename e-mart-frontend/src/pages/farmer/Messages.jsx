import { useState, useEffect } from 'react'
import { IoSearch, IoSend } from 'react-icons/io5'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import messageService from '../../api/services/messageService'
import { formatRelativeTime } from '../../utils/formatters'
import toast from 'react-hot-toast'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const data = await messageService.getConversations()
      setConversations(data.conversations || [])
      if (data.conversations?.length > 0) {
        setSelectedConversation(data.conversations[0])
      }
    } catch (error) {
      toast.error('Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const data = await messageService.getMessages(userId)
      setMessages(data.messages || [])
      await messageService.markAsRead(userId)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setSending(true)
      await messageService.sendMessage({
        receiver: selectedConversation._id,
        message: newMessage,
      })
      setNewMessage('')
      fetchMessages(selectedConversation._id)
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading messages..." />
  }

  if (conversations.length === 0) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No messages yet
          </h3>
          <p className="text-neutral-600">
            Messages with buyers will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-7xl">
      <div className="mb-6">
        <h1 className="section-header">Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="overflow-hidden flex flex-col" padding={false}>
          {/* Search */}
          <div className="p-4 border-b border-neutral-200">
            <Input
              type="text"
              placeholder="Search conversations..."
              leftIcon={<IoSearch />}
            />
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-center gap-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? 'bg-primary-50'
                    : ''
                }`}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  size="md"
                  online={conversation.isOnline}
                />
                <div className="flex-1 text-left">
                  <p className="font-medium text-neutral-900">
                    {conversation.name}
                  </p>
                  <p className="text-sm text-neutral-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs">
                    {conversation.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col" padding={false}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                <Avatar
                  src={selectedConversation.avatar}
                  name={selectedConversation.name}
                  size="md"
                  online={selectedConversation.isOnline}
                />
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">
                    {selectedConversation.name}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {selectedConversation.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.isSent ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isSent
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isSent ? 'text-primary-100' : 'text-neutral-500'
                        }`}
                      >
                        {formatRelativeTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-neutral-200 flex gap-3"
              >
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!newMessage.trim() || sending}
                  loading={sending}
                >
                  <IoSend size={20} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Messages