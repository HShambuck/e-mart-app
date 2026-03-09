import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target
    
    let newValue
    if (type === 'checkbox') {
      newValue = checked
    } else if (type === 'file') {
      newValue = files[0]
    } else {
      newValue = value
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }, [errors])

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate on blur if validate function is provided
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }))
      }
    }
  }, [validate, values])

  // Set single value
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Set multiple values
  const setMultipleValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }))
  }, [])

  // Set single error
  const setError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  // Set multiple errors
  const setMultipleErrors = useCallback((newErrors) => {
    setErrors(newErrors)
  }, [])

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validate) return true

    const validationErrors = validate(values)
    setErrors(validationErrors)
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    return Object.keys(validationErrors).length === 0
  }, [validate, values])

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault()
    
    const isValid = validateForm()
    
    if (!isValid) return

    setIsSubmitting(true)
    
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, values])

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0

  // Check if form has been modified
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    setError,
    setMultipleErrors,
    validateForm,
    reset,
  }
}

export default useForm