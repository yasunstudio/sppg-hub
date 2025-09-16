import { NextResponse, NextRequest } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { RecipeService } from '@/modules/recipe-management/services/recipe.service'
import { z } from 'zod'

// Request validation schemas
const recipeCreateSchema = z.object({
  menuId: z.string().min(1, 'Menu ID is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  servingSize: z.number().positive('Serving size must be positive'),
  prepTime: z.number().nonnegative('Prep time must be non-negative'),
  cookTime: z.number().nonnegative('Cook time must be non-negative').optional(),
  ingredients: z.array(z.object({
    ingredientId: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
    notes: z.string().optional()
  })).optional()
})

const recipeUpdateSchema = recipeCreateSchema.partial().omit({ menuId: true })

const recipeFilterSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  menuId: z.string().optional(),
  minPrepTime: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxPrepTime: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  minCookTime: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxCookTime: z.string().optional().transform(val => val ? parseInt(val) : undefined)
})

// GET /api/recipes - Get all recipes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_READ')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries())
    const filterResult = recipeFilterSchema.safeParse(queryParams)
    
    if (!filterResult.success) {
      return NextResponse.json({
        error: 'Invalid query parameters',
        details: filterResult.error.issues
      }, { status: 400 })
    }

    // Fetch recipes with filtering and pagination
    const result = await RecipeService.getRecipes(sppgId, filterResult.data)

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/recipes error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_CREATE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    const body = await request.json()
    
    // Validate request data
    const result = recipeCreateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Invalid data',
        details: result.error.issues
      }, { status: 400 })
    }

    // Create recipe
    const recipe = await RecipeService.createRecipe(sppgId, result.data)
    
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('POST /api/recipes error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    // Handle business logic errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}