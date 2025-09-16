// API Routes for individual Menu operations

import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { MenuService } from '@/modules/menu-planning/services/menu.service'
import { menuUpdateSchema } from '@/modules/menu-planning/schemas/menu.schema'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/menus/[id] - Get menu by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_READ')

    // Get params
    const { id } = await params

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

        // Validate params
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid menu ID' }, { status: 400 })
    }

    // Get menu by ID with SPPG validation
    const menu = await MenuService.getMenuById(id, sppgId)
    
    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }

    return NextResponse.json(menu)
  } catch (error) {
    const { id } = await params
    console.error(`GET /api/menus/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}

// PUT /api/menus/[id] - Update menu
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
      return NextResponse.json({ error: 'Invalid menu ID' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request data
    const result = menuUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.issues },
        { status: 400 }
      )
    }

    // Update menu with SPPG validation
    const menu = await MenuService.updateMenu(id, sppgId, result.data)

    return NextResponse.json(menu)
  } catch (error) {
    const { id } = await params
    console.error(`PUT /api/menus/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    )
  }
}

// DELETE /api/menus/[id] - Delete menu (soft delete)
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
      return NextResponse.json({ error: 'Invalid menu ID' }, { status: 400 })
    }

    // Delete menu (soft delete)
    await MenuService.deleteMenu(id, sppgId)
    
    return NextResponse.json({ message: 'Menu deleted successfully' }, { status: 200 })
  } catch (error) {
    const { id } = await params
    console.error(`DELETE /api/menus/${id} error:`, error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    )
  }
}