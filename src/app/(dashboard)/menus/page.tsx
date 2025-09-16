"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

// Import our menu planning module components
import { 
  useMenuStoreHook,
  MenuStats,
  MenuSearch,
  MenuListView,
  type MenuWithRelations
} from '@/modules/menu-planning'

export default function MenusPage() {
  const router = useRouter()
  const {
    menus,
    isLoading,
    error,
    fetchMenus,
    clearError,
    getTotalMenusByStatus
  } = useMenuStoreHook()

  const [searchQuery, setSearchQuery] = useState('')
  const [loadingOperations, setLoadingOperations] = useState<{ [menuId: string]: 'delete' | 'duplicate' | 'edit' }>({})

  // Simulate SPPG ID (this would come from auth context in real app)
  const currentSppgId = "demo-sppg-id"

  // Helper function to set loading state for specific menu operation
  const setMenuLoading = (menuId: string, operation: 'delete' | 'duplicate' | 'edit' | null) => {
    setLoadingOperations(prev => {
      const next = { ...prev }
      if (operation) {
        next[menuId] = operation
      } else {
        delete next[menuId]
      }
      return next
    })
  }

  // Filter menus based on search query
  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate actual costs from menus
  const calculateCosts = () => {
    const validMenus = menus.filter(menu => menu.costPerPortion && menu.costPerPortion > 0)
    const totalCost = validMenus.reduce((sum, menu) => sum + (menu.costPerPortion || 0), 0)
    const avgCost = validMenus.length > 0 ? Math.round(totalCost / validMenus.length) : 0
    
    return { avgCost, totalCost }
  }

  // Generate stats from menus
  const { avgCost, totalCost } = calculateCosts()
  const stats = {
    total: menus.length,
    byStatus: {
      'ACTIVE': getTotalMenusByStatus('ACTIVE'),
      'DRAFT': getTotalMenusByStatus('DRAFT'),
      'APPROVED': getTotalMenusByStatus('APPROVED'),
      'INACTIVE': getTotalMenusByStatus('INACTIVE')
    },
    avgCost,
    totalCost
  }

  useEffect(() => {
    // Fetch menus when component mounts
    fetchMenus(currentSppgId)
  }, [fetchMenus, currentSppgId])

  // Event handlers
  const handleSimpleCreateNew = () => {
    router.push('/menus/create')
  }

  const handleViewDetails = (menu: MenuWithRelations) => {
    router.push(`/menus/${menu.id}`)
  }

  const handleEdit = (menu: MenuWithRelations) => {
    router.push(`/menus/${menu.id}/edit`)
  }

  const handleDelete = async (menu: MenuWithRelations) => {
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${menu.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      // Set loading state for this specific menu
      setMenuLoading(menu.id, 'delete')
      
      const response = await fetch(`/api/menus/${menu.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete menu')
      }
      
      toast.success(`Menu "${menu.name}" deleted successfully`, {
        description: 'The menu has been removed from your list.',
      })
      
      // Refresh the menu list
      await fetchMenus(currentSppgId)
    } catch (error) {
      console.error('Failed to delete menu:', error)
      toast.error('Failed to delete menu', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      // Clear loading state
      setMenuLoading(menu.id, null)
    }
  }

  const handleDuplicate = async (menu: MenuWithRelations) => {
    try {
      // Set loading state for this specific menu
      setMenuLoading(menu.id, 'duplicate')
      
      const response = await fetch(`/api/menus/${menu.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namePrefix: 'Copy of' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to duplicate menu')
      }

      const duplicatedMenu = await response.json()
      
      toast.success(`Menu duplicated as "${duplicatedMenu.name}"`, {
        description: 'The menu copy has been added to your list.',
      })
      
      // Refresh the menu list
      await fetchMenus(currentSppgId)
    } catch (error) {
      console.error('Failed to duplicate menu:', error)
      toast.error('Failed to duplicate menu', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      // Clear loading state
      setMenuLoading(menu.id, null)
    }
  }

  const handleFilterClick = () => {
    console.log('Show filter panel - Phase 2 functionality')
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription className="text-destructive/80">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={clearError} 
              className="text-destructive hover:text-destructive/80 font-medium underline underline-offset-4"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Create Modal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Planning</h1>
          <p className="text-muted-foreground">
            Manage menus and ensure AKG compliance for all education levels
          </p>
        </div>
        <div className="flex gap-3">
          {/* Primary CTA - Quick Menu Creation */}
          <Button 
            size="default"
            onClick={() => router.push('/menus/create')}
            className="gap-2"
          >
            <ChefHat className="h-4 w-4" />
            Create New Menu
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <MenuStats 
        stats={stats}
        isLoading={isLoading}
      />

      {/* Search and Filters */}
      <MenuSearch
        value={searchQuery}
        onChange={setSearchQuery}
        onFilterClick={handleFilterClick}
        isLoading={isLoading}
      />

      {/* Menu List */}
      <MenuListView
        menus={filteredMenus}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onCreateNew={handleSimpleCreateNew}
        onClearSearch={handleClearSearch}
        loadingOperations={loadingOperations}
      />
    </div>
  )
}