// API Routes for Menu CRUD operations

import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { MenuService } from '@/modules/menu-planning/services/menu.service'
import { menuCreateSchema, menuPaginationSchema, menuFilterSchema } from '@/modules/menu-planning/schemas/menu.schema'

// GET /api/menus - Get all menus with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_READ')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Convert string parameters to appropriate types
    const parsedParams = {
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page) : undefined,
      limit: queryParams.limit ? parseInt(queryParams.limit) : undefined,
      minCost: queryParams.minCost ? parseFloat(queryParams.minCost) : undefined,
      maxCost: queryParams.maxCost ? parseFloat(queryParams.maxCost) : undefined,
      hasRecipes: queryParams.hasRecipes === 'true' ? true : queryParams.hasRecipes === 'false' ? false : undefined,
      createdAfter: queryParams.createdAfter ? new Date(queryParams.createdAfter) : undefined,
      createdBefore: queryParams.createdBefore ? new Date(queryParams.createdBefore) : undefined,
    }

    // Validate parameters
    const paginationResult = menuPaginationSchema.safeParse(parsedParams)
    const filterResult = menuFilterSchema.safeParse(parsedParams)
    
    if (!paginationResult.success || !filterResult.success) {
      return NextResponse.json({ 
        error: 'Invalid parameters', 
        details: paginationResult.error?.issues || filterResult.error?.issues 
      }, { status: 400 })
    }

    // Fetch menus
    const result = await MenuService.getMenus(
      sppgId,
      { ...paginationResult.data, ...filterResult.data }
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/menus error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    )
  }
}

// POST /api/menus - Create a new menu
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/menus - Starting request processing...')
    
    // Get authenticated context
    const authContext = await getAuthContext()
    console.log('Auth context:', { userId: authContext.userId, sppgId: authContext.sppgId, role: authContext.role })
    
    requirePermission(authContext, 'MENU_CREATE')
    console.log('Permission check passed')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)
    console.log('SPPG ID:', sppgId)

    const body = await request.json()
    console.log('Request body received:', JSON.stringify(body, null, 2))
    
    // Validate data
    const result = menuCreateSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation failed:', result.error.issues)
      return NextResponse.json({
        error: 'Invalid data',
        details: result.error.issues
      }, { status: 400 })
    }

    console.log('Validation passed, creating menu...')
    
    // Create menu
    const menu = await MenuService.createMenu(sppgId, result.data)
    console.log('Menu created successfully:', menu.id)
    
    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    console.error('POST /api/menus error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create menu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}