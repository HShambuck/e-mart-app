import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { IoArrowBack, IoShieldCheckmark, IoCard, IoWallet } from 'react-icons/io5'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import orderService from '../../api/services/orderService'
import paymentService from '../../api/services/paymentService'
import { formatCurrency } from '../../utils/formatters'
import { PAYMENT_METHODS } from '../../utils/constants'
import toast from 'react-hot-toast'

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    accountNumber: '',
  })

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrder(orderId)
      setOrder(data.order)
    } catch (error) {
      toast.error('Failed to fetch order details')
      navigate('/buyer/orders')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method')
      return
    }

    if (
      selectedMethod.includes('momo') &&
      !paymentDetails.phoneNumber
    ) {
      toast.error('Please enter your phone number')
      return
    }

    try {
      setProcessing(true)

      const paymentData = {
        orderId: order._id,
        amount: order.totalAmount,
        method: selectedMethod,
        ...paymentDetails,
      }

      if (selectedMethod === 'paystack') {
        // Initialize Paystack payment
        const response = await paymentService.cardPayment(paymentData)
        window.location.href = response.authorizationUrl
      } else {
        // Mobile money payment
        const response = await paymentService.mobileMoney(paymentData)
        toast.success('Payment initiated! Please approve on your phone.')
        
        // Poll for payment status
        setTimeout(() => {
          navigate(`/buyer/orders/${orderId}`)
        }, 3000)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading payment details..." />
  }

  if (order.status !== 'payment_pending' && order.status !== 'accepted') {
    return (
      <div className="page-container max-w-2xl">
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Payment Already Completed
          </h2>
          <p className="text-neutral-600 mb-6">
            This order has already been paid for.
          </p>
          <Link to={`/buyer/orders/${orderId}`}>
            <Button variant="primary">View Order Details</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/buyer/orders/${orderId}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <IoArrowBack className="mr-2" />
          Back to Order
        </Link>
        <h1 className="section-header">Complete Payment</h1>
        <p className="text-neutral-600">
          Secure payment for Order #{order.orderNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Select Payment Method
            </h2>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setSelectedMethod(method.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === method.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {method.label}
                      </p>
                    </div>
                    {selectedMethod === method.value && (
                      <IoShieldCheckmark className="text-primary-600" size={24} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Details Form */}
            {selectedMethod && selectedMethod.includes('momo') && (
              <div className="mb-6">
                <Input
                  label="Mobile Money Number"
                  type="tel"
                  placeholder="e.g., 0XX XXX XXXX"
                  value={paymentDetails.phoneNumber}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                  leftIcon={<IoWallet />}
                  helperText="You will receive a prompt on this number to approve payment"
                  required
                />
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <IoShieldCheckmark className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="font-medium text-blue-900 mb-1">
                    Secure Payment with Escrow Protection
                  </p>
                  <p className="text-sm text-blue-700">
                    Your payment will be held securely until you confirm delivery.
                    The farmer will only receive payment after you confirm receipt of goods.
                  </p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePayment}
              loading={processing}
              disabled={!selectedMethod}
            >
              Pay {formatCurrency(order.totalAmount)}
            </Button>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-neutral-600">Product</p>
                <p className="font-medium text-neutral-900">
                  {order.product?.variety}
                </p>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Quantity</span>
                <span className="font-medium text-neutral-900">
                  {order.quantity} bags
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Price per bag</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(order.pricePerBag)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Bag size</span>
                <span className="font-medium text-neutral-900">
                  {order.product?.bagSize}kg
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-neutral-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </Card>

          {/* Farmer Info */}
          <Card className="mt-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-3">
              Selling Farmer
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {order.farmer?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">
                  {order.farmer?.name}
                </p>
                <p className="text-sm text-neutral-600">
                  {order.farmer?.location}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Payment