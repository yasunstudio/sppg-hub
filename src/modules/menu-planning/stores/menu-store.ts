import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MenuWithRelations, MenuFilters, MenuStatus } from '../types'
import type { CreateMenuData, UpdateMenuData, MenuPagination } from '../schemas'

interface MenuState {
  // Menu data
  menus: MenuWithRelations[]
  currentMenu: MenuWithRelations | null
  
  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Error states
  error: string | null
  
  // Filter and pagination
  filters: MenuFilters
  pagination: MenuPagination
  totalCount: number
  needsRefresh: boolean
  
  // State management
  setCurrentMenu: (menu: MenuWithRelations | null) => void
  setFilters: (filters: Partial<MenuFilters>) => void
  setPagination: (pagination: Partial<MenuPagination>) => void
  clearError: () => void
  
  // Data fetching
  fetchMenus: (sppgId: string) => Promise<void>
  fetchMenuById: (id: string, sppgId: string) => Promise<void>
  refreshMenus: (sppgId: string) => Promise<void>
  
  // CRUD operations
  createMenu: (sppgId: string, data: CreateMenuData) => Promise<MenuWithRelations>
  updateMenu: (id: string, sppgId: string, data: UpdateMenuData) => Promise<MenuWithRelations>
  deleteMenu: (id: string, sppgId: string) => Promise<void>
  
  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: MenuStatus, sppgId: string) => Promise<void>
  bulkDelete: (ids: string[], sppgId: string) => Promise<void>
  
  // Utility
  resetState: () => void
  setNeedsRefresh: (needs: boolean) => void
  
  // Statistics
  getMenusByStatus: (status: MenuStatus) => MenuWithRelations[]
  getTotalMenusByStatus: (status: MenuStatus) => number
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set, get) => ({
      // Initial state
      menus: [],
      currentMenu: null,
      
      // Loading states
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      
      // Error state
      error: null,
      
      // Filter and pagination
      filters: {
        search: '',
        status: undefined,
        targetLevel: undefined,
        createdAfter: undefined,
        createdBefore: undefined
      },
      
      pagination: {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      
      totalCount: 0,
      needsRefresh: false,
      
      // State management
      setCurrentMenu: (menu) => set({ currentMenu: menu }),
      setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),
      setPagination: (pagination) => set(state => ({ pagination: { ...state.pagination, ...pagination } })),
      clearError: () => set({ error: null }),
      
      // Data fetching
      fetchMenus: async (sppgId: string) => {
        const state = get()
        
        set({ isLoading: true, error: null })
        
        try {
          // Build query parameters
          const searchParams = new URLSearchParams()
          
          if (state.filters.search) searchParams.set('search', state.filters.search)
          if (state.filters.status) searchParams.set('status', state.filters.status)
          if (state.filters.targetLevel) searchParams.set('targetLevel', state.filters.targetLevel)
          if (state.filters.minCost) searchParams.set('minCost', state.filters.minCost.toString())
          if (state.filters.maxCost) searchParams.set('maxCost', state.filters.maxCost.toString())
          if (state.filters.hasRecipes !== undefined) searchParams.set('hasRecipes', state.filters.hasRecipes.toString())
          if (state.filters.createdAfter) searchParams.set('createdAfter', state.filters.createdAfter.toISOString())
          if (state.filters.createdBefore) searchParams.set('createdBefore', state.filters.createdBefore.toISOString())
          
          searchParams.set('page', state.pagination.page.toString())
          searchParams.set('limit', state.pagination.limit.toString())
          searchParams.set('sortBy', state.pagination.sortBy)
          searchParams.set('sortOrder', state.pagination.sortOrder)
          
          const response = await fetch(`/api/menus?${searchParams.toString()}`)
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch menus')
          }
          
          const result = await response.json()
          
          set({
            menus: result.menus,
            totalCount: result.pagination.total,
            needsRefresh: false,
            isLoading: false
          })
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch menus',
            isLoading: false
          })
          throw error
        }
      },

      fetchMenuById: async (id: string, sppgId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/menus/${id}`)
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Menu not found')
            }
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch menu')
          }
          
          const menu = await response.json()
          set({ currentMenu: menu, isLoading: false })
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch menu',
            isLoading: false
          })
          throw error
        }
      },
      
      refreshMenus: async (sppgId: string) => {
        const { fetchMenus } = get()
        await fetchMenus(sppgId)
      },
      
      // CRUD operations
      createMenu: async (sppgId: string, data: CreateMenuData) => {
        set({ isCreating: true, error: null })
        
        try {
          const response = await fetch('/api/menus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to create menu')
          }
          
          const menu = await response.json()
          
          set(state => ({
            menus: [menu, ...state.menus],
            totalCount: state.totalCount + 1,
            needsRefresh: true,
            isCreating: false
          }))
          
          return menu
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create menu',
            isCreating: false
          })
          throw error
        }
      },
      
      updateMenu: async (id: string, sppgId: string, data: UpdateMenuData) => {
        set({ isUpdating: true, error: null })
        
        try {
          const response = await fetch(`/api/menus/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to update menu')
          }
          
          const menu = await response.json()
          
          set(state => ({
            menus: state.menus.map(m => m.id === id ? menu : m),
            currentMenu: state.currentMenu?.id === id ? menu : state.currentMenu,
            needsRefresh: true,
            isUpdating: false
          }))
          
          return menu
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update menu',
            isUpdating: false
          })
          throw error
        }
      },
      
      deleteMenu: async (id: string, sppgId: string) => {
        set({ isDeleting: true, error: null })
        
        try {
          const response = await fetch(`/api/menus/${id}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to delete menu')
          }
          
          set(state => ({
            menus: state.menus.filter(m => m.id !== id),
            currentMenu: state.currentMenu?.id === id ? null : state.currentMenu,
            totalCount: state.totalCount - 1,
            needsRefresh: true,
            isDeleting: false
          }))
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete menu',
            isDeleting: false
          })
          throw error
        }
      },
      
      // Bulk operations
      bulkUpdateStatus: async (ids: string[], status: MenuStatus, sppgId: string) => {
        set({ isUpdating: true, error: null })
        
        try {
          const response = await fetch('/api/menus/bulk/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids, status })
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to update menu status')
          }
          
          set(state => ({
            menus: state.menus.map(m => 
              ids.includes(m.id) ? { ...m, status } : m
            ),
            needsRefresh: true,
            isUpdating: false
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update menu status',
            isUpdating: false
          })
          throw error
        }
      },
      
      bulkDelete: async (ids: string[], sppgId: string) => {
        set({ isDeleting: true, error: null })
        
        try {
          const response = await fetch('/api/menus/bulk/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids })
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to delete menus')
          }
          
          set(state => ({
            menus: state.menus.filter(m => !ids.includes(m.id)),
            totalCount: state.totalCount - ids.length,
            needsRefresh: true,
            isDeleting: false
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete menus',
            isDeleting: false
          })
          throw error
        }
      },
      
      // Utility methods
      resetState: () => set({
        menus: [],
        currentMenu: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
        filters: {
          search: '',
          status: undefined,
          targetLevel: undefined,
          createdAfter: undefined,
          createdBefore: undefined
        },
        pagination: {
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        },
        totalCount: 0,
        needsRefresh: false
      }),
      
      setNeedsRefresh: (needs: boolean) => set({ needsRefresh: needs }),
      
      // Statistics
      getMenusByStatus: (status: MenuStatus) => {
        const { menus } = get()
        return menus.filter(menu => menu.status === status)
      },
      
      getTotalMenusByStatus: (status: MenuStatus) => {
        const { menus } = get()
        return menus.filter(menu => menu.status === status).length
      }
    }),
    {
      name: 'menu-store',
      partialize: (state: MenuState) => ({
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
)

export default useMenuStore