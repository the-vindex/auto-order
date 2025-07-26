'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { loginUser } from './api/user'
import { useMutation } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.password.length < 1) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const mutation = useMutation({
    mutationFn: async e => {
      e.preventDefault()
      if (!validateForm()) {
        throw new Error()
      }
      localStorage.setItem('email', formData.email)
      return loginUser(formData.email, formData.password)
    },
    onError: error => {
      if (error?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists',
        }))
      } else if (error?.message === 'Validation failed') {
        return
      } else {
        console.error('Registration error:', error)
        setErrors(prev => ({
          ...prev,
          general: error?.message || 'Registration failed. Please try again.',
        }))
      }
    },
    onSuccess: data => {
      setErrors({})
      console.log('Registration successful:', data)
    },
  })

  const handleMagicLink = () => {
    console.log('Magic link requested')
    // Handle magic link logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={mutation.mutate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  required
                  className={errors.password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <div className="flex items-center space-x-2 mb-2 ">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="remember" className="my-2 text-sm font-normal">
                  Remember me
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            {mutation.isError && (
              <div className="text-red-500 text-center text-sm">
                {mutation.error?.message || 'Login failed'}
              </div>
            )}

            {mutation.isSuccess && (
              <div className="text-green-600 text-center text-sm">
                Login successful!
                <Navigate to="/" replace />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleMagicLink}>
              <Mail className="mr-2 h-4 w-4" />
              Continue with Magic Link
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="px-0 font-normal"
                onClick={onSwitchToRegister}>
                Sign up
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
