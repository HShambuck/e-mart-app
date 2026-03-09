import ProtectedRoute from './ProtectedRoute'

const FarmerRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      {children}
    </ProtectedRoute>
  )
}

export default FarmerRoute