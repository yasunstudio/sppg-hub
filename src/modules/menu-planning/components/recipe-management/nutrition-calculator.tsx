'use client'

import { useMemo } from 'react'
import { TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RecipeService } from '@/modules/recipe-management/services/recipe.service'
import type { RecipeWithDetails } from '@/modules/recipe-management/services/recipe.service'

interface NutritionCalculatorProps {
  selectedRecipes: RecipeWithDetails[]
  targetLevel: 'TK' | 'SD' | 'SMP' | 'SMA'
  servingCount: number
  className?: string
}

// AKG (Angka Kecukupan Gizi) standards by education level
const AKG_STANDARDS = {
  TK: {
    calories: 1350, // 30% dari 1800 kcal/hari untuk usia 4-6 tahun
    protein: 18,    // 30% dari 35g/hari
    calcium: 300,   // 30% dari 1000mg/hari
    iron: 3,        // 30% dari 10mg/hari
  },
  SD: {
    calories: 1800, // 30% dari 2100 kcal/hari untuk usia 7-12 tahun
    protein: 22,    // 30% dari 49g/hari
    calcium: 350,   // 30% dari 1200mg/hari
    iron: 4,        // 30% dari 13mg/hari
  },
  SMP: {
    calories: 2100, // 30% dari 2475 kcal/hari untuk usia 13-15 tahun
    protein: 26,    // 30% dari 72g/hari
    calcium: 400,   // 30% dari 1200mg/hari
    iron: 6,        // 30% dari 19mg/hari (rata-rata laki-laki/perempuan)
  },
  SMA: {
    calories: 2400, // 30% dari 2800 kcal/hari untuk usia 16-18 tahun
    protein: 30,    // 30% dari 98g/hari
    calcium: 400,   // 30% dari 1200mg/hari
    iron: 7,        // 30% dari 23mg/hari (rata-rata laki-laki/perempuan)
  }
}

