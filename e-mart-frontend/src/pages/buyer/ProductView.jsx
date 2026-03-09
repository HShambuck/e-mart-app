import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import ProductDetails from '../../components/buyer/ProductDetails'
import Loader from '../../components/common/Loader'
import productService from '../../api/services/productService'
import toast from 'react-hot-toast'

const ProductView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProduct(id)
      setProduct(data.product)
    } catch (error) {
      toast.error('Failed to fetch product')
      navigate('/buyer/marketplace')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderPlaced = () => {
    navigate('/buyer/orders')
  }

  if (loading) {
    return <Loader fullScreen text="Loading product..." />
  }

  return (
    <div className="page-container max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/buyer/marketplace"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <IoArrowBack className="mr-2" />
          Back to Marketplace
        </Link>
      </div>

      {/* Product Details */}
      <ProductDetails product={product} onOrderPlaced={handleOrderPlaced} />

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Similar Products
        </h2>
        <p className="text-neutral-600">
          More products from this region coming soon...
        </p>
      </div>
    </div>
  )
}

export default ProductView