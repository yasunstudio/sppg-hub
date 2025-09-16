import type { MenuWithRelations } from '../../types'
import { MenuCard } from './menu-card'
import { LoadingSkeleton } from '../shared/loading-skeleton'
import { EmptyState } from '../shared/empty-state'

interface MenuListViewProps {
  menus: MenuWithRelations[]
  isLoading?: boolean
  searchQuery?: string
  onViewDetails?: (menu: MenuWithRelations) => void
  onEdit?: (menu: MenuWithRelations) => void
  onDelete?: (menu: MenuWithRelations) => void
  onDuplicate?: (menu: MenuWithRelations) => void
  onCreateNew?: () => void
  onClearSearch?: () => void
  loadingOperations?: { [menuId: string]: 'delete' | 'duplicate' | 'edit' }
  className?: string
}

export function MenuListView({
  menus,
  isLoading = false,
  searchQuery,
  onViewDetails,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  onClearSearch,
  loadingOperations = {},
  className
}: MenuListViewProps) {
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton count={6} className={className} />
  }

  // Empty state
  if (menus.length === 0) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        <EmptyState
          searchQuery={searchQuery}
          onCreateClick={onCreateNew}
          onClearSearch={onClearSearch}
          showCreateButton={Boolean(onCreateNew)}
          showClearSearch={Boolean(searchQuery && onClearSearch)}
        />
      </div>
    )
  }

  // Menu list
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {menus.map((menu) => (
        <MenuCard
          key={menu.id}
          menu={menu}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          isLoading={Boolean(loadingOperations[menu.id])}
          loadingOperation={loadingOperations[menu.id]}
        />
      ))}
    </div>
  )
}