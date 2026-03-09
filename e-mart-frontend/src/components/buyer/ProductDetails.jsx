import { useState } from 'react'
import { IoLocation, IoCalendar, IoPerson, IoCall, IoHeart, IoHeartOutline } from 'react-icons/io5'
import Button from '../common/Button'
import Badge from '../common/Badge'
import Avatar from '../common/Avatar'
import Input from '../common/Input'
import Modal from '../common/Modal'
import { formatCurrency, formatDate } from '../../utils/formatters'
import buyerService from '../../api/services/buyerService'
import orderService from '../../api/services/orderService'
import toast from 'react-hot-toast'

const ProductDetails = ({ product, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false)
  const [orderModal, setOrderModal] = useState(false)
  const [orderDetails, setOrderDetails] = useState({
    pickupLocation: '',
    pickupDate: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const totalAmount = quantity * product.pricePerBag

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await buyerService.removeFromFavorites(product._id)
        toast.success('Removed from favorites')
      } else {
        await buyerService.addToFavorites(product._id)
        toast.success('Added to favorites')
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  const handlePlaceOrder = async () => {
    if (!orderDetails.pickupLocation) {
      toast.error('Please provide pickup location')
      return
    }

    try {
      setLoading(true)
      await orderService.createOrder({
        product: product._id,
        quantity,
        pricePerBag: product.pricePerBag,
        totalAmount,
        ...orderDetails,
      })
      toast.success('Order placed successfully!')
      setOrderModal(false)
      if (onOrderPlaced) onOrderPlaced()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Product Images */}
      <div className="mb-6">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.variety}
            className="w-full h-96 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-96 bg-neutral-200 rounded-xl flex items-center justify-center">
            <span className="text-9xl">🌾</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-neutral-900">
                {product.variety}
              </h1>
              <Badge variant={product.status === 'available' ? 'success' : 'default'}>
                {product.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-neutral-600">
              <span className="flex items-center gap-1">
                <IoLocation size={16} />
                {product.location}, {product.region}
              </span>
              {product.harvestDate && (
                <span className="flex items-center gap-1">
                  <IoCalendar size={16} />
                  Harvested {formatDate(product.harvestDate)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className="p-3 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {isFavorite ? (
              <IoHeart className="text-red-500" size={28} />
            ) : (
              <IoHeartOutline className="text-neutral-400" size={28} />
            )}
          </button>
        </div>

        {/* Price */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-600">
              {formatCurrency(product.pricePerBag)}
            </span>
            <span className="text-lg text-neutral-600">
              per {product.bagSize}kg bag
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-2">
            Available: <span className="font-semibold text-neutral-900">{product.quantity} bags</span>
          </p>
        </div>

        {/* Quality Description */}
        {product.qualityDescription && (
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-2">About this rice</h3>
            <p className="text-neutral-700">{product.qualityDescription}</p>
          </div>
        )}

        {/* Farmer Info */}
        <div className="border-t border-neutral-200 pt-6 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Sold by</h3>
          <div className="flex items-center gap-4">
            <Avatar
              src={product.farmer?.avatar}
              name={product.farmer?.name}
              size="lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-neutral-900">{product.farmer?.name}</p>
                {product.farmer?.isVerified && (
                  <Badge variant="success" size="sm">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-neutral-600">{product.farmer?.location}</p>
            </div>
            <a href={`tel:${product.farmer?.phone}`}>
              <Button variant="outline" size="sm">
                <IoCall className="mr-2" />
                Call
              </Button>
            </a>
          </div>
        </div>

        {/* Order Section */}
        <div className="bg-neutral-50 rounded-xl p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Place Order</h3>
          
          <div className="mb-4">
            <label className="label">Quantity (bags)</label>
            <Input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
            />
          </div>

          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg">
            <span className="text-neutral-700">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setOrderModal(true)}
            disabled={product.status !== 'available' || product.quantity === 0}
          >
            Place Order
          </Button>
        </div>
      </div>

      {/* Order Modal */}
      <Modal
        isOpen={orderModal}
        onClose={() => setOrderModal(false)}
        title="Order Details"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-neutral-600">Product</span>
              <span className="font-medium text-neutral-900">{product.variety}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-600">Quantity</span>
              <span className="font-medium text-neutral-900">{quantity} bags</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-600">Price per bag</span>
              <span className="font-medium text-neutral-900">{formatCurrency(product.pricePerBag)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-200">
              <span className="font-semibold text-neutral-900">Total</span>
              <span className="font-bold text-primary-600 text-xl">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <Input
            label="Pickup Location"
            type="text"
            placeholder="Where should the farmer deliver?"
            value={orderDetails.pickupLocation}
            onChange={(e) => setOrderDetails({ ...orderDetails, pickupLocation: e.target.value })}
            leftIcon={<IoLocation />}
            required
          />

          <Input
            label="Preferred Pickup Date (Optional)"
            type="date"
            value={orderDetails.pickupDate}
            onChange={(e) => setOrderDetails({ ...orderDetails, pickupDate: e.target.value })}
            leftIcon={<IoCalendar />}
            min={new Date().toISOString().split('T')[0]}
          />

          <div>
            <label className="label">Additional Notes (Optional)</label>
            <textarea
              value={orderDetails.notes}
              onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
              placeholder="Any special instructions for the farmer?"
              rows="3"
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setOrderModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handlePlaceOrder}
              loading={loading}
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetails