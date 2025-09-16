'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MenuForm } from '@/modules/menu-planning'
import { LoadingSkeleton } from '@/modules/menu-planning/components/shared/loading-skeleton'
import type { MenuWithRelations } from '@/modules/menu-planning/types/menu.types'
import { toast } from 'sonner'

export default function EditMenuPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [menu, setMenu] = useState<MenuWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading' || !session) {
      return
    }

    const fetchMenu = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/menus/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Menu not found')
          } else if (response.status === 403) {
            setError('You do not have access to edit this menu')
          } else {
            setError('Failed to load menu data')
          }
          return
        }
        
        const menuData = await response.json()
        setMenu(menuData)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        setError('An error occurred while loading the menu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [params.id, router, session, status])

  // Helper functions for calculations
  const calculateTotalNutrition = (recipes: any[], field: string): number => {
    if (!recipes || recipes.length === 0) return 0
    return recipes.reduce((total, recipe) => {
      const value = recipe.menu?.[field] || 0
      return total + (typeof value === 'number' ? value : 0)
    }, 0)
  }

  const calculateTotalCost = (recipes: any[]): number => {
    if (!recipes || recipes.length === 0) return 0
    return recipes.reduce((total, recipe) => {
      const cost = recipe.menu?.costPerPortion || 0
      return total + (typeof cost === 'number' ? cost : 0)
    }, 0)
  }

  const calculateMaxTime = (recipes: any[], field: string): number => {
    if (!recipes || recipes.length === 0) return 30 // default
    return Math.max(...recipes.map(recipe => recipe[field] || 30))
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsSubmitting(true)
      console.log('Updated menu data:', data)

      // Convert form data to API format (same as create page)
      const apiData = {
        name: data.menuName,
        description: data.description || '',
        targetLevel: data.educationLevel,
        mealType: menu?.mealType || 'LUNCH', // Keep existing mealType or default
        status: menu?.status || 'DRAFT', // Keep existing status
        servingDate: data.date ? new Date(data.date as string) : undefined,
        
        // Calculate nutrition from selected recipes
        calories: calculateTotalNutrition(data.selectedRecipes as any[], 'calories'),
        protein: calculateTotalNutrition(data.selectedRecipes as any[], 'protein'),
        carbs: calculateTotalNutrition(data.selectedRecipes as any[], 'carbs'),
        fat: calculateTotalNutrition(data.selectedRecipes as any[], 'fat'),
        fiber: calculateTotalNutrition(data.selectedRecipes as any[], 'fiber'),
        calcium: calculateTotalNutrition(data.selectedRecipes as any[], 'calcium'),
        iron: calculateTotalNutrition(data.selectedRecipes as any[], 'iron'),
        
        // Calculate cost from selected recipes
        costPerPortion: calculateTotalCost(data.selectedRecipes as any[]),
        
        // Time estimates - take max from selected recipes
        prepTime: calculateMaxTime(data.selectedRecipes as any[], 'prepTime'),
        cookTime: calculateMaxTime(data.selectedRecipes as any[], 'cookTime'),
        
        // Include recipes data if needed by service
        recipes: (data.selectedRecipes as any[])?.map(recipe => ({
          name: recipe.menu?.name || 'Recipe',
          instructions: recipe.instructions || '',
          prepTime: recipe.prepTime || 30,
          cookTime: recipe.cookTime || 30,
          servings: data.servingCount || 1
        }))
      }

      console.log("API data to send:", apiData)
      
      const response = await fetch(`/api/menus/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update menu')
      }

      const updatedMenu = await response.json()
      
      // TODO: Add success notification
      toast.success(`Menu "${updatedMenu.name}" updated successfully`, {
        description: 'All changes have been saved.',
      })
      
      // Redirect back to menu details or list
      router.push(`/menus/${params.id}`)
    } catch (error) {
      console.error('Failed to update menu:', error)
      // TODO: Add error notification
      toast.error('Failed to update menu', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push(`/menus/${params.id}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-background border-b -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold">Loading...</h1>
              </div>
            </div>
          </div>
        </div>
        <LoadingSkeleton count={1} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-background border-b -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold text-destructive">Error</h1>
              </div>
            </div>
          </div>
        </div>
        <Card className="border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleBack} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!menu) {
    return null
  }

  // Convert menu data to form format
  const initialData = {
    menuName: menu.name,
    description: menu.description || '',
    date: menu.servingDate ? new Date(menu.servingDate).toISOString().split('T')[0] : '',
    educationLevel: menu.targetLevel,
    servingCount: 100, // Default serving count - this might need to be stored in menu
    budgetLimit: menu.costPerPortion || undefined,
    selectedRecipes: menu.recipes?.map(recipe => ({
      ...recipe,
      menu: {
        id: menu.id,
        name: menu.name,
        sppgId: menu.sppgId,
        calories: menu.calories,
        protein: menu.protein,
        carbs: menu.carbs,
        fat: menu.fat,
        fiber: menu.fiber,
        calcium: menu.calcium,
        iron: menu.iron,
        costPerPortion: menu.costPerPortion
      }
    })) || []
  }

  return (
    <>
      {/* Header */}
      <div className="bg-background border-b -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold">Edit Menu</h1>
                <p className="text-sm text-muted-foreground">
                  Update menu details, recipes, and nutrition information
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              
              <Button 
                type="submit" 
                form="menu-form"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-none">
        <CardHeader>
          <CardTitle>Edit Menu: {menu.name}</CardTitle>
          <p className="text-muted-foreground">
            Update the menu details, recipe selection, and review nutrition analysis.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <MenuForm 
            onSubmit={handleSubmit}
            formId="menu-form"
            isPreviewMode={isPreviewMode}
            isLoading={isSubmitting}
            initialData={initialData}
            sppgId={menu?.sppgId || 'default-sppg-id'}
            excludeMenuIds={[params.id as string]}
          />
        </CardContent>
      </Card>
    </>
  )
}