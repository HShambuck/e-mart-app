import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            E-MART
          </Link>
        </div>
      </header>

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-neutral-900 mb-6">
          About E-MART
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-neutral-700 mb-6">
            E-MART is Ghana's premier digital marketplace connecting local rice farmers directly with buyers,
            eliminating intermediaries and ensuring fair prices for all parties.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
          <p className="text-neutral-700 mb-6">
            To empower local rice farmers by providing them with direct market access, secure payment systems,
            and tools to grow their businesses while ensuring buyers get fresh, quality rice at fair prices.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
              <p className="text-sm text-neutral-600">
                Create your account as a farmer or buyer in minutes
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-semibold text-lg mb-2">List or Browse</h3>
              <p className="text-sm text-neutral-600">
                Farmers list products, buyers browse and place orders
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-semibold text-lg mb-2">Secure Transaction</h3>
              <p className="text-sm text-neutral-600">
                Escrow-protected payments ensure safety for all
              </p>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
          <p className="text-neutral-700 mb-4">
            Have questions? We're here to help!
          </p>
          <Link to="/contact">
            <Button variant="primary">Get in Touch</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About