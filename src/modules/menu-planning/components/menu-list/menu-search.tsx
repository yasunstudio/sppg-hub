import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface MenuSearchProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  placeholder?: string
  showFilter?: boolean
  isLoading?: boolean
  className?: string
}

export function MenuSearch({
  value,
  onChange,
  onFilterClick,
  placeholder = "Search menus...",
  showFilter = true,
  isLoading = false,
  className
}: MenuSearchProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          className={`pl-10 ${value ? 'pr-10' : ''} ${
            isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      {showFilter && onFilterClick && (
        <Button variant="outline" onClick={onFilterClick} disabled={isLoading}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      )}
    </div>
  )
}