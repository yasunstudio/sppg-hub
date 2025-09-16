import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  showAction?: boolean
  isLoading?: boolean
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actionLabel = "Add New",
  onAction,
  showAction = true,
  isLoading = false,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {children}
        {showAction && onAction && (
          <Button onClick={onAction} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}