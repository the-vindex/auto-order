import { useState } from 'react'
// TODO: This component handles loading state, but not error states.
// When using a library like TanStack Query, it's important to handle all three states: loading, error, and success.
// Consider adding a check for the `isError` status from the query and displaying a user-friendly error message
// if the data fetching fails. This will improve the user experience by providing clear feedback when something goes wrong.
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ReminderCard } from './ReminderCard'

export function RemindersList({ isLoading, reminders = [] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReminders = reminders.filter(reminder =>
    reminder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 p-6">
      {/* Search bar */}
      <div className="relative mb-6 flex">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="ultrawide-container">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reminders...</p>
            </div>
          </div>
        </div>
      )}
      {/* Reminders list */}
      <div className="space-y-4" data-testid="reminders-container">
        {filteredReminders.map(reminder => (
          <ReminderCard
            isLoading={isLoading}
            key={reminder.productId}
            item={reminder}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredReminders.length === 0 && reminders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No reminders yet</p>
          <p className="text-sm text-gray-400">
            Create your first reminder to get started
          </p>
        </div>
      )}

      {/* No search results */}
      {filteredReminders.length === 0 && reminders.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No reminders match your search</p>
        </div>
      )}
    </div>
  )
}
