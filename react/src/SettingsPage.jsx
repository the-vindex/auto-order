import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, Settings } from 'lucide-react'
import { getCookie } from './lib/utils'
import { logoutUser } from './api/user'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const navigate = useNavigate()
  const email = getCookie('email')

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{email}</h3>
                <p className="text-sm text-gray-500">Account holder</p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Timely-Buy</h4>
                <p className="text-sm text-gray-500">Boot.dev Hackathon 2025</p>
              </div>
              <div>
                <h4 className="font-medium">What's this?</h4>
                <p className="text-sm text-gray-500">
                  A simple app to track product reminders and price alerts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
