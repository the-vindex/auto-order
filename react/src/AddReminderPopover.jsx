import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function AddReminderPopover({ onSubmit, isLoading, isError, error }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    urls: [],
    reminderType: 'priceDrop',
    initialPrice: 100,
    targetPrice: 80,
    currency: 'USD',
    targetDate: '',
  })
  const [urlInput, setUrlInput] = useState('')

  const handleSubmit = () => {
    const newReminderData = {
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

    onSubmit(newReminderData)
  }

  const addUrl = () => {
    if (urlInput.trim() && !formData.urls.includes(urlInput.trim())) {
      setFormData(prev => ({
        ...prev,
        urls: [...prev.urls, urlInput.trim()],
      }))
      setUrlInput('')
    }
  }

  const removeUrl = urlToRemove => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter(url => url !== urlToRemove),
    }))
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addUrl()
    }
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">New Reminder</h4>
              <p className="text-sm text-muted-foreground">
                Create a new product reminder
              </p>
            </div>

            <div className="grid gap-4">
              {/* Name Input */}
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* URLs Input */}
              <div className="grid gap-2">
                <Label htmlFor="urls">Product URLs</Label>
                <div className="flex gap-2">
                  <Input
                    id="urls"
                    placeholder="Enter URL and press Enter"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUrl}>
                    Add
                  </Button>
                </div>
                {formData.urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.urls.map((url, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1">
                        {url}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeUrl(url)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Reminder Type */}
              <div className="grid gap-2">
                <Label>Reminder Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      formData.reminderType === 'priceDrop'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        reminderType: 'priceDrop',
                      }))
                    }>
                    Price Drop
                  </Button>
                  <Button
                    type="button"
                    variant={
                      formData.reminderType === 'targetDate'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        reminderType: 'targetDate',
                      }))
                    }>
                    Target Date
                  </Button>
                </div>
              </div>

              {/* Price Drop Fields */}
              {formData.reminderType === 'priceDrop' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="initialPrice">
                      Initial Price ({formData.currency === 'USD' ? '$' : '£'})
                    </Label>
                    <Input
                      id="initialPrice"
                      type="number"
                      min="1"
                      max="1000"
                      step="0.01"
                      value={formData.initialPrice}
                      onChange={e => {
                        const value = parseFloat(e.target.value) || 0
                        setFormData(prev => ({
                          ...prev,
                          initialPrice: value,
                          targetPrice: Math.min(prev.targetPrice, value),
                        }))
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="targetPrice">
                      Target Price ({formData.currency === 'USD' ? '$' : '£'})
                    </Label>
                    <Input
                      id="targetPrice"
                      type="number"
                      min="1"
                      max={formData.initialPrice}
                      step="0.01"
                      value={formData.targetPrice}
                      onChange={e => {
                        const value = parseFloat(e.target.value) || 0
                        setFormData(prev => ({
                          ...prev,
                          targetPrice: Math.min(value, prev.initialPrice),
                        }))
                      }}
                    />
                  </div>
                </>
              )}

              {/* Target Date Field */}
              {formData.reminderType === 'targetDate' && (
                <div className="grid gap-2">
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        targetDate: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !formData.name ||
                  formData.urls.length === 0 ||
                  (formData.reminderType === 'priceDrop' &&
                    formData.initialPrice <= formData.targetPrice) ||
                  (formData.reminderType === 'targetDate' &&
                    !formData.targetDate)
                }>
                {isLoading ? 'Creating...' : 'Create Reminder'}
              </Button>

              {/* Error Message */}
              {isError && (
                <div className="text-red-500 text-xs text-center">
                  {error?.message || 'Failed to create reminder'}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
