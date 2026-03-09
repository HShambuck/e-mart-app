const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    ME: '/auth/me',
  },

  FARMER: {
    DASHBOARD: '/farmer/dashboard',
    PROFILE: '/farmer/profile',
    ORDERS: '/farmer/orders',
    ORDER: (id) => `/farmer/orders/${id}`,
    ORDER_STATUS: (id) => `/farmer/orders/${id}/status`,
    SALES: '/farmer/sales',
  },

  BUYER: {
    DASHBOARD: '/buyer/dashboard',
    PROFILE: '/buyer/profile',
  },

  PRODUCTS: {
    BASE: '/products',
    MY: '/products/my',
    BY_ID: (id) => `/products/${id}`,
    IMAGES: (id) => `/products/${id}/images`,
  },

  ORDERS: {
    BASE: '/orders',
    MY: '/orders/my',
    BY_ID: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    REVIEW: (id) => `/orders/${id}/review`,
  },

  PAYMENTS: {
    INITIALIZE: '/payments/initialize',
    VERIFY: '/payments/verify',
    HISTORY: '/payments/history',
    BY_ORDER: (orderId) => `/payments/order/${orderId}`,
  },

  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id) => `/transactions/${id}`,
  },

  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    BY_USER: (userId) => `/messages/${userId}`,
    SEND: '/messages',
    MARK_READ: (userId) => `/messages/${userId}/read`,
    UNREAD_COUNT: '/messages/unread/count',
  },

  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER: (id) => `/admin/users/${id}`,
    TOGGLE_USER: (id) => `/admin/users/${id}/toggle-active`,
    PRODUCTS: '/admin/products',
    FEATURE_PRODUCT: (id) => `/admin/products/${id}/feature`,
    ORDERS: '/admin/orders',
    TRANSACTIONS: '/admin/transactions',
    VERIFICATIONS: '/admin/verifications',
    REVIEW_VERIFICATION: (id) => `/admin/verifications/${id}`,
    DISPUTES: '/admin/disputes',
    RESOLVE_DISPUTE: (id) => `/admin/disputes/${id}/resolve`,
    BROADCAST: '/admin/broadcast',
  },
}

export default ENDPOINTS