import { ShoppingCart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigate } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Auto Order
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
            Streamline your orders with our intelligent automated ordering
            system.
          </p>
        </header>

        <div className="flex flex-row gap-10 justify-center mb-16">
          <div className="flex flex-col items-center text">
            <div className="bg-blue-100 p-4 rounded-full mb-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              Smart Ordering
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-3">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              Automation
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center ">
          <div className="bg-white rounded-2xl shadow-xl p-8  max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Get Started Today
            </h2>
            <Button type="submit" className="w-30 ">
              Register
            </Button>
            <Button type="submit" className="w-30">
              Login
            </Button>
          </div>
        </div>

        <footer className="text-center mt-16 text-slate-500">
          <p>&copy; 2025 Auto Order </p>
        </footer>
      </div>
    </div>
  )
}

export default Landing
