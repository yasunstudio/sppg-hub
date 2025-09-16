import { prisma } from '@/lib/prisma'
import { Prisma, MealType } from '@prisma/client'

// Menu select utility for consistent data retrieval
const MENU_SELECT = {
  id: true,
  name: true,
  sppgId: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  calcium: true,
  iron: true,
  costPerPortion: true
} as const

// Ingredient select utility for consistent data retrieval
const INGREDIENT_SELECT = {
  id: true,
  name: true,
  unit: true,
  caloriesPer100g: true,
  proteinPer100g: true,
  carbsPer100g: true,
  fatPer100g: true,
  fiberPer100g: true
} as const

export interface RecipeFilterOptions {
  page?: number
  limit?: number
  search?: string
  menuId?: string
  minPrepTime?: number
  maxPrepTime?: number
  minCookTime?: number
  maxCookTime?: number
}

export interface RecipeCreateData {
  menuId: string
  instructions: string
  servingSize: number
  prepTime: number
  cookTime?: number
  ingredients?: Array<{
    ingredientId: string
    quantity: number
    unit: string
    notes?: string
  }>
}

export interface RecipeUpdateData {
  instructions?: string
  servingSize?: number
  prepTime?: number
  cookTime?: number
  ingredients?: Array<{
    ingredientId: string
    quantity: number
    unit: string
    notes?: string
  }>
}

export type RecipeWithDetails = Prisma.RecipeGetPayload<{
  include: {
    menu: {
      select: typeof MENU_SELECT
    }
    ingredients: {
      include: {
        ingredient: {
          select: typeof INGREDIENT_SELECT
        }
      }
    }
  }
}>

export class RecipeService {
  /**
   * Get recipes with filtering and pagination
   */
  static async getRecipes(
    sppgId: string,
    options: RecipeFilterOptions = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      menuId,
      minPrepTime,
      maxPrepTime,
      minCookTime,
      maxCookTime
    } = options

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.RecipeWhereInput = {
      menu: {
        sppgId: sppgId
      }
    }

    // Add search filter (search in instructions and menu name)
    if (search) {
      where.OR = [
        { instructions: { contains: search, mode: 'insensitive' } },
        { menu: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Add menu filter
    if (menuId) {
      where.menuId = menuId
    }

    // Add time filters
    if (minPrepTime !== undefined || maxPrepTime !== undefined) {
      where.prepTime = {}
      if (minPrepTime !== undefined) {
        where.prepTime.gte = minPrepTime
      }
      if (maxPrepTime !== undefined) {
        where.prepTime.lte = maxPrepTime
      }
    }

    if (minCookTime !== undefined || maxCookTime !== undefined) {
      where.cookTime = {}
      if (minCookTime !== undefined) {
        where.cookTime.gte = minCookTime
      }
      if (maxCookTime !== undefined) {
        where.cookTime.lte = maxCookTime
      }
    }

    // Execute queries
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          menu: {
            select: MENU_SELECT
          },
          ingredients: {
            include: {
              ingredient: {
                select: INGREDIENT_SELECT
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.recipe.count({ where })
    ])

    return {
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string, sppgId: string): Promise<RecipeWithDetails | null> {
    return prisma.recipe.findFirst({
      where: {
        id,
        menu: {
          sppgId
        }
      },
      include: {
        menu: {
          select: MENU_SELECT
        },
        ingredients: {
          include: {
            ingredient: {
              select: INGREDIENT_SELECT
            }
          }
        }
      }
    })
  }

  /**
   * Create new recipe
   */
  static async createRecipe(sppgId: string, data: RecipeCreateData): Promise<RecipeWithDetails> {
    // Verify menu belongs to SPPG
    const menu = await prisma.menu.findFirst({
      where: {
        id: data.menuId,
        sppgId
      }
    })

    if (!menu) {
      throw new Error('Menu not found or access denied')
    }

    const { ingredients, ...recipeData } = data

    // Create recipe with ingredients
    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: ingredients ? {
          create: ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes
          }))
        } : undefined
      },
      include: {
        menu: {
          select: MENU_SELECT
        },
        ingredients: {
          include: {
            ingredient: {
              select: INGREDIENT_SELECT
            }
          }
        }
      }
    })

    return recipe
  }

  /**
   * Update recipe
   */
  static async updateRecipe(
    id: string,
    sppgId: string,
    data: RecipeUpdateData
  ): Promise<RecipeWithDetails> {
    // Verify recipe belongs to SPPG
    const existingRecipe = await this.getRecipeById(id, sppgId)
    if (!existingRecipe) {
      throw new Error('Recipe not found or access denied')
    }

    const { ingredients, ...recipeData } = data

    // Update recipe
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        updatedAt: new Date(),
        // Handle ingredients update if provided
        ...(ingredients && {
          ingredients: {
            deleteMany: {}, // Delete existing ingredients
            create: ingredients.map(ing => ({
              ingredientId: ing.ingredientId,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes
            }))
          }
        })
      },
      include: {
        menu: {
          select: MENU_SELECT
        },
        ingredients: {
          include: {
            ingredient: {
              select: INGREDIENT_SELECT
            }
          }
        }
      }
    })

    return recipe
  }

  /**
   * Delete recipe (hard delete)
   */
  static async deleteRecipe(id: string, sppgId: string): Promise<void> {
    // Verify recipe belongs to SPPG
    const recipe = await this.getRecipeById(id, sppgId)
    if (!recipe) {
      throw new Error('Recipe not found or access denied')
    }

    // Delete recipe and related ingredients
    await prisma.recipe.delete({
      where: { id }
    })
  }

  /**
   * Get recipes by menu ID
   */
  static async getRecipesByMenuId(menuId: string, sppgId: string): Promise<RecipeWithDetails[]> {
    return prisma.recipe.findMany({
      where: {
        menuId,
        menu: {
          sppgId
        }
      },
      include: {
        menu: {
          select: MENU_SELECT
        },
        ingredients: {
          include: {
            ingredient: {
              select: INGREDIENT_SELECT
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get recipes by category/menu type
   */
  static async getRecipesByCategory(
    sppgId: string,
    category?: string
  ): Promise<RecipeWithDetails[]> {
    const where: Prisma.RecipeWhereInput = {
      menu: {
        sppgId,
        ...(category && { mealType: category as MealType })
      }
    }

    return prisma.recipe.findMany({
      where,
      include: {
        menu: {
          select: {
            ...MENU_SELECT,
            mealType: true
          }
        },
        ingredients: {
          include: {
            ingredient: {
              select: INGREDIENT_SELECT
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Calculate total nutrition from multiple recipes
   */
  static calculateTotalNutrition(recipes: RecipeWithDetails[]): {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    calcium: number
    iron: number
  } {
    return recipes.reduce(
      (total, recipe) => {
        const menuNutrition = recipe.menu
        
        return {
          calories: total.calories + (menuNutrition.calories || 0),
          protein: total.protein + (menuNutrition.protein || 0),
          carbs: total.carbs + (menuNutrition.carbs || 0),
          fat: total.fat + (menuNutrition.fat || 0),
          fiber: total.fiber + (menuNutrition.fiber || 0),
          calcium: total.calcium + (menuNutrition.calcium || 0),
          iron: total.iron + (menuNutrition.iron || 0)
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, calcium: 0, iron: 0 }
    )
  }

  /**
   * Calculate total cost from multiple recipes
   */
  static calculateTotalCost(recipes: RecipeWithDetails[]): number {
    return recipes.reduce((total, recipe) => {
      return total + (recipe.menu.costPerPortion || 0)
    }, 0)
  }
}