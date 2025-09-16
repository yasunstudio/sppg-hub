import type { Menu, Recipe, RecipeIngredient, Ingredient } from '@prisma/client'
import type { NutritionData } from './nutrition.types'

// Base types from Prisma
export type MenuWithRelations = Menu & {
  recipes: (Recipe & {
    ingredients: (RecipeIngredient & {
      ingredient: Ingredient
    })[]
  })[]
}

// Target education levels
export type TargetLevel = 'TK' | 'SD' | 'SMP' | 'SMA'

// Menu status
export type MenuStatus = 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'INACTIVE'

// Meal type
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'

// Menu form data for create/edit (imported from schema)
export type { MenuFormData } from '../schemas/menu-form.schema'

// Menu creation data
export interface CreateMenuData {
  name: string
  description?: string
  targetLevel: TargetLevel
  status: MenuStatus
  nutrition: NutritionData
  costPerPortion: number
  servingSize: number
  recipes?: MenuRecipeData[]
}

// Menu update data
export interface UpdateMenuData extends Partial<CreateMenuData> {
  id: string
}

// Recipe data for menu creation (simplified for menu context)
export interface MenuRecipeData {
  name: string
  description?: string
  instructions?: string
  prepTime?: number
  cookTime?: number
  servings: number
  ingredients: MenuRecipeIngredientData[]
}

// Recipe ingredient data for menu context
export interface MenuRecipeIngredientData {
  ingredientId: string
  quantity: number
  unit: string
  notes?: string
}

// Menu filters
export interface MenuFilters {
  search?: string
  targetLevel?: TargetLevel
  status?: MenuStatus
  minCost?: number
  maxCost?: number
  hasRecipes?: boolean
  createdAfter?: Date
  createdBefore?: Date
}

// Pagination
export interface MenuPaginationParams {
  page: number
  limit: number
  sortBy?: 'name' | 'createdAt' | 'costPerPortion'
  sortOrder?: 'asc' | 'desc'
}

// Menu list response
export interface MenuListResponse {
  menus: MenuWithRelations[]
  pagination: {
    total: number
    pages: number
    current: number
    hasNext: boolean
    hasPrev: boolean
  }
}