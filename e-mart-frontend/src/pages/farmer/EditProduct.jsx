import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import ProductListingForm from '../../components/farmer/ProductListingForm'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import productService from '../../api/services/productService'
import toast from 'react-hot-toast'

const EditProduct = () => {
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
      navigate('/farmer/products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading product..." />
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/farmer/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <IoArrowBack className="mr-2" />
          Back to Products
        </Link>
        <h1 className="section-header">Edit Product</h1>
        <p className="text-neutral-600">
          Update your product listing details
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <ProductListingForm initialData={product} isEdit={true} />
      </Card>
    </div>
  )
}

export default EditProduct