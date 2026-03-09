import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

// Layouts
import Navigation from '@components/layout/Navigation'

// Public Pages
import Home from '@pages/Home'
import About from '@pages/About'
import Contact from '@pages/Contact'

// Auth Pages
import Login from '@pages/auth/Login'
import Signup from '@pages/auth/Signup'
import VerifyOTP from '@pages/auth/VerifyOTP'

// Protected Route Components (Keeping relative as they are in the same folder)
import ProtectedRoute from './ProtectedRoute'
import FarmerRoute from './FarmerRoute'
import BuyerRoute from './BuyerRoute'
import AdminRoute from './AdminRoute'

// Farmer Pages
import FarmerDashboard from '@pages/farmer/Dashboard'
import MyProducts from '@pages/farmer/MyProducts'
import AddProduct from '@pages/farmer/AddProduct'
import EditProduct from '@pages/farmer/EditProduct'
import FarmerOrders from '@pages/farmer/Orders'
import FarmerOrderDetails from '@pages/farmer/OrderDetails'
import Sales from '@pages/farmer/Sales'
import FarmerProfile from '@pages/farmer/Profile'
import FarmerMessages from '@pages/farmer/Messages'

// Buyer Pages
import BuyerDashboard from '@pages/buyer/Dashboard'
import Marketplace from '@pages/buyer/Marketplace'
import ProductView from '@pages/buyer/ProductView'
import BuyerOrders from '@pages/buyer/MyOrders'
import BuyerOrderDetails from '@pages/buyer/OrderDetails'
import Payment from '@pages/buyer/Payment'
import BuyerProfile from '@pages/buyer/Profile'
import BuyerMessages from '@pages/buyer/Messages'

// Admin Pages
import AdminDashboard from '@pages/admin/Dashboard'
import Users from '@pages/admin/Users'
import Verifications from '@pages/admin/Verifications'
import Listings from '@pages/admin/Listings'
import Transactions from '@pages/admin/Transactions'
import Disputes from '@pages/admin/Disputes'
import Reports from '@pages/admin/Reports'

// Error Pages
import NotFound from '@pages/errors/NotFound'
import Unauthorized from '@pages/errors/Unauthorized'

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Signup />} 
      />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Farmer Routes */}
      <Route path="/farmer" element={<FarmerRoute><Navigation /></FarmerRoute>}>
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="orders/:id" element={<FarmerOrderDetails />} />
        <Route path="sales" element={<Sales />} />
        <Route path="messages" element={<FarmerMessages />} />
        <Route path="profile" element={<FarmerProfile />} />
      </Route>

      {/* Buyer Routes */}
      <Route path="/buyer" element={<BuyerRoute><Navigation /></BuyerRoute>}>
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<ProductView />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="orders/:id" element={<BuyerOrderDetails />} />
        <Route path="payment/:orderId" element={<Payment />} />
        <Route path="messages" element={<BuyerMessages />} />
        <Route path="profile" element={<BuyerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><Navigation /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="verifications" element={<Verifications />} />
        <Route path="listings" element={<Listings />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
