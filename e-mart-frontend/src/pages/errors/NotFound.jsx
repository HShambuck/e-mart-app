import { Link } from 'react-router-dom'
import { IoHome } from 'react-icons/io5'
import Button from '../../components/common/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl mb-4">😕</div>
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" leftIcon={<IoHome />}>
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound