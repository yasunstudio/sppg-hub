import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Modal states
  isMenuFormOpen: boolean
  isMenuDetailsOpen: boolean
  isDeleteMenuOpen: boolean
  isBulkDeleteOpen: boolean
  isRecipeFormOpen: boolean
  
  // Selected items for bulk operations
  selectedMenuIds: string[]
  
  // Form states
  editingMenuId: string | null
  editingRecipeId: string | null
  
  // View preferences
  viewMode: 'grid' | 'list' | 'table'
  sidebarCollapsed: boolean
  
  // Search and filter UI
  isFilterPanelOpen: boolean
  searchFocused: boolean
  
  // Toast notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    description?: string
    duration?: number
  }>
}

interface UIActions {
  // Modal actions
  openMenuForm: (editingId?: string) => void
  closeMenuForm: () => void
  openMenuDetails: (menuId: string) => void
  closeMenuDetails: () => void
  openDeleteMenu: (menuId: string) => void
  closeDeleteMenu: () => void
  openBulkDelete: () => void
  closeBulkDelete: () => void
  openRecipeForm: (editingId?: string) => void
  closeRecipeForm: () => void
  
  // Selection actions
  selectMenu: (menuId: string) => void
  deselectMenu: (menuId: string) => void
  selectAllMenus: (menuIds: string[]) => void
  deselectAllMenus: () => void
  toggleMenuSelection: (menuId: string) => void
  
  // View preferences
  setViewMode: (mode: 'grid' | 'list' | 'table') => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Filter panel
  openFilterPanel: () => void
  closeFilterPanel: () => void
  toggleFilterPanel: () => void
  
  // Search focus
  setSearchFocused: (focused: boolean) => void
  
  // Notifications
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Utility actions
  resetUI: () => void
  closeAllModals: () => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  // Modal states
  isMenuFormOpen: false,
  isMenuDetailsOpen: false,
  isDeleteMenuOpen: false,
  isBulkDeleteOpen: false,
  isRecipeFormOpen: false,
  
  // Selected items
  selectedMenuIds: [],
  
  // Form states
  editingMenuId: null,
  editingRecipeId: null,
  
  // View preferences
  viewMode: 'grid',
  sidebarCollapsed: false,
  
  // Search and filter UI
  isFilterPanelOpen: false,
  searchFocused: false,
  
  // Notifications
  notifications: []
}

export const useMenuUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Modal actions
      openMenuForm: (editingId) => set({ 
        isMenuFormOpen: true,
        editingMenuId: editingId || null
      }),
      
      closeMenuForm: () => set({ 
        isMenuFormOpen: false,
        editingMenuId: null
      }),
      
      openMenuDetails: (menuId) => set({ 
        isMenuDetailsOpen: true,
        editingMenuId: menuId
      }),
      
      closeMenuDetails: () => set({ 
        isMenuDetailsOpen: false,
        editingMenuId: null
      }),
      
      openDeleteMenu: (menuId) => set({ 
        isDeleteMenuOpen: true,
        editingMenuId: menuId
      }),
      
      closeDeleteMenu: () => set({ 
        isDeleteMenuOpen: false,
        editingMenuId: null
      }),
      
      openBulkDelete: () => {
        const { selectedMenuIds } = get()
        if (selectedMenuIds.length > 0) {
          set({ isBulkDeleteOpen: true })
        }
      },
      
      closeBulkDelete: () => set({ isBulkDeleteOpen: false }),
      
      openRecipeForm: (editingId) => set({ 
        isRecipeFormOpen: true,
        editingRecipeId: editingId || null
      }),
      
      closeRecipeForm: () => set({ 
        isRecipeFormOpen: false,
        editingRecipeId: null
      }),
      
      // Selection actions
      selectMenu: (menuId) => set(state => ({
        selectedMenuIds: state.selectedMenuIds.includes(menuId)
          ? state.selectedMenuIds
          : [...state.selectedMenuIds, menuId]
      })),
      
      deselectMenu: (menuId) => set(state => ({
        selectedMenuIds: state.selectedMenuIds.filter(id => id !== menuId)
      })),
      
      selectAllMenus: (menuIds) => set({ selectedMenuIds: menuIds }),
      
      deselectAllMenus: () => set({ selectedMenuIds: [] }),
      
      toggleMenuSelection: (menuId) => {
        const { selectedMenuIds } = get()
        if (selectedMenuIds.includes(menuId)) {
          get().deselectMenu(menuId)
        } else {
          get().selectMenu(menuId)
        }
      },
      
      // View preferences
      setViewMode: (mode) => set({ viewMode: mode }),
      
      toggleSidebar: () => set(state => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Filter panel
      openFilterPanel: () => set({ isFilterPanelOpen: true }),
      closeFilterPanel: () => set({ isFilterPanelOpen: false }),
      toggleFilterPanel: () => set(state => ({ 
        isFilterPanelOpen: !state.isFilterPanelOpen 
      })),
      
      // Search focus
      setSearchFocused: (focused) => set({ searchFocused: focused }),
      
      // Notifications
      addNotification: (notification) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const newNotification = {
          id,
          duration: 5000,
          ...notification
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto-remove notification after duration
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
      },
      
      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // Utility actions
      resetUI: () => set(initialState),
      
      closeAllModals: () => set({
        isMenuFormOpen: false,
        isMenuDetailsOpen: false,
        isDeleteMenuOpen: false,
        isBulkDeleteOpen: false,
        isRecipeFormOpen: false,
        editingMenuId: null,
        editingRecipeId: null
      })
    }),
    {
      name: 'menu-ui-store',
      skipHydration: true
    }
  )
)