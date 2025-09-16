import type { NutritionData } from '../types/nutrition.types'
import type { RecipeWithIngredients } from '../types/recipe.types'

/**
 * Calculate total nutrition values from selected recipes
 */
export function calculateMenuNutrition(recipes: RecipeWithIngredients[]): NutritionData {
  if (recipes.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      iron: 0
    }
  }

  return recipes.reduce(
    (total, recipe) => ({
      calories: total.calories + (recipe.calories || 0),
      protein: total.protein + (recipe.protein || 0),
      carbs: total.carbs + (recipe.carbs || 0),
      fat: total.fat + (recipe.fat || 0),
      fiber: total.fiber + (recipe.fiber || 0),
      calcium: total.calcium + (recipe.calcium || 0),
      iron: total.iron + (recipe.iron || 0)
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      iron: 0
    }
  )
}

/**
 * Calculate total cost per portion from selected recipes
 */
export function calculateMenuCost(recipes: RecipeWithIngredients[]): number {
  if (recipes.length === 0) {
    return 0
  }

  return recipes.reduce((total, recipe) => {
    return total + (recipe.costPerPortion || 0)
  }, 0)
}

/**
 * Calculate serving size based on recipes and target level
 */
export function calculateServingSize(
  recipes: RecipeWithIngredients[],
  targetLevel: 'TK' | 'SD' | 'SMP' | 'SMA'
): number {
  // Base serving sizes by education level (in grams)
  const baseServingSizes = {
    TK: 200,   // Smaller portions for kindergarten
    SD: 300,   // Standard elementary serving
    SMP: 400,  // Larger for middle school
    SMA: 450   // Largest for high school
  }

  return baseServingSizes[targetLevel] || 300
}

/**
 * Format nutrition value for display
 */
export function formatNutritionValue(value: number, unit: string): string {
  if (value === 0) return `0 ${unit}`
  if (value < 1 && unit !== 'kkal') return `${value.toFixed(2)} ${unit}`
  if (value < 10) return `${value.toFixed(1)} ${unit}`
  return `${Math.round(value)} ${unit}`
}

/**
 * Calculate nutrition density (nutrition per 100 calories)
 */
export function calculateNutritionDensity(nutrition: NutritionData) {
  if (nutrition.calories === 0) {
    return {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    }
  }

  const factor = 100 / nutrition.calories

  return {
    protein: nutrition.protein * factor,
    carbs: nutrition.carbs * factor,
    fat: nutrition.fat * factor,
    fiber: nutrition.fiber * factor
  }
}

/**
 * Estimate preparation time for menu based on recipes
 */
export function estimateMenuPrepTime(recipes: RecipeWithIngredients[]): {
  prepTime: number
  cookTime: number
  totalTime: number
} {
  if (recipes.length === 0) {
    return { prepTime: 0, cookTime: 0, totalTime: 0 }
  }

  // Sum up prep times (can be done in parallel for some items)
  const totalPrepTime = recipes.reduce((sum, recipe) => 
    sum + (recipe.prepTime || 15), 0 // Default 15 min if not specified
  )

  // Max cook time (assuming sequential cooking for different items)
  const totalCookTime = Math.max(
    ...recipes.map(recipe => recipe.cookTime || 20) // Default 20 min if not specified
  )

  return {
    prepTime: totalPrepTime,
    cookTime: totalCookTime,
    totalTime: totalPrepTime + totalCookTime
  }
}

/**
 * Generate menu summary for display
 */
export function generateMenuSummary(
  recipes: RecipeWithIngredients[],
  targetLevel: 'TK' | 'SD' | 'SMP' | 'SMA'
) {
  const nutrition = calculateMenuNutrition(recipes)
  const cost = calculateMenuCost(recipes)
  const servingSize = calculateServingSize(recipes, targetLevel)
  const timing = estimateMenuPrepTime(recipes)

  return {
    nutrition,
    cost,
    servingSize,
    timing,
    recipeCount: recipes.length,
    costPerGram: servingSize > 0 ? cost / servingSize : 0,
    caloriesPerGram: servingSize > 0 ? nutrition.calories / servingSize : 0
  }
}