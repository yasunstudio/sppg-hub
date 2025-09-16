import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  searchQuery?: string
  onCreateClick?: () => void
  onClearSearch?: () => void
  showCreateButton?: boolean
  showClearSearch?: boolean
}

export function EmptyState({
  title,
  description,
  searchQuery,
  onCreateClick,
  onClearSearch,
  showCreateButton = true,
  showClearSearch = false
}: EmptyStateProps) {
  const isSearchResult = Boolean(searchQuery)
  
  const defaultTitle = isSearchResult ? "No Menus Found" : "No Menus Yet"
  const defaultDescription = isSearchResult 
    ? `No menus match "${searchQuery}"`
    : "Start by creating your first menu"

  return (
    <Card className="col-span-full">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          {isSearchResult ? (
            <Search className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Plus className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <CardTitle>{title || defaultTitle}</CardTitle>
        <CardDescription>
          {description || defaultDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {showClearSearch && isSearchResult && onClearSearch && (
          <Button variant="outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        )}
        {showCreateButton && onCreateClick && (
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            {isSearchResult ? "Create Menu Instead" : "Create First Menu"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}