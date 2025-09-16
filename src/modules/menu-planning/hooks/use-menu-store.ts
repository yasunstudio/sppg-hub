import { useMenuStore } from '../stores/menu-store'

/**
 * Hook for menu store with common patterns
 */
export const useMenuStoreHook = () => {
  const store = useMenuStore()
  
  return {
    // State
    menus: store.menus,
    currentMenu: store.currentMenu,
    isLoading: store.isLoading,
    isCreating: store.isCreating,
    isUpdating: store.isUpdating,
    isDeleting: store.isDeleting,
    error: store.error,
    filters: store.filters,
    pagination: store.pagination,
    totalCount: store.totalCount,
    needsRefresh: store.needsRefresh,
    
    // Actions
    fetchMenus: store.fetchMenus,
    fetchMenuById: store.fetchMenuById,
    refreshMenus: store.refreshMenus,
    createMenu: store.createMenu,
    updateMenu: store.updateMenu,
    deleteMenu: store.deleteMenu,
    bulkUpdateStatus: store.bulkUpdateStatus,
    bulkDelete: store.bulkDelete,
    
    // State management
    setCurrentMenu: store.setCurrentMenu,
    setFilters: store.setFilters,
    setPagination: store.setPagination,
    clearError: store.clearError,
    resetState: store.resetState,
    setNeedsRefresh: store.setNeedsRefresh,
    
    // Utility methods
    getMenusByStatus: store.getMenusByStatus,
    getTotalMenusByStatus: store.getTotalMenusByStatus
  }
}