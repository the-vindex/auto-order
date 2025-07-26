import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MoreHorizontal, Timer, DollarSign, Calendar } from 'lucide-react'

export function ReminderCard({ item }) {
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

  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount)
  }

  const renderReminderDetails = () => {
    if (item.reminderDetails.type === 'priceDrop') {
      const { initialPrice, targetPrice } = item.reminderDetails
      const discount = initialPrice.amount - targetPrice.amount

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {formatPrice(initialPrice)}
            </span>
            <span className="text-sm text-green-600">
              → {formatPrice(targetPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              📉 Price Drop
            </Badge>
            <span className="text-sm text-green-600">
              Save{' '}
              {formatPrice({
                amount: discount,
                currency: initialPrice.currency,
              })}
            </span>
          </div>
        </div>
      )
    } else if (item.reminderDetails.type === 'targetDate') {
      const targetDate = new Date(item.reminderDetails.targetDate)
      const formattedDate = targetDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              📅 Date Reminder
            </Badge>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>

            {renderReminderDetails()}

            <div className="flex items-center gap-2 mb-2 mt-2">
              {getStatusBadge(item.status)}
            </div>

            {item.urls && item.urls.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <span className="text-xs text-gray-400">
                  {item.urls.length} URL{item.urls.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
