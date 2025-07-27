import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Bell, Mail, LogOut, Palette } from 'lucide-react'
import { getCookie } from './lib/utils'
import { logoutUser } from './api/user'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
	const navigate = useNavigate();
	const email = getCookie('email');

	const handleLogout = async () => {
		try {
			await logoutUser()
			navigate('/login')
		} catch (error) {
			console.error('Failed to logout:', error)
		}
	}

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="border-b bg-white px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
					<p className="text-sm text-gray-500">
						Manage your account and preferences
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 p-6 space-y-6">
				{/* User Profile Section */}
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div>
									<h3 className="font-semibold text-gray-900">
										{email}
									</h3>
									<p className="text-sm text-gray-500">Premium Member</p>
								</div>
							</div>
							<Button
								variant="outline"
								className="flex items-center gap-2 bg-transparent"
								onClick={handleLogout}>
								<LogOut className="h-4 w-4" />
								Log Out
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Notifications Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							Notifications
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
									<Bell className="h-4 w-4" />
								</div>
								<div>
									<h4 className="font-medium">Push Notifications</h4>
									<p className="text-sm text-gray-500">
										Get instant alerts on your device
									</p>
								</div>
							</div>
							<Switch defaultChecked />
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
									<Mail className="h-4 w-4" />
								</div>
								<div>
									<h4 className="font-medium">Email Notifications</h4>
									<p className="text-sm text-gray-500">
										Backup notifications via email
									</p>
								</div>
							</div>
							<Switch defaultChecked />
						</div>

						<div className="pt-4">
							<Button variant="outline" className="w-full bg-transparent">
								Test Notification
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Appearance Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							Appearance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div>
							<h4 className="font-medium mb-2">Theme</h4>
							<p className="text-sm text-gray-500">
								Choose your preferred theme
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
