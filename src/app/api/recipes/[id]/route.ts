import { NextResponse, NextRequest } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { RecipeService } from '@/modules/recipe-management/services/recipe.service'
import { z } from 'zod'

// Request validation schema
const recipeUpdateSchema = z.object({
  instructions: z.string().min(1, 'Instructions are required').optional(),
  servingSize: z.number().positive('Serving size must be positive').optional(),
  prepTime: z.number().nonnegative('Prep time must be non-negative').optional(),
  cookTime: z.number().nonnegative('Cook time must be non-negative').optional(),
  ingredients: z.array(z.object({
    ingredientId: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
    notes: z.string().optional()
  })).optional()
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/recipes/[id] - Get recipe by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_READ')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    // Get params
    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    // Fetch recipe
    const recipe = await RecipeService.getRecipeById(id, sppgId)
    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/recipes/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - Update recipe
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_UPDATE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    // Get params
    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    // Parse and validate request body
    const body = await request.json()
    const result = recipeUpdateSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.issues },
        { status: 400 }
      )
    }

    // Update recipe
    const recipe = await RecipeService.updateRecipe(id, sppgId, result.data)
    
    return NextResponse.json(recipe)
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/recipes/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - Delete recipe
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_DELETE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    // Get params
    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    // Delete recipe
    await RecipeService.deleteRecipe(id, sppgId)
    
    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/recipes/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}