import { AddReminderPopover } from './AddReminderPopover'

export function ReminderHeader({
  count,
  showError,
  onAddReminder,
  isLoading,
  isError,
  error,
}) {
  return (
    <div className="border-b bg-white px-6 py-4">
      {showError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            Failed to load reminders from server. Showing demo data.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Reminders</h1>

          <p className="text-sm text-gray-500">{count} reminders tracking</p>
        </div>
        <AddReminderPopover
          onSubmit={onAddReminder}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  )
}
