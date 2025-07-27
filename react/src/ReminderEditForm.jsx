import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useState } from 'react'

export function ReminderEditForm({ initialData, onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState(initialData)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')

  const isAmazonUrl = url => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes('amazon')
    } catch {
      return false
    }
  }

  const addUrl = () => {
    const trimmedUrl = urlInput.trim()

    if (!trimmedUrl) {
      setUrlError('Please enter a URL')
      return
    }

    if (!isAmazonUrl(trimmedUrl)) {
      setUrlError('Only Amazon URLs are allowed')
      return
    }

    if (formData.urls.includes(trimmedUrl)) {
      setUrlError('This URL has already been added')
      return
    }

    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, trimmedUrl],
    }))
    setUrlInput('')
    setUrlError('')
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

  const handleUrlInputChange = e => {
    setUrlInput(e.target.value)
    if (urlError) {
      setUrlError('')
    }
  }

  return (
    <div className="grid gap-4">
      {/* Name Input */}
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </div>

      {/* URLs Input */}
      <div className="grid gap-2">
        <Label htmlFor="urls">Amazon Product URLs</Label>
        <div className="flex gap-2">
          <Input
            id="urls"
            placeholder="Enter Amazon URL and press Enter"
            value={urlInput}
            onChange={handleUrlInputChange}
            onKeyPress={handleKeyPress}
            className={urlError ? 'border-red-500' : ''}
          />
          <Button type="button" variant="outline" size="sm" onClick={addUrl}>
            Add
          </Button>
        </div>
        {urlError && <p className="text-red-500 text-xs">{urlError}</p>}
        {formData.urls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.urls.map((url, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                onClick={() => removeUrl(url)}>
                <span className="max-w-[200px] truncate">{url}</span>
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
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
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetPrice">Target Price ($)</Label>
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

      {/* Submit Button */}
      <Button
        onClick={() => onSubmit(formData)}
        disabled={
          isLoading ||
          !formData.name ||
          formData.urls.length === 0 ||
          (formData.reminderType === 'priceDrop' &&
            formData.initialPrice <= formData.targetPrice)
        }>
        {isLoading ? 'Updating...' : 'Update Reminder'}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error.message || 'Failed to update reminder'}
        </div>
      )}
    </div>
  )
}
