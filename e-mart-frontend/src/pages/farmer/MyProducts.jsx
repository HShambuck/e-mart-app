import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoAdd } from 'react-icons/io5'
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
      const data = await productService.getMyProducts()
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

    if (debouncedSearch) {
      filtered = filtered.filter((product) =>
        product.variety?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.location?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((product) => product.status === filterStatus)
    }

    setFilteredProducts(filtered)
  }

  const handleDelete = async () => {
    const idToDelete = deleteModal.productId
    setDeleteModal({ isOpen: false, productId: null })
    try {
      await productService.deleteProduct(idToDelete)
      setProducts(prev => prev.filter(p => p._id !== idToDelete))
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
    }
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
          <p className="text-neutral-600">Manage your rice product listings</p>
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: 'white', color: '#171717', cursor: 'pointer' }}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.85rem', color: '#a3a3a3', marginBottom: '20px' }}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌾</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>
            {searchQuery || filterStatus !== 'all' ? 'No products found' : 'No products yet'}
          </h3>
          <p style={{ color: '#737373', marginBottom: '20px', fontSize: '0.9rem' }}>
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first product listing'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Link to="/farmer/products/add">
              <Button variant="primary" leftIcon={<IoAdd />}>Add Your First Product</Button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={(id) => setDeleteModal({ isOpen: true, productId: id })}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        title="Delete Product"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, productId: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        <p style={{ color: '#525252' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default MyProducts