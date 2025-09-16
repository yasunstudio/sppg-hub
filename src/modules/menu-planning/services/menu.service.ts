// Real MenuService implementation with Prisma database operations

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { MenuWithRelations, MenuFilters, MenuListResponse, MenuStatus } from '../types'
import type { CreateMenuData, UpdateMenuData, MenuPagination } from '../schemas'

export class MenuService {
  static async getMenus(
    sppgId: string, 
    params?: MenuFilters & MenuPagination
  ): Promise<MenuListResponse> {
    try {
      const {
        search,
        targetLevel,
        status,
        minCost,
        maxCost,
        hasRecipes,
        createdAfter,
        createdBefore,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params || {}

      // Build where clause
      const where: Prisma.MenuWhereInput = {
        sppgId,
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(targetLevel && { targetLevel }),
        ...(status && { status }),
        ...(minCost !== undefined && { costPerPortion: { gte: minCost } }),
        ...(maxCost !== undefined && { costPerPortion: { lte: maxCost } }),
        ...(createdAfter && { createdAt: { gte: createdAfter } }),
        ...(createdBefore && { createdAt: { lte: createdBefore } }),
        ...(hasRecipes !== undefined && {
          recipes: hasRecipes ? { some: {} } : { none: {} }
        })
      }

      // Execute queries
      const [menus, totalCount] = await Promise.all([
        prisma.menu.findMany({
          where,
          include: {
            recipes: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true
                  }
                }
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.menu.count({ where })
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return {
        menus: menus as MenuWithRelations[],
        pagination: {
          total: totalCount,
          pages: totalPages,
          current: page,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    } catch (error) {
      console.error('MenuService.getMenus error:', error)
      throw new Error(`Failed to fetch menus: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async getMenuById(
    id: string, 
    sppgId: string
  ): Promise<MenuWithRelations | null> {
    try {
      const menu = await prisma.menu.findFirst({
        where: {
          id,
          sppgId,
          isActive: true
        },
        include: {
          recipes: {
            include: {
              ingredients: {
                include: {
                  ingredient: true
                }
              }
            }
          }
        }
      })

      return menu as MenuWithRelations | null
    } catch (error) {
      console.error('MenuService.getMenuById error:', error)
      throw new Error(`Failed to fetch menu: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async createMenu(
    sppgId: string, 
    data: CreateMenuData
  ): Promise<MenuWithRelations> {
    try {
      const menu = await prisma.menu.create({
        data: {
          sppgId,
          name: data.name,
          description: data.description,
          targetLevel: data.targetLevel,
          mealType: data.mealType,
          status: data.status || 'DRAFT',
          ...(data.servingDate && { servingDate: data.servingDate }),
          costPerPortion: data.costPerPortion,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          fiber: data.fiber,
          ...(data.calcium !== undefined && { calcium: data.calcium }),
          ...(data.iron !== undefined && { iron: data.iron }),
          ...(data.prepTime !== undefined && { prepTime: data.prepTime }),
          ...(data.cookTime !== undefined && { cookTime: data.cookTime })
        },
        include: {
          recipes: {
            include: {
              ingredients: {
                include: {
                  ingredient: true
                }
              }
            }
          }
        }
      })

      return menu as MenuWithRelations
    } catch (error) {
      console.error('MenuService.createMenu error:', error)
      throw new Error(`Failed to create menu: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async updateMenu(
    id: string, 
    sppgId: string, 
    data: UpdateMenuData
  ): Promise<MenuWithRelations> {
    try {
      const menu = await prisma.menu.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.targetLevel && { targetLevel: data.targetLevel }),
          ...(data.mealType && { mealType: data.mealType }),
          ...(data.status && { status: data.status }),
          ...(data.servingDate && { servingDate: data.servingDate }),
          ...(data.costPerPortion !== undefined && { costPerPortion: data.costPerPortion }),
          ...(data.calories !== undefined && { calories: data.calories }),
          ...(data.protein !== undefined && { protein: data.protein }),
          ...(data.carbs !== undefined && { carbs: data.carbs }),
          ...(data.fat !== undefined && { fat: data.fat }),
          ...(data.fiber !== undefined && { fiber: data.fiber }),
          ...(data.calcium !== undefined && { calcium: data.calcium }),
          ...(data.iron !== undefined && { iron: data.iron }),
          ...(data.prepTime !== undefined && { prepTime: data.prepTime }),
          ...(data.cookTime !== undefined && { cookTime: data.cookTime }),
          updatedAt: new Date()
        },
        include: {
          recipes: {
            include: {
              ingredients: {
                include: {
                  ingredient: true
                }
              }
            }
          }
        }
      })

      return menu as MenuWithRelations
    } catch (error) {
      console.error('MenuService.updateMenu error:', error)
      throw new Error(`Failed to update menu: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async deleteMenu(
    id: string, 
    sppgId: string
  ): Promise<void> {
    try {
      // Soft delete by setting isActive to false
      await prisma.menu.update({
        where: { id },
        data: { 
          isActive: false,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('MenuService.deleteMenu error:', error)
      throw new Error(`Failed to delete menu: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async bulkUpdateStatus(
    ids: string[], 
    status: MenuStatus, 
    sppgId: string
  ): Promise<void> {
    try {
      await prisma.menu.updateMany({
        where: {
          id: { in: ids },
          sppgId,
          isActive: true
        },
        data: {
          status,
          updatedAt: new Date(),
          ...(status === 'APPROVED' && { approvedAt: new Date() })
        }
      })
    } catch (error) {
      console.error('MenuService.bulkUpdateStatus error:', error)
      throw new Error(`Failed to update menu status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  static async bulkDelete(
    ids: string[], 
    sppgId: string
  ): Promise<void> {
    try {
      // Soft delete by setting isActive to false
      await prisma.menu.updateMany({
        where: {
          id: { in: ids },
          sppgId,
          isActive: true
        },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('MenuService.bulkDelete error:', error)
      throw new Error(`Failed to delete menus: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Duplicate menu - create a copy with new ID and name
   */
  static async duplicateMenu(
    id: string, 
    sppgId: string,
    namePrefix: string = 'Copy of'
  ): Promise<MenuWithRelations> {
    try {
      // Get original menu
      const originalMenu = await this.getMenuById(id, sppgId)
      if (!originalMenu) {
        throw new Error('Menu not found')
      }

      // Create duplicate data (exclude id, timestamps, and relations)
      const duplicateData = {
        name: `${namePrefix} ${originalMenu.name}`,
        description: originalMenu.description || undefined,
        targetLevel: originalMenu.targetLevel,
        mealType: originalMenu.mealType,
        status: 'DRAFT' as const, // Always create as draft
        servingDate: undefined, // Reset serving date
        costPerPortion: originalMenu.costPerPortion || 0,
        calories: originalMenu.calories || 0,
        protein: originalMenu.protein || 0,
        carbs: originalMenu.carbs || 0,
        fat: originalMenu.fat || 0,
        fiber: originalMenu.fiber || 0,
        calcium: originalMenu.calcium || undefined,
        iron: originalMenu.iron || undefined,
        prepTime: originalMenu.prepTime || undefined,
        cookTime: originalMenu.cookTime || undefined
      }

      // Create duplicate menu
      const duplicatedMenu = await this.createMenu(sppgId, duplicateData)

      return duplicatedMenu
    } catch (error) {
      console.error('MenuService.duplicateMenu error:', error)
      throw new Error(`Failed to duplicate menu: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get available menus that can be used as recipes in menu planning
   * These are approved, complete menus that can be selected as recipe components
   */
  static async getAvailableMenusForRecipeSelection(
    sppgId: string,
    params?: {
      search?: string
      targetLevel?: string
      category?: string
      excludeMenuIds?: string[]
      limit?: number
    }
  ): Promise<MenuWithRelations[]> {
    try {
      const {
        search,
        targetLevel,
        category,
        excludeMenuIds = [],
        limit = 50
      } = params || {}

      const where: Prisma.MenuWhereInput = {
        sppgId,
        isActive: true,
        status: 'APPROVED', // Only approved menus can be used as recipes
        // Must have basic nutritional data
        calories: { not: null },
        protein: { not: null },
        carbs: { not: null },
        fat: { not: null },
        // Must have cost information
        costPerPortion: { not: null },
        // Exclude specific menu IDs (e.g., current menu being edited)
        ...(excludeMenuIds.length > 0 && {
          id: { notIn: excludeMenuIds }
        }),
        // Search filter
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }),
        // Target level filter
        ...(targetLevel && { targetLevel: targetLevel as any }),
        // Category filter based on mealType
        ...(category && { mealType: category as any })
      }

      const menus = await prisma.menu.findMany({
        where,
        include: {
          recipes: {
            include: {
              ingredients: {
                include: {
                  ingredient: true
                }
              }
            }
          }
        },
        orderBy: [
          { updatedAt: 'desc' },
          { name: 'asc' }
        ],
        take: limit
      })

      return menus as MenuWithRelations[]
    } catch (error) {
      console.error('MenuService.getAvailableMenusForRecipeSelection error:', error)
      throw new Error(`Failed to fetch available menus for recipe selection: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}