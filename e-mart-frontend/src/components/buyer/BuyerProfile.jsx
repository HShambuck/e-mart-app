import { useState } from 'react'
import { IoPerson, IoCall, IoMail, IoLocation, IoShield, IoBusiness } from 'react-icons/io5'
import Input from '../common/Input'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Card from '../common/Card'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { GHANA_REGIONS } from '../../utils/constants'

const BuyerProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      businessName: user?.buyerProfile?.businessName || '',
      location: user?.buyerProfile?.location || '',
      region: user?.buyerProfile?.region || '',
    }
  )

  const onSubmit = async (formValues) => {
    await updateProfile(formValues)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar src={user?.avatar} name={user?.name} size="2xl" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <h2 className="text-2xl font-bold text-neutral-900">{user?.name}</h2>
              {user?.isVerified && (
                <Badge variant="success">
                  <IoShield className="mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-neutral-600">{user?.email || user?.phone}</p>
            <p className="text-sm text-neutral-500 mt-1">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Profile Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              leftIcon={<IoPerson />}
              disabled={!isEditing}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
              leftIcon={<IoCall />}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              leftIcon={<IoMail />}
              disabled={!isEditing}
            />

            <Input
              label="Business Name (Optional)"
              type="text"
              name="businessName"
              value={values.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              leftIcon={<IoBusiness />}
              disabled={!isEditing}
            />

            <Input
              label="Location"
              type="text"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              leftIcon={<IoLocation />}
              disabled={!isEditing}
            />

            <div>
              <label className="label">Region</label>
              <select
                name="region"
                value={values.region}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                disabled={!isEditing}
              >
                <option value="">Select region</option>
                {GHANA_REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-neutral-900">
            {user?.stats?.totalOrders || 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600 mb-1">Completed Orders</p>
          <p className="text-3xl font-bold text-neutral-900">
            {user?.stats?.completedOrders || 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-600 mb-1">Favorites</p>
          <p className="text-3xl font-bold text-neutral-900">
            {user?.stats?.favoriteProducts || 0}
          </p>
        </Card>
      </div>
    </div>
  )
}

export default BuyerProfile