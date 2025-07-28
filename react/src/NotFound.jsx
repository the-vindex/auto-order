import { ShoppingCart, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="p-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl shadow-lg transform rotate-3">
              <ShoppingCart className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Looks like this page went out of stock! The page you're looking for
          doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6 py-3 text-lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} className="px-6 py-3 text-lg">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Need help? Check out our{' '}
            <button
              onClick={() => navigate('/landing')}
              className="text-blue-600 hover:text-blue-700 underline">
              landing page
            </button>{' '}
            or{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 underline">
              sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
