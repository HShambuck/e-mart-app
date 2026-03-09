// App Constants
export const APP_NAME = 'E-MART'
export const APP_TAGLINE = 'Connecting Farmers to Markets'

// User Roles
export const ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  READY_FOR_COLLECTION: 'ready_for_collection',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  HELD: 'held',
  RELEASED: 'released',
  REFUNDED: 'refunded',
  FAILED: 'failed',
}

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
}

// Product Status
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  OUT_OF_STOCK: 'out_of_stock',
}

// Rice Varieties
export const RICE_VARIETIES = [
  { value: 'jasmine', label: 'Jasmine Rice' },
  { value: 'long_grain', label: 'Long Grain Rice' },
  { value: 'basmati', label: 'Basmati Rice' },
  { value: 'local_variety', label: 'Local Variety' },
  { value: 'brown_rice', label: 'Brown Rice' },
  { value: 'parboiled', label: 'Parboiled Rice' },
  { value: 'other', label: 'Other' },
]

// Bag Sizes
export const BAG_SIZES = [
  { value: '5', label: '5 kg' },
  { value: '10', label: '10 kg' },
  { value: '25', label: '25 kg' },
  { value: '50', label: '50 kg' },
  { value: 'custom', label: 'Custom' },
]

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'mtn_momo', label: 'MTN Mobile Money', icon: '📱' },
  { value: 'vodafone_cash', label: 'Vodafone Cash', icon: '📱' },
  { value: 'airteltigo_money', label: 'AirtelTigo Money', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'paystack', label: 'Card Payment (Paystack)', icon: '💳' },
]

// Ghana Regions
export const GHANA_REGIONS = [
  { value: 'greater_accra', label: 'Greater Accra' },
  { value: 'ashanti', label: 'Ashanti' },
  { value: 'western', label: 'Western' },
  { value: 'central', label: 'Central' },
  { value: 'eastern', label: 'Eastern' },
  { value: 'volta', label: 'Volta' },
  { value: 'northern', label: 'Northern' },
  { value: 'upper_east', label: 'Upper East' },
  { value: 'upper_west', label: 'Upper West' },
  { value: 'brong_ahafo', label: 'Bono' },
  { value: 'western_north', label: 'Western North' },
  { value: 'ahafo', label: 'Ahafo' },
  { value: 'bono_east', label: 'Bono East' },
  { value: 'oti', label: 'Oti' },
  { value: 'north_east', label: 'North East' },
  { value: 'savannah', label: 'Savannah' },
]

// Status Colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  payment_confirmed: 'bg-green-100 text-green-800',
  ready_for_collection: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-red-100 text-red-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  available: 'bg-green-100 text-green-800',
  sold: 'bg-gray-100 text-gray-800',
  out_of_stock: 'bg-red-100 text-red-800',
}

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  MESSAGE: 'message',
  VERIFICATION: 'verification',
  SYSTEM: 'system',
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']