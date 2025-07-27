'use client'

import { Clock, Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '@/api/user'

export function AppSidebar({ onNavigate, currentView }) {
  const navigate = useNavigate()

  const navigationItems = [
    {
      title: 'Reminders',
      icon: Clock,
      view: 'reminders',
      isActive: currentView === 'reminders',
    },
    {
      title: 'Settings',
      icon: Settings,
      view: 'settings',
      isActive: currentView === 'settings',
    },
  ]

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-blue-600">Auto Order</h1>
          <p className="text-sm text-muted-foreground">
            Track prices automatically
          </p>
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
                    className="w-full justify-start py-4 h-12"
                    onClick={() => onNavigate(item.view)}>
                    <button className="flex items-center gap-3 px-3 py-4 h-full w-full text-left">
                      <item.icon className="h-4 w-4" />
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogout}>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">John Doe</span>
            <span className="text-xs text-gray-500">Click to logout</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
