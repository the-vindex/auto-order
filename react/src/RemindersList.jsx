import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ReminderCard } from './ReminderCard'

export function RemindersList({ reminders = [] }) {
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

      {/* Reminders list */}
      <div className="space-y-4">
        {filteredReminders.map(reminder => (
          <ReminderCard key={reminder.productId} item={reminder} />
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
