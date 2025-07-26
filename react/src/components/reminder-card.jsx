import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MoreHorizontal, Timer } from 'lucide-react'

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

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold">{item.currentPrice}</span>
              {item.discount && (
                <span className="text-sm text-green-600">{item.discount}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              {item.priceStatus && (
                <Badge variant="outline" className="text-xs">
                  📉 Price
                </Badge>
              )}
              {getStatusBadge(item.status)}
            </div>

            {item.targetPrice && (
              <p className="text-sm text-gray-500">
                Target: {item.targetPrice}
              </p>
            )}

            {item.reminderDate && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Timer className="h-3 w-3" />
                <span>Remind me on {item.reminderDate}</span>
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
