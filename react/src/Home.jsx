import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, Search, X } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { ReminderCard } from '@/components/reminder-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProductReminder, getProductReminders } from './api/product'

const Home = () => {
  const queryClient = useQueryClient()

  const {
    data: remindersData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['productReminders'],
    queryFn: getProductReminders,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  })

  const displayData =
    remindersData.length > 0
      ? remindersData
      : [
          {
            productId: 'dummy-1',
            name: 'iPhone 15 Pro',
            urls: [
              'https://www.amazon.com/iphone15',
              'https://www.bestbuy.com/iphone15',
            ],
            status: 'active',
            reminderDetails: {
              type: 'priceDrop',
              initialPrice: {
                amount: 999.99,
                currency: 'USD',
              },
              targetPrice: {
                amount: 899.99,
                currency: 'USD',
              },
            },
          },
        ]

  // React Query mutation for creating product reminders
  const createReminderMutation = useMutation({
    mutationFn: async productReminderData => {
      return createProductReminder(productReminderData)
    },
    onSuccess: data => {
      console.log('Reminder created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['productReminders'] })

      setFormData({
        name: '',
        urls: [],
        reminderType: 'priceDrop',
        initialPrice: 100,
        targetPrice: 80,
        currency: 'USD',
        targetDate: '',
      })
      setUrlInput('')
      setIsPopoverOpen(false)
    },
    onError: error => {
      console.error('Failed to create reminder:', error)
    },
  })

  const [formData, setFormData] = useState({
    name: '',
    urls: [],
    reminderType: 'priceDrop',
    initialPrice: 100,
    targetPrice: 80,
    currency: 'USD',
    targetDate: '',
  })
  const [urlInput, setUrlInput] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleAddItem = () => {
    const newReminderData = {
      name: formData.name,
      urls: formData.urls,
      reminderDetails:
        formData.reminderType === 'priceDrop'
          ? {
              type: 'priceDrop',
              initialPrice: {
                amount: parseFloat(formData.initialPrice),
                currency: formData.currency,
              },
              targetPrice: {
                amount: parseFloat(formData.targetPrice),
                currency: formData.currency,
              },
            }
          : {
              type: 'targetDate',
              targetDate: formData.targetDate,
            },
    }

    createReminderMutation.mutate(newReminderData)
  }

  const addUrl = () => {
    if (urlInput.trim() && !formData.urls.includes(urlInput.trim())) {
      setFormData(prev => ({
        ...prev,
        urls: [...prev.urls, urlInput.trim()],
      }))
      setUrlInput('')
    }
  }

  const removeUrl = urlToRemove => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter(url => url !== urlToRemove),
    }))
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addUrl()
    }
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filteredReminders = displayData.filter(reminder =>
    reminder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reminders...</p>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  const showErrorIndicator = error && remindersData.length === 0

  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="border-b bg-white px-6 py-4">
                {showErrorIndicator && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">
                      Failed to load reminders from server. Showing demo data.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      My Reminders
                    </h1>

                    <p className="text-sm text-gray-500">
                      {displayData.length} reminders tracking
                    </p>
                  </div>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            New Reminder
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Create a new product reminder
                          </p>
                        </div>

                        <div className="grid gap-4">
                          {/* Name Input */}
                          <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              placeholder="Enter product name"
                              value={formData.name}
                              onChange={e =>
                                setFormData(prev => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>

                          {/* URLs Input */}
                          <div className="grid gap-2">
                            <Label htmlFor="urls">Product URLs</Label>
                            <div className="flex gap-2">
                              <Input
                                id="urls"
                                placeholder="Enter URL and press Enter"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addUrl}>
                                Add
                              </Button>
                            </div>
                            {formData.urls.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {formData.urls.map((url, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1">
                                    {url}
                                    <X
                                      className="h-3 w-3 cursor-pointer"
                                      onClick={() => removeUrl(url)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Reminder Type */}
                          <div className="grid gap-2">
                            <Label>Reminder Type</Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={
                                  formData.reminderType === 'priceDrop'
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                  setFormData(prev => ({
                                    ...prev,
                                    reminderType: 'priceDrop',
                                  }))
                                }>
                                Price Drop
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  formData.reminderType === 'targetDate'
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                  setFormData(prev => ({
                                    ...prev,
                                    reminderType: 'targetDate',
                                  }))
                                }>
                                Target Date
                              </Button>
                            </div>
                          </div>

                          {/* Price Drop Fields */}
                          {formData.reminderType === 'priceDrop' && (
                            <>
                              <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                  id="currency"
                                  value={formData.currency}
                                  onChange={e =>
                                    setFormData(prev => ({
                                      ...prev,
                                      currency: e.target.value,
                                    }))
                                  }
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                  <option value="USD">USD ($)</option>
                                  <option value="GBP">GBP (£)</option>
                                </select>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="initialPrice">
                                  Initial Price (
                                  {formData.currency === 'USD' ? '$' : '£'})
                                </Label>
                                <Input
                                  id="initialPrice"
                                  type="number"
                                  min="1"
                                  max="1000"
                                  step="0.01"
                                  value={formData.initialPrice}
                                  onChange={e => {
                                    const value =
                                      parseFloat(e.target.value) || 0
                                    setFormData(prev => ({
                                      ...prev,
                                      initialPrice: value,
                                      targetPrice: Math.min(
                                        prev.targetPrice,
                                        value
                                      ),
                                    }))
                                  }}
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="targetPrice">
                                  Target Price (
                                  {formData.currency === 'USD' ? '$' : '£'})
                                </Label>
                                <Input
                                  id="targetPrice"
                                  type="number"
                                  min="1"
                                  max={formData.initialPrice}
                                  step="0.01"
                                  value={formData.targetPrice}
                                  onChange={e => {
                                    const value =
                                      parseFloat(e.target.value) || 0
                                    setFormData(prev => ({
                                      ...prev,
                                      targetPrice: Math.min(
                                        value,
                                        prev.initialPrice
                                      ),
                                    }))
                                  }}
                                />
                              </div>
                            </>
                          )}

                          {/* Target Date Field */}
                          {formData.reminderType === 'targetDate' && (
                            <div className="grid gap-2">
                              <Label htmlFor="targetDate">Target Date</Label>
                              <Input
                                id="targetDate"
                                type="date"
                                value={formData.targetDate}
                                onChange={e =>
                                  setFormData(prev => ({
                                    ...prev,
                                    targetDate: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          )}

                          {/* Submit Button */}
                          <Button
                            onClick={handleAddItem}
                            disabled={
                              createReminderMutation.isLoading ||
                              !formData.name ||
                              formData.urls.length === 0 ||
                              (formData.reminderType === 'priceDrop' &&
                                formData.initialPrice <=
                                  formData.targetPrice) ||
                              (formData.reminderType === 'targetDate' &&
                                !formData.targetDate)
                            }>
                            {createReminderMutation.isLoading
                              ? 'Creating...'
                              : 'Create Reminder'}
                          </Button>

                          {/* Error Message */}
                          {createReminderMutation.isError && (
                            <div className="text-red-500 text-sm text-center">
                              {createReminderMutation.error?.message ||
                                'Failed to create reminder'}
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {/* Search bar */}
                <div className="relative mb-6 flex ">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reminders..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Reminders list */}
                <div className="space-y-4">
                  {filteredReminders.map(reminder => (
                    <ReminderCard key={reminder.productId} item={reminder} />
                  ))}
                </div>

                {/* Empty state */}
                {filteredReminders.length === 0 && displayData.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No reminders yet</p>
                    <p className="text-sm text-gray-400">
                      Create your first reminder to get started
                    </p>
                  </div>
                )}

                {/* No search results */}
                {filteredReminders.length === 0 && displayData.length > 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No reminders match your search
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  )
}

export default Home
