import { Clock, Bell, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Auto-Order</h1>
              <p className="text-gray-600">Timely Buyer</p>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Never forget to buy something again. Set reminders for products and
            get notified when prices drop.
          </p>
        </div>

        {/* Simple Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="text-center p-6">
            <Bell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Price Alerts</h3>
            <p className="text-gray-600">
              Get notified when your tracked products go on sale
            </p>
          </div>

          <div className="text-center p-6">
            <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Purchase Reminders</h3>
            <p className="text-gray-600">
              Set target dates to remind yourself to buy things
            </p>
          </div>
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <div className="space-y-3">
              <Button onClick={() => navigate('/register')} className="w-full">
                Sign Up
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full">
                Log In
              </Button>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 text-gray-500">
          <p>© 2025 Auto-Order</p>
        </footer>
      </div>
    </div>
  )
}

export default Landing
