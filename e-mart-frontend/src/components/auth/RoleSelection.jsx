import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Card from '../common/Card'

const RoleSelection = ({ onSelect }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const navigate = useNavigate()

  const roles = [
    {
      value: 'farmer',
      title: 'Farmer / Producer',
      icon: '🌾',
      description: 'I produce rice and want to sell directly to buyers',
      features: [
        'Create product listings',
        'Manage orders',
        'Track sales & earnings',
        'Direct buyer communication',
      ],
    },
    {
      value: 'buyer',
      title: 'Buyer / Retailer',
      icon: '🛒',
      description: 'I want to buy rice directly from farmers',
      features: [
        'Browse local rice products',
        'Place orders',
        'Secure payments',
        'Direct farmer communication',
      ],
    },
  ]

  const handleContinue = () => {
    if (selectedRole) {
      if (onSelect) {
        onSelect(selectedRole)
      } else {
        navigate('/signup', { state: { role: selectedRole } })
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-3">
          Welcome to E-MART
        </h1>
        <p className="text-lg text-neutral-600">
          Choose your role to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {roles.map((role) => (
          <Card
            key={role.value}
            className={`cursor-pointer transition-all ${
              selectedRole === role.value
                ? 'ring-2 ring-primary-600 bg-primary-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedRole(role.value)}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{role.icon}</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {role.title}
              </h3>
              <p className="text-neutral-600">{role.description}</p>
            </div>

            <ul className="space-y-2">
              {role.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-sm text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
      </Button>

      <p className="text-center text-sm text-neutral-600 mt-4">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default RoleSelection