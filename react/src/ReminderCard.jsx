import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateProductReminderById,
  deleteProductReminderById,
} from '@/api/product'
import { useState } from 'react'
import { MoreHorizontal, Trash } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ReminderCardHeader } from './ReminderCardHeader'
import { ReminderDetails } from './ReminderDetails'
import { ReminderEditForm } from './ReminderEditForm'

export function ReminderCard({ isLoading, item }) {
  const queryClient = useQueryClient()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const initialFormData = {
    name: item.name,
    urls: [...item.urls],
    reminderType: item.reminderDetails.type,
    initialPrice:
      item.reminderDetails.type === 'priceDrop'
        ? item.reminderDetails.initialPrice.amount
        : 100,
    targetPrice:
      item.reminderDetails.type === 'priceDrop'
        ? item.reminderDetails.targetPrice.amount
        : 80,
    currency:
      item.reminderDetails.type === 'priceDrop'
        ? item.reminderDetails.initialPrice.currency
        : 'USD',
    targetDate:
      item.reminderDetails.type === 'targetDate'
        ? item.reminderDetails.targetDate
        : '',
  }

  // Check if item has Amazon URLs
  const hasAmazonUrl = item.urls?.some(
    url =>
      url.includes('amazon.com') ||
      url.includes('amazon.') ||
      url.includes('amzn.')
  )

  // Generate static asset path for Amazon images
  const getImageSrc = () => {
    if (hasAmazonUrl) {
      // Use Amazon logo for Amazon products
      return '/Amazon_logo.svg'
    }
    return '/placeholder.svg'
  }

  const updateReminderMutation = useMutation({
    mutationFn: async updateData => {
      return updateProductReminderById(item.productId, updateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReminders'] })
      setIsPopoverOpen(false)
    },
    onError: error => {
      console.error('Failed to update reminder:', error)
    },
  })

  const deleteReminderMutation = useMutation({
    mutationFn: async id => {
      return deleteProductReminderById(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReminders'] })
      setIsPopoverOpen(false)
    },
    onError: error => {
      console.error('Failed to delete reminder:', error)
    },
  })

  const handleUpdate = formData => {
    const updateData = {
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

    updateReminderMutation.mutate(updateData)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {hasAmazonUrl ? (
              <img
                src={getImageSrc()}
                alt={item.name}
                className="w-12 h-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded" />
            )}
          </div>

          <div className="flex-1">
            <ReminderCardHeader name={item.name} status={item.status} />
            <ReminderDetails
              isLoading={isLoading}
              details={item.reminderDetails}
            />

            {item.urls && item.urls.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <span className="text-xs text-gray-400">
                  {item.urls.length} URL{item.urls.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <Button
            onClick={() => deleteReminderMutation.mutate(item.productId)}
            className="bg-red-200"
            variant="ghost"
            size="sm">
            <Trash className="h-4 w-4" />
          </Button>

          <Popover
            open={isPopoverOpen}
            onOpenChange={open => {
              setIsPopoverOpen(open)
            }}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Edit Reminder</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your product reminder
                    </p>
                  </div>

                  <ReminderEditForm
                    initialData={initialFormData}
                    onSubmit={handleUpdate}
                    isLoading={updateReminderMutation.isLoading}
                    error={updateReminderMutation.error}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
