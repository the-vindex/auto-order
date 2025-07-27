import React, { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProductReminder, getProductReminders } from './api/product'
import { SettingsPage } from './SettingsPage'
import { ReminderHeader } from './ReminderHeader'
import { RemindersList } from './RemindersList'

const Home = () => {
  const queryClient = useQueryClient()
  const [currentView, setCurrentView] = useState('reminders')

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

  const createReminderMutation = useMutation({
    mutationFn: createProductReminder,
    onSuccess: data => {
      console.log('Reminder created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['productReminders'] })
    },
    onError: error => {
      console.error('Failed to create reminder:', error)
    },
  })

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar onNavigate={setCurrentView} currentView={currentView} />
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
          <AppSidebar onNavigate={setCurrentView} currentView={currentView} />

          <SidebarInset className="flex-1">
            {currentView === 'reminders' ? (
              <div className="flex flex-col h-full">
                <ReminderHeader
                  count={displayData.length}
                  showError={showErrorIndicator}
                  onAddReminder={createReminderMutation.mutate}
                  isLoading={createReminderMutation.isLoading}
                  isError={createReminderMutation.isError}
                  error={createReminderMutation.error}
                />
                <RemindersList reminders={displayData} />
              </div>
            ) : (
              <SettingsPage />
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  )
}

export default Home
