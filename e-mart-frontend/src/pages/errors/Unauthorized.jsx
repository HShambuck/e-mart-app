import { Link, useNavigate } from 'react-router-dom'
import { IoShield, IoArrowBack } from 'react-icons/io5'
import Button from '../../components/common/Button'

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🚫</div>
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">
          Access Denied
        </h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          You don't have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            leftIcon={<IoArrowBack />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized