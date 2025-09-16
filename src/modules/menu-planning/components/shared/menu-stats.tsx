import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Users, DollarSign, Clock } from "lucide-react"

interface MenuStatsProps {
  stats: {
    total: number
    byStatus: Record<string, number>
    avgCost: number
    totalCost: number
  }
  isLoading?: boolean
  className?: string
}

export function MenuStats({ stats, isLoading = false, className }: MenuStatsProps) {
  const formatCurrency = (amount: number) => {
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`
  }

  const statsCards = [
    {
      title: "Total Menus",
      value: isLoading ? '...' : stats.total.toString(),
      description: "Across all education levels",
      icon: UtensilsCrossed,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Active Menus", 
      value: isLoading ? '...' : (stats.byStatus.ACTIVE || 0).toString(),
      description: "Currently being served",
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Avg Cost",
      value: isLoading ? '...' : formatCurrency(stats.avgCost || 0),
      description: "Cost per portion",
      icon: DollarSign,
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Draft Menus",
      value: isLoading ? '...' : (stats.byStatus.DRAFT || 0).toString(),
      description: "Pending approval",
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400"
    }
  ]

  return (
    <div className={`grid gap-4 md:grid-cols-4 ${className}`}>
      {statsCards.map((card) => {
        const IconComponent = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <IconComponent className={`h-4 w-4 text-muted-foreground ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}