// API Route for duplicate Menu operation

import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { MenuService } from '@/modules/menu-planning/services/menu.service'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// POST /api/menus/[id]/duplicate - Duplicate menu
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_CREATE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    // Get params
    const { id } = await params

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid menu ID' }, { status: 400 })
    }

    // Parse request body for optional prefix
    let namePrefix = 'Copy of'
    try {
      const body = await request.json()
      if (body.namePrefix && typeof body.namePrefix === 'string') {
        namePrefix = body.namePrefix
      }
    } catch {
      // Use default prefix if no body or invalid JSON
    }

    // Duplicate menu
    const duplicatedMenu = await MenuService.duplicateMenu(id, sppgId, namePrefix)

    return NextResponse.json(duplicatedMenu, { status: 201 })
  } catch (error) {
    const { id } = await params
    console.error(`POST /api/menus/${id}/duplicate error:`, error)
    
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
      { error: 'Failed to duplicate menu' },
      { status: 500 }
    )
  }
}