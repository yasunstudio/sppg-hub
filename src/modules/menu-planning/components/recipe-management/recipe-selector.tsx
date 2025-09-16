'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, X, ChefHat, Clock, Users, Target, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RecipeWithDetails } from '@/modules/recipe-management/services/recipe.service'
import { getAvailableMenusForRecipes, convertMenuToRecipe } from '../../actions/recipe-selection.actions'
import { useSession } from 'next-auth/react'

const CATEGORY_LABELS = {
  BREAKFAST: 'Sarapan',
  LUNCH: 'Makan Siang', 
  DINNER: 'Makan Malam',
  SNACK: 'Camilan'
}

const DIFFICULTY_COLORS = {
  EASY: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  MEDIUM: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  HARD: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
}

interface RecipeSelectorProps {
  selectedRecipes: RecipeWithDetails[]
  onRecipeSelect: (recipe: RecipeWithDetails) => void
  onRecipeRemove: (recipeId: string) => void
  targetLevel?: 'TK' | 'SD' | 'SMP' | 'SMA'
  maxSelections?: number
  sppgId: string
  excludeMenuIds?: string[]
}

interface AvailableRecipe {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  prepTime: number
  servingSize: number
  targetLevel: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    calcium: number
    iron: number
  }
  estimatedCost: number
  menu: {
    id: string
    name: string
    sppgId: string
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    fiber: number | null
    calcium: number | null
    iron: number | null
    costPerPortion: number | null
  }
}

export function RecipeSelector({
  selectedRecipes,
  onRecipeSelect,
  onRecipeRemove,
  targetLevel = 'SD',
  maxSelections = 10,
  sppgId,
  excludeMenuIds = []
}: RecipeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [availableRecipes, setAvailableRecipes] = useState<AvailableRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  // Fetch available menus for recipe selection
  useEffect(() => {
    async function fetchAvailableRecipes() {
      if (!session?.user || !sppgId) return

      setLoading(true)
      setError(null)

      try {
        const result = await getAvailableMenusForRecipes(sppgId, {
          targetLevel,
          category: selectedCategory as any,
          excludeMenuIds,
          limit: 50
        })

        if (result.success && result.data) {
          const convertedRecipes = await Promise.all(
            result.data.map(menu => convertMenuToRecipe(menu))
          )
          setAvailableRecipes(convertedRecipes)
        } else {
          setError(result.error || 'Failed to fetch available recipes')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error fetching recipes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableRecipes()
  }, [session, sppgId, targetLevel, selectedCategory, excludeMenuIds])

  // Filter recipes berdasarkan search query
  const filteredRecipes = availableRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    const notSelected = !selectedRecipes.find(selected => selected.id === recipe.id)
    
    return matchesSearch && notSelected
  })

  const handleRecipeSelect = (recipe: AvailableRecipe) => {
    if (selectedRecipes.length >= maxSelections) {
      return
    }
    
    // Convert available recipe to RecipeWithDetails format
    const recipeWithDetails: RecipeWithDetails = {
      id: recipe.id,
      menuId: recipe.menu.id,
      instructions: recipe.description, // Using description as instructions
      prepTime: recipe.prepTime,
      cookTime: recipe.prepTime,
      servingSize: recipe.servingSize,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: [], // Empty for now as we're selecting from existing menus
      menu: recipe.menu
    }
    
    onRecipeSelect(recipeWithDetails)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari resep berdasarkan nama atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
          >
            Semua Kategori
          </Button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === key ? '' : key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Resep Tersedia ({filteredRecipes.length})
            </CardTitle>
            <CardDescription>
              Pilih resep yang sesuai untuk tingkat {targetLevel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Memuat resep...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecipes.map((recipe) => (
                    <Card key={recipe.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{recipe.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {recipe.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRecipeSelect(recipe)}
                            disabled={selectedRecipes.length >= maxSelections}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.prepTime}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.servingSize} porsi
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {recipe.nutrition.calories} kcal
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {CATEGORY_LABELS[recipe.category as keyof typeof CATEGORY_LABELS] || recipe.category}
                            </Badge>
                            <Badge 
                              className={DIFFICULTY_COLORS[recipe.difficulty as keyof typeof DIFFICULTY_COLORS]}
                            >
                              {recipe.difficulty}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">
                            Rp {recipe.estimatedCost.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {!loading && filteredRecipes.length === 0 && (
                    <div className="text-center py-8">
                      <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Tidak Ada Resep Ditemukan
                      </h3>
                      <p className="text-muted-foreground">
                        {availableRecipes.length === 0 
                          ? 'Belum ada menu yang tersedia sebagai resep'
                          : 'Coba ubah kata kunci pencarian atau filter kategori'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resep Terpilih ({selectedRecipes.length}/{maxSelections})
              </span>
            </CardTitle>
            <CardDescription>
              Resep yang akan digunakan dalam menu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {selectedRecipes.map((recipe) => (
                  <Card key={recipe.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{recipe.menu?.name || 'Unnamed Recipe'}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {recipe.instructions}
                        </p>
                        {recipe.menu && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span>{recipe.menu.calories} kcal</span>
                            <span>{recipe.menu.protein}g protein</span>
                            <span>Rp {recipe.menu.costPerPortion?.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRecipeRemove(recipe.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {selectedRecipes.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum Ada Resep Dipilih
                    </h3>
                    <p className="text-muted-foreground">
                      Pilih resep dari daftar sebelah kiri untuk memulai
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {selectedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Nutrisi</CardTitle>
            <CardDescription>
              Total nutrisi dari {selectedRecipes.length} resep terpilih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedRecipes.reduce((sum, recipe) => sum + (recipe.menu?.calories || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Kalori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedRecipes.reduce((sum, recipe) => sum + (recipe.menu?.protein || 0), 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Total Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedRecipes.reduce((sum, recipe) => sum + (recipe.menu?.carbs || 0), 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Total Karbohidrat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  Rp {selectedRecipes.reduce((sum, recipe) => sum + (recipe.menu?.costPerPortion || 0), 0).toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-muted-foreground">Estimasi Biaya</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}