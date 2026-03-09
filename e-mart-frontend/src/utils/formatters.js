import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

// Format date
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return format(parsedDate, formatString)
}

// Format date with time
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

// Format time only
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm')
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return formatDistanceToNow(parsedDate, { addSuffix: true })
}

// Format currency
export const formatCurrency = (amount, currency = 'GHS') => {
  if (amount === null || amount === undefined) return ''
  
  const currencySymbols = {
    GHS: '₵',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }
  
  const symbol = currencySymbols[currency] || currency
  const formattedAmount = parseFloat(amount).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return `${symbol}${formattedAmount}`
}

// Format phone number for display
export const formatPhoneDisplay = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format based on length
  if (cleaned.length === 10) {
    // 0XX XXX XXXX
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('233')) {
    // +233 XX XXX XXXX
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  
  return phone
}

// Format phone for API (convert to +233 format)
export const formatPhoneAPI = (phone) => {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `+233${cleaned.slice(1)}`
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('233')) {
    return `+${cleaned}`
  }
  
  return phone
}

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return ''
  return `${parseFloat(value).toFixed(decimals)}%`
}

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return ''
  return parseFloat(num).toLocaleString('en-GH')
}

// Format order status for display
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    accepted: 'Accepted',
    payment_pending: 'Awaiting Payment',
    payment_confirmed: 'Payment Confirmed',
    ready_for_collection: 'Ready for Collection',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  }
  return statusMap[status] || status
}

// Format payment status for display
export const formatPaymentStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    held: 'Held in Escrow',
    released: 'Released',
    refunded: 'Refunded',
    failed: 'Failed',
  }
  return statusMap[status] || status
}

// Format user role for display
export const formatRole = (role) => {
  const roleMap = {
    farmer: 'Farmer',
    buyer: 'Buyer',
    admin: 'Administrator',
  }
  return roleMap[role] || role
}

// Format bag size
export const formatBagSize = (size) => {
  if (size === 'custom') return 'Custom'
  return `${size} kg`
}

// Format quantity with unit
export const formatQuantity = (quantity, unit = 'bags') => {
  if (!quantity) return ''
  return `${quantity} ${unit}${quantity > 1 ? 's' : ''}`
}

// Truncate text with ellipsis
export const truncate = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

// Format name (capitalize each word)
export const formatName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format address
export const formatAddress = (address) => {
  if (!address) return ''
  const { area, region, town } = address
  const parts = [area, town, region].filter(Boolean)
  return parts.join(', ')
}