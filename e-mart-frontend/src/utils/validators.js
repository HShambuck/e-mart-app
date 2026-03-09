// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Ghana phone number validation
export const isValidGhanaPhone = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone?.replace(/\D/g, '')
  
  // Check for valid Ghana phone number patterns
  // Starting with 0: 0XX XXX XXXX (10 digits)
  // Starting with 233: 233 XX XXX XXXX (12 digits)
  // Starting with +233: +233 XX XXX XXXX (12 digits without +)
  
  if (cleaned?.length === 10 && cleaned.startsWith('0')) {
    return /^0[235][0-9]{8}$/.test(cleaned)
  }
  
  if (cleaned?.length === 12 && cleaned.startsWith('233')) {
    return /^233[235][0-9]{8}$/.test(cleaned)
  }
  
  return false
}

// Password strength validation
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password),
  }
}

// Get password strength
export const getPasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// Min length validation
export const minLength = (value, min) => {
  return value?.length >= min
}

// Max length validation
export const maxLength = (value, max) => {
  return value?.length <= max
}

// Number range validation
export const isInRange = (value, min, max) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

// Positive number validation
export const isPositiveNumber = (value) => {
  const num = parseFloat(value)
  return !isNaN(num) && num > 0
}

// OTP validation (6 digits)
export const isValidOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Image file validation
export const isValidImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return {
    isValid: allowedTypes.includes(file.type) && file.size <= maxSize,
    errors: {
      type: !allowedTypes.includes(file.type) ? 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' : null,
      size: file.size > maxSize ? 'File size must be less than 5MB' : null,
    },
  }
}

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {}
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field]
    
    for (const rule of fieldRules) {
      const error = rule(value, values)
      if (error) {
        errors[field] = error
        break
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Common validation rules
export const validationRules = {
  required: (fieldName) => (value) => {
    if (!isRequired(value)) {
      return `${fieldName} is required`
    }
    return null
  },
  
  email: () => (value) => {
    if (value && !isValidEmail(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },
  
  phone: () => (value) => {
    if (value && !isValidGhanaPhone(value)) {
      return 'Please enter a valid Ghana phone number'
    }
    return null
  },
  
  minLength: (min, fieldName) => (value) => {
    if (value && !minLength(value, min)) {
      return `${fieldName} must be at least ${min} characters`
    }
    return null
  },
  
  maxLength: (max, fieldName) => (value) => {
    if (value && !maxLength(value, max)) {
      return `${fieldName} must be less than ${max} characters`
    }
    return null
  },
  
  password: () => (value) => {
    const result = validatePassword(value)
    if (!result.isValid) {
      return result.errors[0]
    }
    return null
  },
  
  confirmPassword: (passwordField) => (value, values) => {
    if (value !== values[passwordField]) {
      return 'Passwords do not match'
    }
    return null
  },
  
  positiveNumber: (fieldName) => (value) => {
    if (value && !isPositiveNumber(value)) {
      return `${fieldName} must be a positive number`
    }
    return null
  },
}