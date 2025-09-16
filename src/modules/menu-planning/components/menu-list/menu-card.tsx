import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, MoreHorizontal, Loader2, Copy, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { MenuWithRelations } from '../../types'
import { TARGET_LEVEL_NAMES, MENU_STATUS_NAMES, STATUS_COLORS } from '../../utils/constants'

interface MenuCardProps {
  menu: MenuWithRelations
  onViewDetails?: (menu: MenuWithRelations) => void
  onEdit?: (menu: MenuWithRelations) => void
  onDelete?: (menu: MenuWithRelations) => void
  onDuplicate?: (menu: MenuWithRelations) => void
  isLoading?: boolean
  loadingOperation?: 'delete' | 'duplicate' | 'edit'
  className?: string
}

export function MenuCard({
  menu,
  onViewDetails,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false,
  loadingOperation,
  className
}: MenuCardProps) {
  const statusConfig = STATUS_COLORS[menu.status as keyof typeof STATUS_COLORS]
  const levelName = TARGET_LEVEL_NAMES[menu.targetLevel as keyof typeof TARGET_LEVEL_NAMES]
  const statusName = MENU_STATUS_NAMES[menu.status as keyof typeof MENU_STATUS_NAMES]

  return (
    <Card className={`hover:shadow-md transition-shadow ${isLoading ? 'opacity-50' : ''} ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1" title={menu.name}>
              {menu.name}
            </CardTitle>
            <CardDescription className="line-clamp-2" title={menu.description || ''}>
              {menu.description || 'No description'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge 
              variant="outline"
              className={`${statusConfig?.bg} ${statusConfig?.text} ${statusConfig?.border} shrink-0`}
            >
              {statusName}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onViewDetails && (
                  <DropdownMenuItem 
                    onClick={() => onViewDetails(menu)}
                    disabled={isLoading}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem 
                    onClick={() => onEdit(menu)}
                    disabled={isLoading || loadingOperation === 'edit'}
                  >
                    {loadingOperation === 'edit' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="mr-2 h-4 w-4" />
                    )}
                    {loadingOperation === 'edit' ? 'Editing...' : 'Edit Menu'}
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem 
                    onClick={() => onDuplicate(menu)}
                    disabled={isLoading || loadingOperation === 'duplicate'}
                  >
                    {loadingOperation === 'duplicate' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {loadingOperation === 'duplicate' ? 'Duplicating...' : 'Duplicate'}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(menu)}
                      className="text-destructive focus:text-destructive"
                      disabled={isLoading || loadingOperation === 'delete'}
                    >
                      {loadingOperation === 'delete' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      {loadingOperation === 'delete' ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target Level:</span>
            <Badge variant="secondary">
              {levelName}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cost per Portion:</span>
            <span className="font-medium">
              Rp {(menu.costPerPortion || 0).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Calories:</span>
            <span className="font-medium">
              {Math.round(menu.calories || 0)} kkal
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recipes:</span>
            <span className="font-medium">
              {menu.recipes?.length || 0} items
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(menu)}
            disabled={isLoading}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit?.(menu)}
            disabled={isLoading}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}