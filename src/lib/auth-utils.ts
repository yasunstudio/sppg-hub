import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export interface AuthContext {
  userId: string
  sppgId: string | null
  mitraId: string | null
  role: string
  email: string
  name: string
}

/**
 * Get authenticated session context for API routes
 * Returns user session data or throws authentication error
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth()
  
  if (!session?.user) {
    throw new AuthenticationError('Unauthorized: No active session')
  }

  return {
    userId: session.user.id,
    sppgId: session.user.sppgId,
    mitraId: session.user.mitraId,
    role: session.user.role,
    email: session.user.email || '',
    name: session.user.name || ''
  }
}

/**
 * Middleware wrapper for API routes that require authentication
 * Automatically handles authentication and passes context to handler
 */
export function withAuth<T extends unknown[]>(
  handler: (authContext: AuthContext, ...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const authContext = await getAuthContext()
      return await handler(authContext, ...args)
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({ error: error.message }, { status: 401 })
      }
      if (error instanceof AuthorizationError) {
        return NextResponse.json({ error: error.message }, { status: 403 })
      }
      console.error('API Authentication Error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

/**
 * Check if user has required role for operation
 */
export function requireRole(authContext: AuthContext, allowedRoles: string[]): void {
  if (!allowedRoles.includes(authContext.role)) {
    throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
  }
}

/**
 * Check if user belongs to specific SPPG
 */
export function requireSppgAccess(authContext: AuthContext, sppgId: string): void {
  // MITRA_ADMIN can access all SPPGs under their mitra
  if (authContext.role === 'MITRA_ADMIN') {
    return // Allow access
  }
  
  // Other roles must belong to the specific SPPG
  if (authContext.sppgId !== sppgId) {
    throw new AuthorizationError('Access denied: You can only access resources from your assigned SPPG')
  }
}

/**
 * Get SPPG ID with fallback for different user roles
 */
export function getUserSppgId(authContext: AuthContext, requestedSppgId?: string): string {
  // If no specific SPPG requested, use user's assigned SPPG
  if (!requestedSppgId) {
    if (!authContext.sppgId) {
      throw new AuthorizationError('No SPPG assignment found for user')
    }
    return authContext.sppgId
  }

  // Check access to requested SPPG
  requireSppgAccess(authContext, requestedSppgId)
  return requestedSppgId
}

// Custom error classes
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

// Role-based access control constants
export const ROLES = {
  MITRA_ADMIN: 'MITRA_ADMIN',
  SPPG_MANAGER: 'SPPG_MANAGER', 
  CHEF: 'CHEF',
  AHLI_GIZI: 'AHLI_GIZI',
  FINANCE_OFFICER: 'FINANCE_OFFICER',
  HR_STAFF: 'HR_STAFF',
  DRIVER: 'DRIVER',
  WAREHOUSE_STAFF: 'WAREHOUSE_STAFF',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN'
} as const

// Permission matrix - defines what roles can perform what operations
export const PERMISSIONS = {
  MENU_CREATE: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.CHEF, ROLES.AHLI_GIZI],
  MENU_READ: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.CHEF, ROLES.AHLI_GIZI, ROLES.FINANCE_OFFICER],
  MENU_UPDATE: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.CHEF, ROLES.AHLI_GIZI],
  MENU_DELETE: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER],
  MENU_APPROVE: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.AHLI_GIZI],
  USER_MANAGE: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.HR_STAFF],
  FINANCIAL_ACCESS: [ROLES.MITRA_ADMIN, ROLES.FINANCE_OFFICER],
  REPORTS_ACCESS: [ROLES.MITRA_ADMIN, ROLES.SPPG_MANAGER, ROLES.FINANCE_OFFICER]
} as const

/**
 * Check if user has specific permission
 */
export function hasPermission(authContext: AuthContext, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(authContext.role)
}

/**
 * Require specific permission or throw authorization error
 */
export function requirePermission(authContext: AuthContext, permission: keyof typeof PERMISSIONS): void {
  if (!hasPermission(authContext, permission)) {
    throw new AuthorizationError(`Access denied. Missing permission: ${permission}`)
  }
}