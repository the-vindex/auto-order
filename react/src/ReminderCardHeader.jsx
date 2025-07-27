import { Badge } from '@/components/ui/badge'

export function ReminderCardHeader({ name, status }) {
  const getStatusBadge = status => {
    if (status === 'triggered') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Triggered
        </Badge>
      )
    }
    if (status === 'active') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Active
        </Badge>
      )
    }
    return null
  }

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-2">{name}</h3>
      <div className="flex items-center gap-2 mb-2 mt-2">
        {getStatusBadge(status)}
      </div>
    </div>
  )
}
