import { Clock, LogOut, Settings } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
} from '@/components/ui/sidebar'

const logoutUser = () => {
	alert('logging out user')
}
const navigationItems = [
	{
		title: 'Reminders',
		icon: Clock,
		url: '#',
		isActive: true,
	},
	{
		title: 'Settings',
		icon: Settings,
		url: '#settings',
		isActive: false,
	},
	{
		title: 'Logout',
		icon: LogOut,
		url: 'login',
		isActive: false,
		onClick: logoutUser,
	}
]


export function AppSidebar() {
	return (
		<Sidebar className="border-r ">
			<SidebarHeader className="p-6">
				<div className="flex flex-col">
					<h1 className="text-xl font-semibold text-blue-600">Auto Order</h1>
					<p className="text-sm text-muted-foreground">Never miss a deal</p>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={item.isActive}
										className="w-full justify-start py-4 h-12">
										<a
											href={item.url}
											className="flex items-center gap-3 px-3 py-4 h-full"
											onClick={item.onClick}>
											<item.icon className="h-4 w-4" />
											<span className="text-base font-medium">
												{item.title}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
