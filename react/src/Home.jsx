import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, Search } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { ReminderCard } from '@/components/reminder-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const Home = () => {
  // Dummy data for items (to be replaced by backend data)
  const [remindersData, setItems] = useState([
    {
      id: 1,
      name: 'Soda',
      site: 'https://www.amazon.com',
      currentPrice: '279.99 €',
      discount: '-20.00 €',
      status: 'active',
      reminderDate: '2025-09-01',
    },
    {
      id: 2,

      name: 'T-Shirt',
      site: 'https://www.amazon.com',
      currentPrice: '279.99 €',
      discount: '-20.00 €',
      status: 'active',
      reminderDate: '2025-09-01',
    },
    {
      id: 3,
      name: 'Shoes',
      currentPrice: '279.99 €',
      discount: '-20.00 €',
      status: 'active',
      site: 'https://www.amazon.com',
      reminderDate: '2025-09-01',
    },
  ])

  // Handle adding a new item
  const handleAddItem = () => {
    const newItem = {
      name: 'New Item',
      currentPrice: '279.99 €',
      discount: '-20.00 €',
      status: 'active',
      site: 'https://example.com',
      reminderDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
    }
    setItems([...remindersData, newItem])
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filteredReminders = remindersData.filter(reminder =>
    reminder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-white px-6 py-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Reminders
                  <Button className="justify-content bg-blue-600 hover:bg-blue-700 ml-5">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </h1>

                <p className="text-sm text-gray-500">
                  {remindersData.length} reminders tracking
                </p>
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
              {/* Add button above search */}

              {/* Reminders list */}
              <div className="space-y-4">
                {filteredReminders.map(reminder => (
                  <ReminderCard key={reminder.id} item={reminder} />
                ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Home
