import toast from 'react-hot-toast'

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    })
  },
  
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    })
  },
  
  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
    })
  },
  
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      {
        position: 'top-right',
      }
    )
  },
  
  custom: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  },
  
  dismiss: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },
}

export default showToast