export function NutritionCalculator({
  selectedRecipes,
  targetLevel,
  servingCount,
  className = ''
}: NutritionCalculatorProps) {
  // Calculate total nutrition
  const totalNutrition = useMemo(() => {
    return selectedRecipes.reduce(
      (total, recipe) => ({
        calories: total.calories + (recipe.menu.calories || 0),
        protein: total.protein + (recipe.menu.protein || 0),
        carbs: total.carbs + (recipe.menu.carbs || 0),
        fat: total.fat + (recipe.menu.fat || 0),
        fiber: total.fiber + (recipe.menu.fiber || 0),
        calcium: total.calcium + (recipe.menu.calcium || 0),
        iron: total.iron + (recipe.menu.iron || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, calcium: 0, iron: 0 }
    )
  }, [selectedRecipes])

  // Calculate total cost
  const totalCost = useMemo(() => {
    return selectedRecipes.reduce((total, recipe) => {
      return total + (recipe.menu.costPerPortion || 0)
    }, 0) * servingCount
  }, [selectedRecipes, servingCount])

  // Get AKG standards for target level
  const akgStandard = AKG_STANDARDS[targetLevel]

  // Calculate AKG compliance percentages
  const compliance = {
    calories: Math.round((totalNutrition.calories / akgStandard.calories) * 100),
    protein: Math.round((totalNutrition.protein / akgStandard.protein) * 100),
    calcium: Math.round((totalNutrition.calcium / akgStandard.calcium) * 100),
    iron: Math.round((totalNutrition.iron / akgStandard.iron) * 100),
  }

  // Determine compliance status
  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'excellent' // Ideal range
    if (percentage >= 80 && percentage <= 120) return 'good'      // Acceptable range
    if (percentage < 80) return 'low'                              // Below standard
    return 'high'                                                  // Above standard
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      case 'good':
        return <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'high':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      case 'good': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'low': return 'bg-red-50 dark:bg-red-950/20 text-destructive/80 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'high': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      default: return 'bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nutrition Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Ringkasan Nutrisi
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Per porsi untuk tingkat {targetLevel}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Kalori</span>
                <span className="font-semibold">
                  {totalNutrition.calories.toFixed(0)} kcal
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Protein</span>
                <span className="font-semibold">
                  {totalNutrition.protein.toFixed(1)} g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Karbohidrat</span>
                <span className="font-semibold">
                  {totalNutrition.carbs.toFixed(1)} g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lemak</span>
                <span className="font-semibold">
                  {totalNutrition.fat.toFixed(1)} g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Serat</span>
                <span className="font-semibold">
                  {totalNutrition.fiber.toFixed(1)} g
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Analisis Biaya
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total untuk {servingCount} porsi
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                Rp {totalCost.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-muted-foreground">
                Rp {(totalCost / servingCount).toLocaleString('id-ID')} per porsi
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Biaya per gram protein:</span>
                <span>Rp {(totalCost / servingCount / totalNutrition.protein).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya per 100 kcal:</span>
                <span>Rp {(totalCost / servingCount / totalNutrition.calories * 100).toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AKG Compliance */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Kesesuaian AKG (Angka Kecukupan Gizi)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Standar untuk tingkat pendidikan {targetLevel}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getComplianceStatus(compliance.calories))}
                <span className="font-medium">Kalori</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  className={getStatusColor(getComplianceStatus(compliance.calories))}
                  variant="outline"
                >
                  {compliance.calories}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {totalNutrition.calories.toFixed(0)} / {akgStandard.calories} kcal
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(compliance.calories, 120)} 
              className="h-2"
            />
          </div>

          {/* Protein */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getComplianceStatus(compliance.protein))}
                <span className="font-medium">Protein</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  className={getStatusColor(getComplianceStatus(compliance.protein))}
                  variant="outline"
                >
                  {compliance.protein}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {totalNutrition.protein.toFixed(1)} / {akgStandard.protein} g
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(compliance.protein, 120)} 
              className="h-2"
            />
          </div>

          {/* Calcium */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getComplianceStatus(compliance.calcium))}
                <span className="font-medium">Kalsium</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  className={getStatusColor(getComplianceStatus(compliance.calcium))}
                  variant="outline"
                >
                  {compliance.calcium}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {totalNutrition.calcium.toFixed(0)} / {akgStandard.calcium} mg
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(compliance.calcium, 120)} 
              className="h-2"
            />
          </div>

          {/* Iron */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getComplianceStatus(compliance.iron))}
                <span className="font-medium">Zat Besi</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  className={getStatusColor(getComplianceStatus(compliance.iron))}
                  variant="outline"
                >
                  {compliance.iron}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {totalNutrition.iron.toFixed(1)} / {akgStandard.iron} mg
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(compliance.iron, 120)} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {selectedRecipes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compliance.calories < 80 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Kalori Kurang</p>
                    <p className="text-sm text-destructive/80">
                      Tambahkan makanan tinggi kalori seperti nasi, roti, atau kacang-kacangan.
                    </p>
                  </div>
                </div>
              )}

              {compliance.protein < 80 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Protein Kurang</p>
                    <p className="text-sm text-destructive/80">
                      Tambahkan sumber protein seperti ayam, ikan, telur, atau tempe.
                    </p>
                  </div>
                </div>
              )}

              {compliance.calcium < 80 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Kalsium Kurang</p>
                    <p className="text-sm text-destructive/80">
                      Tambahkan sumber kalsium seperti susu, keju, atau sayuran hijau.
                    </p>
                  </div>
                </div>
              )}

              {compliance.iron < 80 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Zat Besi Kurang</p>
                    <p className="text-sm text-destructive/80">
                      Tambahkan sumber zat besi seperti daging merah, hati, atau bayam.
                    </p>
                  </div>
                </div>
              )}

              {Object.values(compliance).every(c => c >= 90 && c <= 110) && (
                <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">Menu Seimbang</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Menu sudah memenuhi standar AKG dengan baik. Pertahankan komposisi ini!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}