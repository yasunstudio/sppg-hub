// Menu Planning Module - Main Export File

// Core types (primary source)
export * from './types'

// Schemas (for validation only, types come from above)
export {
  menuCreateSchema,
  menuUpdateSchema,
  menuFilterSchema,
  menuPaginationSchema,
  nutritionSchema,
  recipeCreateSchema,
  recipeUpdateSchema,
  recipeFilterSchema,
  z
} from './schemas'

// Form schemas - Phase 2
export * from './schemas/menu-form.schema'

// Constants - Phase 2 (already exported from types)
// export * from './constants/enums' // Commented out to avoid conflicts

// Utils - Phase 2  
export * from './utils/menu-calculations'

// Stores
export { useMenuStore } from './stores/menu-store'
export { useMenuUIStore } from './stores/menu-ui-store'

// Hooks
export { useMenuStoreHook } from './hooks/use-menu-store'
export { useMenuFilters } from './hooks/use-menu-filters'
export { useDebounce, useDebouncedSearch, useSearchWithHistory } from './hooks/use-debounced-search'
export { useNutritionCalculator } from './hooks/use-nutrition-calculator'

// Services
export { MenuService } from './services/menu.service'

// Utilities (specific exports to avoid conflicts)
// Constants are already exported from types
// Nutrition helpers are already exported from menu-calculations

// Specific utility exports if needed:
export { 
  calculateMenuNutrition,
  calculateMenuCost,
  calculateServingSize,
  formatNutritionValue,
  calculateNutritionDensity,
  estimateMenuPrepTime,
  generateMenuSummary
} from './utils/menu-calculations'

// Components - Phase 1 Complete
export { MenuCard } from './components/menu-list/menu-card'
export { MenuSearch } from './components/menu-list/menu-search'
export { MenuListView } from './components/menu-list/menu-list-view'
export { LoadingSkeleton } from './components/shared/loading-skeleton'
export { EmptyState } from './components/shared/empty-state'
export { MenuStats } from './components/shared/menu-stats'
export { PageHeader } from './components/shared/page-header'

// Components - Menu Forms
export { MenuForm } from './components/menu-form/menu-form'

// Components - Recipe Management
export { RecipeSelector } from './components/recipe-management/recipe-selector'
export { NutritionCalculator } from './components/recipe-management/nutrition-calculator'

// Components - Menu Details
export { MenuDetailsView } from './components/menu-details/menu-details-view'

/**
 * Module Version and Status
 */
export const MENU_PLANNING_MODULE = {
  version: '1.0.0',
  phase: 'Phase 1 - Foundation Complete',
  status: 'READY_FOR_PHASE_2',
  components: {
    types: '✅ Complete',
    schemas: '✅ Complete', 
    stores: '✅ Complete',
    hooks: '✅ Complete',
    services: '🚧 Placeholder ready',
    utils: '✅ Complete',
    components: '⏳ Phase 2',
    apiIntegration: '⏳ Phase 2'
  }
} as const