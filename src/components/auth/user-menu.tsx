'use client'

// User menu component with profile and logout functionality

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  LogOut, 
  Building2, 
  ChefHat,
  Shield,
  Stethoscope,
  Users
} from 'lucide-react'

// Role icons mapping
const roleIcons = {
  MITRA_ADMIN: Shield,
  SPPG_MANAGER: Building2,
  CHEF: ChefHat,
  AHLI_GIZI: Stethoscope,
  FINANCE_OFFICER: Users,
  HR_STAFF: Users,
  DRIVER: Users,
  WAREHOUSE_STAFF: Users,
  SCHOOL_ADMIN: Users
}

// Role labels in Indonesian
const roleLabels = {
  MITRA_ADMIN: 'Admin Mitra',
  SPPG_MANAGER: 'Manager SPPG',
  CHEF: 'Chef',
  AHLI_GIZI: 'Ahli Gizi',
  FINANCE_OFFICER: 'Finance Officer',
  HR_STAFF: 'HR Staff',
  DRIVER: 'Driver',
  WAREHOUSE_STAFF: 'Staff Gudang',
  SCHOOL_ADMIN: 'Admin Sekolah'
}

export function UserMenu() {
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  if (!session?.user) {
    return null
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ redirect: false })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const user = session.user
  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User
  const roleLabel = roleLabels[user.role as keyof typeof roleLabels] || user.role
  const initials = `${user.name?.split(' ')[0]?.[0] || ''}${user.name?.split(' ')[1]?.[0] || ''}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
            <AvatarFallback className="bg-green-100 text-green-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <RoleIcon className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  {roleLabel}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium leading-none">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>
            
            {/* SPPG/Mitra Info */}
            {user.sppgName && (
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">SPPG: {user.sppgName}</p>
              </div>
            )}
            
            {user.mitraName && !user.sppgName && (
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">Mitra: {user.mitraName}</p>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Pengaturan</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Sedang keluar...' : 'Keluar'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}