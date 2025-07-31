'use client'

import { Clock, Settings, ShoppingCart } from 'lucide-react'
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
import { getCookie } from './lib/utils'

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

  const username = getCookie('username')

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <Sidebar className="border-r w-72 flex-shrink-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-blue-600">Timely Buy</h1>
            <p className="text-sm text-muted-foreground">
              Track prices automatically
            </p>
          </div>
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
                    className="w-full justify-start py-2 h-10"
                    onClick={() => onNavigate(item.view)}>
                    <button className="flex items-center gap-2 px-3 h-full w-full text-left">
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
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogout}>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {username}
            </span>
            <span className="text-xs text-gray-500">Click to logout</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
