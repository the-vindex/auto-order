import { Badge } from '@/components/ui/badge'

export function ReminderDetails({ details }) {
  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount)
  }

  if (details.type === 'priceDrop') {
    const { initialPrice, targetPrice } = details
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
  }

  return null
}
