import ProtectedRoute from './ProtectedRoute'

const BuyerRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      {children}
    </ProtectedRoute>
  )
}

export default BuyerRoute