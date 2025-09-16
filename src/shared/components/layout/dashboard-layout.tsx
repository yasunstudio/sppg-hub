"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader 
          user={session?.user ? {
            name: session.user.name || '',
            email: session.user.email || '',
            role: session.user.role || '',
            avatar: session.user.avatar || undefined
          } : undefined}
          sppgName={session?.user?.sppgName || undefined}
          mitraName={session?.user?.mitraName || undefined}
        />
        
        {/* Page Content */}
        <main className={cn("flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}