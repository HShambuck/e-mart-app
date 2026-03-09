import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoAdd, IoSearch, IoFilter } from 'react-icons/io5'
import ProductCard from '../../components/farmer/ProductCard'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import productService from '../../api/services/productService'
import { useDebounce } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'

const MyProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null })

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [debouncedSearch, filterStatus, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getFarmerProducts()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by search query
    if (debouncedSearch) {
      filtered = filtered.filter((product) =>
        product.variety.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((product) => product.status === filterStatus)
    }

    setFilteredProducts(filtered)
  }

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteModal.productId)
      toast.success('Product deleted successfully')
      setProducts(products.filter((p) => p._id !== deleteModal.productId))
      setDeleteModal({ isOpen: false, productId: null })
    } catch (error) {
      toast.error('Failed to delete product')
      console.error(error)
    }
  }

  const openDeleteModal = (productId) => {
    setDeleteModal({ isOpen: true, productId })
  }

  if (loading) {
    return <Loader fullScreen text="Loading products..." />
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="section-header">My Products</h1>
          <p className="text-neutral-600">
            Manage your rice product listings
          </p>
        </div>
        <Link to="/farmer/products/add">
          <Button variant="primary" leftIcon={<IoAdd />} className="mt-4 sm:mt-0">
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search products..."
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first product listing'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Link to="/farmer/products/add">
              <Button variant="primary" leftIcon={<IoAdd />}>
                Add Your First Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={(id) => window.location.href = `/farmer/products/edit/${id}`}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        title="Delete Product"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, productId: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-neutral-700">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default MyProducts