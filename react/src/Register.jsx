'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react'
import { createUser } from './api/user'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validateForm()) {
        throw new Error('')
      }
      return createUser(formData.username, formData.email, formData.password)
    },
    onError: error => {
      if (error?.status === 409) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists',
        }))
      } else if (error?.message === 'Validation failed') {
        return
      } else {
        console.error('Registration error:', error)
        setValidationErrors(prev => ({
          ...prev,
          general: error?.message || 'Registration failed. Please try again.',
        }))
      }
    },
    onSuccess: data => {
      setValidationErrors({})
      console.log('Registration successful:', data)
      navigate('/login')
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    mutation.mutate()
  }

  const navigateToLogin = () => {
    console.log('Returning to login screen.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={e => handleInputChange('username', e.target.value)}
                required
                className={validationErrors.username ? 'border-red-500' : ''}
              />
              {validationErrors.username && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.username}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  required
                  className={validationErrors.password ? 'border-red-500' : ''}
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
              {validationErrors.password && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.password}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={e =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  required
                  className={
                    validationErrors.confirmPassword ? 'border-red-500' : ''
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {validationErrors.confirmPassword && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {validationErrors.terms && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.terms}</span>
                </div>
              )}
              {validationErrors.general && (
                <div className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.general}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            {mutation.isError && (
              <div className="text-red-500 text-center text-sm">
                {mutation.error?.message || 'Registration failed'}
              </div>
            )}

            {mutation.isSuccess && (
              <div className="text-green-600 text-center text-sm">
                Account created successfully!
                {/* Navigate to login page after successful registration */}
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

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="px-0 font-normal"
                onClick={navigateToLogin}>
                Sign in
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
