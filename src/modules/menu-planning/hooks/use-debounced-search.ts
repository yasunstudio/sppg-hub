import { useState, useEffect } from 'react'

/**
 * Hook for debouncing values with configurable delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the timeout if value changes (cleanup)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook specifically for debounced search with additional search utilities
 */
export function useDebouncedSearch(initialValue = '', delay = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isSearching, setIsSearching] = useState(false)
  
  const debouncedSearchTerm = useDebounce(searchTerm, delay)
  
  useEffect(() => {
    // Set searching state when term changes
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [searchTerm, debouncedSearchTerm])
  
  const clearSearch = () => {
    setSearchTerm('')
  }
  
  const isActive = debouncedSearchTerm.length > 0
  
  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    isActive,
    setSearchTerm,
    clearSearch
  }
}

/**
 * Hook for search with history and suggestions
 */
export function useSearchWithHistory(key = 'search-history', maxHistory = 10) {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  })
  
  const addToHistory = (term: string) => {
    if (!term.trim() || term.length < 2) return
    
    setHistory(prev => {
      const filtered = prev.filter(item => item !== term)
      const updated = [term, ...filtered].slice(0, maxHistory)
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(updated))
        } catch {
          // Ignore localStorage errors
        }
      }
      
      return updated
    })
  }
  
  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch {
        // Ignore localStorage errors
      }
    }
  }
  
  const removeFromHistory = (term: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item !== term)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(updated))
        } catch {
          // Ignore localStorage errors
        }
      }
      return updated
    })
  }
  
  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}