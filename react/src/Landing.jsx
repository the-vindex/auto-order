import { Bell, TrendingDown, ShoppingCart, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center pt-16 pb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <ShoppingCart className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                Auto-Order
              </h1>
              <p className="text-2xl text-blue-600 font-medium">Timely Buyer</p>
            </div>
          </div>

          <p className="text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Never miss a deal again. Track your favorite products and get
            notified when prices drop below your target.
          </p>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 text-green-700 px-6 py-3 rounded-full border border-green-200 mb-12 hover:scale-105 transition-transform duration-200">
            <Zap className="h-5 w-5" />
            <span className="font-medium">
              Built in 72 hours • Hackathon Project
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate('/register')}
              className="px-8 py-3 text-lg">
              Get Started Free
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="px-8 py-3 text-lg">
              Sign In
            </Button>
          </div>
        </div>

        {/* Flowing Features Section */}
        <div className="relative py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, automated, effective
            </p>
          </div>

          {/* Horizontal flow */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            {/* Step 1 */}
            <div className="flex-1 text-center lg:text-left group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Paste Amazon URLs</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Simply paste any Amazon product URL and set your target price.
                Track multiple variations of the same product.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowRight className="h-8 w-8 text-gray-400 animate-pulse" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">We Monitor Prices</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our system continuously checks prices in the background. No need
                to manually refresh or remember to check.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:block">
              <ArrowRight
                className="h-8 w-8 text-gray-400 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Step 3 */}
            <div className="flex-1 text-center lg:text-right group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl font-bold text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Get Instant Alerts</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Receive email notifications the moment prices drop below your
                target. Never miss a deal again.
              </p>
            </div>
          </div>
        </div>

        {/* Features showcase */}
        <div className="py-20">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16">
              <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-default">
                <TrendingDown className="h-6 w-6" />
                <span className="text-lg font-medium">
                  Smart Price Tracking
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-200 cursor-default">
                <Bell className="h-6 w-6" />
                <span className="text-lg font-medium">Email Notifications</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 cursor-default">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-lg font-medium">Multi-URL Support</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-3xl font-bold mb-6">
                Ready to start saving?
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Join the smart shoppers who never overpay
              </p>
              <Button
                onClick={() => navigate('/register')}
                className="px-8 py-3 text-lg">
                Start Tracking Prices
              </Button>
            </div>
          </div>
        </div>

        <footer className="text-center py-16 text-gray-500">
          <p className="text-lg">© 2025 Auto-Order • Built in 72 hours</p>
        </footer>
      </div>
    </div>
  )
}

export default Landing
