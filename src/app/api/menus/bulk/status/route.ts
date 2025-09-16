// API Routes for bulk Menu operations

import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext, requirePermission, getUserSppgId } from '@/lib/auth-utils'
import { z } from 'zod'
import { MenuService } from '@/modules/menu-planning/services/menu.service'
import { menuStatusSchema } from '@/modules/menu-planning/schemas/menu.schema'

// Bulk update status schema
const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one menu ID is required'),
  status: menuStatusSchema
})

// Bulk delete schema
const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one menu ID is required')
})

// POST /api/menus/bulk/status - Bulk update menu status
export async function POST(request: NextRequest) {
  try {
    // Get authenticated context
    const authContext = await getAuthContext()
    requirePermission(authContext, 'MENU_UPDATE')

    // Get user's SPPG ID
    const sppgId = getUserSppgId(authContext)

    const body = await request.json()
    
    // Validate data
    const result = bulkUpdateStatusSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Invalid data',
        details: result.error.issues
      }, { status: 400 })
    }

    // Bulk update status
    await MenuService.bulkUpdateStatus(result.data.ids, result.data.status, sppgId)
    
    return NextResponse.json({ 
      message: `Successfully updated ${result.data.ids.length} menus to ${result.data.status}` 
    })
  } catch (error) {
    console.error('POST /api/menus/bulk/status error:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof Error && error.name === 'AuthenticationError') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof Error && error.name === 'AuthorizationError') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update menu status' },
      { status: 500 }
    )
  }
}