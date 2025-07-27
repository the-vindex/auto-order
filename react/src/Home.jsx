import React, { useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProductReminder, getProductReminders } from './api/product'
import { SettingsPage } from './SettingsPage'
import { ReminderHeader } from './ReminderHeader'
import { RemindersList } from './RemindersList'

const Home = () => {
	const queryClient = useQueryClient()
	const [currentView, setCurrentView] = useState('reminders')

	const {
		data: remindersData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['productReminders'],
		queryFn: getProductReminders,
		refetchOnWindowFocus: false,
		staleTime: 30000,
	})

	const createReminderMutation = useMutation({
		mutationFn: createProductReminder,
		onSuccess: data => {
			console.log('Reminder created successfully:', data)
			queryClient.invalidateQueries({ queryKey: ['productReminders'] })
		},
		onError: error => {
			console.error('Failed to create reminder:', error)
		},
	})

	if (isLoading) {
		return (
			<SidebarProvider>
				<div className="flex h-screen w-full">
					<AppSidebar onNavigate={setCurrentView} currentView={currentView} />
					<SidebarInset className="flex-1">
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
								<p className="text-gray-600">Loading reminders...</p>
							</div>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		)
	}

	const showErrorIndicator = error && remindersData.length === 0

	return (
		<>
			<SidebarProvider>
				<div className="flex h-screen w-full">
					<AppSidebar onNavigate={setCurrentView} currentView={currentView} />

					<SidebarInset className="flex-1">
						{currentView === 'reminders' ? (
							<div className="flex flex-col h-full">
								<ReminderHeader
									count={remindersData.length}
									showError={showErrorIndicator}
									onAddReminder={createReminderMutation.mutate}
									isLoading={createReminderMutation.isLoading}
									isError={createReminderMutation.isError}
									error={createReminderMutation.error}
								/>
								<RemindersList reminders={remindersData} />
							</div>
						) : (
							<SettingsPage />
						)}
					</SidebarInset>
				</div>
			</SidebarProvider>
		</>
	)
}

export default Home
