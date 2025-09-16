import type { Recipe, RecipeIngredient, Ingredient } from '@prisma/client'
import type { NutritionData } from './nutrition.types'

// Recipe with full relations and calculated fields
export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient
  })[]
  // Extended fields for UI (will come from Menu or external source)
  name: string
  description?: string
  // Calculated nutrition values
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  calcium?: number
  iron?: number
  // Calculated cost
  costPerPortion: number
}

// Recipe creation data
export interface CreateRecipeData {
  name: string
  description?: string
  instructions?: string
  prepTime?: number
  cookTime?: number
  servings: number
  category?: string
  difficulty?: RecipeDifficulty
  ingredients: CreateRecipeIngredientData[]
}

// Recipe update data
export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

// Recipe ingredient creation data
export interface CreateRecipeIngredientData {
  ingredientId: string
  quantity: number
  unit: string
  notes?: string
  isOptional?: boolean
}

// Recipe difficulty levels
export type RecipeDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

// Recipe categories
export type RecipeCategory = 
  | 'MAIN_COURSE'
  | 'SIDE_DISH' 
  | 'SOUP'
  | 'DESSERT'
  | 'SNACK'
  | 'BEVERAGE'

// Recipe cost breakdown
export interface RecipeCostBreakdown {
  ingredientCosts: Array<{
    ingredientId: string
    name: string
    quantity: number
    unit: string
    unitCost: number
    totalCost: number
    percentage: number
  }>
  totalCost: number
  costPerServing: number
}

// Recipe nutrition breakdown  
export interface RecipeNutritionBreakdown {
  totalNutrition: NutritionData
  nutritionPerServing: NutritionData
  ingredientContributions: Array<{
    ingredientId: string
    name: string
    contribution: NutritionData
    percentage: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
  }>
}

// Recipe filters
export interface RecipeFilters {
  search?: string
  category?: RecipeCategory
  difficulty?: RecipeDifficulty
  maxPrepTime?: number
  maxCookTime?: number
  minServings?: number
  maxServings?: number
  hasIngredient?: string[]
  excludeIngredient?: string[]
}