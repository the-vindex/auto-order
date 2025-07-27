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
		initialPrice: 10000000,
		targetPrice: 0,
		currency: 'USD',
	})
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

	const handleSubmit = async () => {
		const newReminderData = {
			name: formData.name,
			urls: formData.urls,
			reminderDetails: {
				type: 'priceDrop',
				initialPrice: {
					amount: parseFloat(formData.initialPrice),
					currency: formData.currency,
				},
				targetPrice: {
					amount: parseFloat(formData.targetPrice),
					currency: formData.currency,
				},
			},
		}

		try {
			await onSubmit(newReminderData)
			setFormData({
				name: '',
				urls: [],
				initialPrice: 1000000,
				targetPrice: 0,
				currency: 'USD',
			})
			setUrlInput('')
			setUrlError('')
			setIsPopoverOpen(false)
		} catch (err) {
			console.error('Failed to create reminder:', err)
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

	const handlePopoverChange = open => {
		setIsPopoverOpen(open)

		if (!open) {
			setFormData({
				name: '',
				urls: [],
				initialPrice: 1000,
				targetPrice: 80,
				currency: 'USD',
			})
			setUrlInput('')
			setUrlError('')
		}
	}

	return (
		<Popover open={isPopoverOpen} onOpenChange={handlePopoverChange}>
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
								Create a new price drop reminder
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
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addUrl}>
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
												onClick={() => removeUrl(url)}
												className="flex items-center gap-1 cursor-pointer hover:bg-gray-200">
												<span className="max-w-[200px] truncate">{url}</span>
												<X className="h-3 w-3" />
											</Badge>
										))}
									</div>
								)}
							</div>

							{/* Currency */}
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

							{/* Target Price */}
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

							{/* Submit Button */}
							<Button
								onClick={handleSubmit}
								disabled={
									isLoading || !formData.name || formData.urls.length === 0
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
