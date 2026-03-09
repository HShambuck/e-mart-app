import { useState, useEffect } from 'react'

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })
      setLoading(false)
      setError(null)
    }

    const handleError = (error) => {
      let errorMessage
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
        default:
          errorMessage = 'An unknown error occurred'
      }
      setError(errorMessage)
      setLoading(false)
    }

    const geoOptions = {
      enableHighAccuracy: options.enableHighAccuracy || false,
      timeout: options.timeout || 10000,
      maximumAge: options.maximumAge || 0,
    }

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptions
    )
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge])

  // Function to manually request location
  const requestLocation = () => {
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      }
    )
  }

  return { location, error, loading, requestLocation }
}

export default useGeolocation;