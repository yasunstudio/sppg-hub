// API Route for bulk delete Menu operations

import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { z } from 'zod'
import { MenuService } from '@/modules/menu-planning/services/menu.service'

// Bulk delete schema
const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one menu ID is required')
})

// POST /api/menus/bulk/delete - Bulk delete menus (soft delete)
export async function POST(request: NextRequest) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_DELETE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    const body = await request.json()
    
    // Validate data
    const result = bulkDeleteSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Invalid data',
        details: result.error.issues
      }, { status: 400 })
    }

    // Bulk delete menus (soft delete)
    await MenuService.bulkDelete(result.data.ids, sppgId)
    
    return NextResponse.json({ 
      message: `Successfully deleted ${result.data.ids.length} menus` 
    })
  } catch (error) {
    console.error('POST /api/menus/bulk/delete error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete menus' },
      { status: 500 }
    )
  }
}