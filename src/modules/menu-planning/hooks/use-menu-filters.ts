import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from './use-debounced-search'
import type { MenuFilters } from '../types'

interface UseMenuFiltersOptions {
  defaultFilters?: Partial<MenuFilters>
  debounceMs?: number
}

/**
 * Hook for managing menu filters with debounced search
 */
export const useMenuFilters = (options: UseMenuFiltersOptions = {}) => {
  const { defaultFilters = {}, debounceMs = 300 } = options
  
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters)
  const [searchQuery, setSearchQuery] = useState(defaultFilters.search || '')
  
  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, debounceMs)
  
  // Update filters when debounced search changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch || undefined
    }))
  }, [debouncedSearch])
  
  // Filter update handlers
  const updateFilter = <K extends keyof MenuFilters>(
    key: K,
    value: MenuFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }
  
  const removeFilter = (key: keyof MenuFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }
  
  const clearAllFilters = () => {
    setFilters({})
    setSearchQuery('')
  }
  
  const resetToDefault = () => {
    setFilters(defaultFilters)
    setSearchQuery(defaultFilters.search || '')
  }
  
  // Computed values
  const hasActiveFilters = useMemo(() => {
    const filterKeys = Object.keys(filters) as (keyof MenuFilters)[]
    return filterKeys.some(key => {
      const value = filters[key]
      return value !== undefined && value !== '' && value !== null
    })
  }, [filters])
  
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length
  }, [filters])
  
  // Specific filter handlers
  const setTargetLevel = (level: string | undefined) => {
    updateFilter('targetLevel', level as MenuFilters['targetLevel'])
  }
  
  const setStatus = (status: string | undefined) => {
    updateFilter('status', status as MenuFilters['status'])
  }
  
  const setCostRange = (min?: number, max?: number) => {
    if (min !== undefined) updateFilter('minCost', min)
    if (max !== undefined) updateFilter('maxCost', max)
    if (min === undefined) removeFilter('minCost')
    if (max === undefined) removeFilter('maxCost')
  }
  
  const setDateRange = (after?: Date, before?: Date) => {
    if (after !== undefined) updateFilter('createdAfter', after)
    if (before !== undefined) updateFilter('createdBefore', before)
    if (after === undefined) removeFilter('createdAfter')
    if (before === undefined) removeFilter('createdBefore')
  }
  
  const setHasRecipes = (hasRecipes?: boolean) => {
    updateFilter('hasRecipes', hasRecipes)
  }
  
  return {
    // Current state
    filters,
    searchQuery,
    debouncedSearch,
    hasActiveFilters,
    activeFilterCount,
    
    // Search handlers
    setSearchQuery,
    
    // Filter handlers
    updateFilter,
    removeFilter,
    clearAllFilters,
    resetToDefault,
    
    // Specific filter setters
    setTargetLevel,
    setStatus,
    setCostRange,
    setDateRange,
    setHasRecipes,
    
    // Raw setters for form binding
    setFilters
  }
}