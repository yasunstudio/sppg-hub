'use server'

import { MenuService } from '../services/menu.service'
import { auth } from '@/auth'
import type { MenuWithRelations } from '../types'

export interface RecipeSelectionFilters {
  search?: string
  targetLevel?: 'TK' | 'SD' | 'SMP' | 'SMA'
  category?: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
  excludeMenuIds?: string[]
  limit?: number
}

/**
 * Get available menus for recipe selection
 */
export async function getAvailableMenusForRecipes(
  sppgId: string,
  filters?: RecipeSelectionFilters
): Promise<{ 
  success: boolean
  data?: MenuWithRelations[]
  error?: string 
}> {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get available menus
    const menus = await MenuService.getAvailableMenusForRecipeSelection(sppgId, filters)

    return { 
      success: true, 
      data: menus 
    }
  } catch (error) {
    console.error('getAvailableMenusForRecipes error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch available menus' 
    }
  }
}

/**
 * Convert menu to recipe format for selection
 */
export async function convertMenuToRecipe(menu: MenuWithRelations) {
  return {
    id: menu.id,
    name: menu.name,
    description: menu.description || '',
    category: menu.mealType,
    difficulty: 'MEDIUM' as const, // Default difficulty
    prepTime: menu.prepTime || 30,
    servingSize: 1,
    targetLevel: [menu.targetLevel],
    nutrition: {
      calories: menu.calories || 0,
      protein: menu.protein || 0,
      carbs: menu.carbs || 0,
      fat: menu.fat || 0,
      fiber: menu.fiber || 0,
      calcium: menu.calcium || 0,
      iron: menu.iron || 0
    },
    estimatedCost: menu.costPerPortion || 0,
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
  }
}