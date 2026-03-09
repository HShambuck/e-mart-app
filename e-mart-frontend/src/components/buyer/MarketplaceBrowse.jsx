import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoSearch, IoFilter, IoLocation, IoHeart, IoHeartOutline } from 'react-icons/io5'
import Card from '../common/Card'
import Badge from '../common/Badge'
import SearchBar from '../common/SearchBar'
import Loader from '../common/Loader'
import productService from '../../api/services/productService'
import buyerService from '../../api/services/buyerService'
import { useDebounce } from '../../hooks/useDebounce'
import { formatCurrency } from '../../utils/formatters'
import { RICE_VARIETIES, GHANA_REGIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const MarketplaceBrowse = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    variety: 'all',
    region: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchProducts()
    fetchFavorites()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [debouncedSearch, filters, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts({ status: 'available' })
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const data = await buyerService.getFavorites()
      setFavorites(data.favorites?.map(f => f._id) || [])
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(
        (product) =>
          product.variety.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.farmer?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Variety filter
    if (filters.variety !== 'all') {
      filtered = filtered.filter((product) => product.variety === filters.variety)
    }

    // Region filter
    if (filters.region !== 'all') {
      filtered = filtered.filter((product) => product.region === filters.region)
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter((product) => product.pricePerBag >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((product) => product.pricePerBag <= parseFloat(filters.maxPrice))
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.pricePerBag - b.pricePerBag)
        break
      case 'price_high':
        filtered.sort((a, b) => b.pricePerBag - a.pricePerBag)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    setFilters({
      variety: 'all',
      region: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    })
    setSearchQuery('')
  }

  const toggleFavorite = async (productId) => {
    try {
      if (favorites.includes(productId)) {
        await buyerService.removeFromFavorites(productId)
        setFavorites(favorites.filter(id => id !== productId))
        toast.success('Removed from favorites')
      } else {
        await buyerService.addToFavorites(productId)
        setFavorites([...favorites, productId])
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading products..." />
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search rice varieties, locations, farmers..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <IoFilter />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Rice Variety</label>
                <select
                  value={filters.variety}
                  onChange={(e) => handleFilterChange('variety', e.target.value)}
                  className="input"
                >
                  <option value="all">All Varieties</option>
                  {RICE_VARIETIES.map((variety) => (
                    <option key={variety.value} value={variety.value}>
                      {variety.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="input"
                >
                  <option value="all">All Regions</option>
                  {GHANA_REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Min Price (GHS)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Max Price (GHS)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={resetFilters} className="btn-ghost">
                Reset Filters
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Sort and Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="input w-auto"
        >
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No products found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button onClick={resetFilters} className="btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isFavorite={favorites.includes(product._id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  return (
    <Card hover className="relative overflow-hidden">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onToggleFavorite(product._id)
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      >
        {isFavorite ? (
          <IoHeart className="text-red-500" size={20} />
        ) : (
          <IoHeartOutline className="text-neutral-400" size={20} />
        )}
      </button>

      <Link to={`/buyer/marketplace/${product._id}`}>
        {/* Product Image */}
        <div className="h-48 bg-neutral-200 mb-4 rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.variety}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🌾</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-neutral-900">{product.variety}</h3>
            <Badge variant="success" size="sm">Available</Badge>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(product.pricePerBag)}
            </span>
            <span className="text-sm text-neutral-600">/{product.bagSize}kg</span>
          </div>

          <div className="space-y-1 text-sm text-neutral-600 mb-4">
            <p className="flex items-center gap-1">
              <IoLocation size={14} />
              {product.location}, {product.region}
            </p>
            <p>Available: <span className="font-medium text-neutral-900">{product.quantity} bags</span></p>
            <p>From: <span className="font-medium text-neutral-900">{product.farmer?.name}</span></p>
          </div>

          <button className="btn-primary w-full">
            View Details
          </button>
        </div>
      </Link>
    </Card>
  )
}

export default MarketplaceBrowse