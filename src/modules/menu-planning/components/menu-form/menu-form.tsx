'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarDays, Users, GraduationCap, ChefHat, Calculator, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecipeSelector } from '../recipe-management/recipe-selector'
import { NutritionCalculator } from '../recipe-management/nutrition-calculator'
import type { RecipeWithDetails } from '@/modules/recipe-management/services/recipe.service'

const menuFormSchema = z.object({
  // Basic info
  menuName: z.string().min(1, 'Nama menu wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  
  // Target info
  educationLevel: z.enum(['TK', 'SD', 'SMP', 'SMA']),
  servingCount: z.number().min(1, 'Jumlah porsi minimal 1').max(1000, 'Jumlah porsi maksimal 1000'),
  
  // Optional fields
  description: z.string().optional(),
  specialDietaryRequirements: z.string().optional(),
  budgetLimit: z.number().optional(),
  
  // Recipe selection
  selectedRecipes: z.array(z.any()).min(1, 'Pilih minimal 1 resep'),
})

type MenuFormData = z.infer<typeof menuFormSchema>

interface MenuFormProps {
  onSubmit: (data: MenuFormData) => void
  isLoading?: boolean
  initialData?: Partial<MenuFormData>
  className?: string
  formId?: string
  isPreviewMode?: boolean
  sppgId: string
  excludeMenuIds?: string[]
}

export function MenuForm({
  onSubmit,
  isLoading = false,
  initialData,
  className = '',
  formId,
  sppgId,
  excludeMenuIds = []
}: MenuFormProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<RecipeWithDetails[]>(
    initialData?.selectedRecipes || []
  )
  const [activeTab, setActiveTab] = useState('basic')

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menuName: '',
      date: new Date().toISOString().split('T')[0], // Today
      educationLevel: 'SD',
      servingCount: 30,
      description: '',
      specialDietaryRequirements: '',
      budgetLimit: undefined,
      selectedRecipes: [],
      ...initialData
    }
  })

  const { watch, setValue } = form
  const educationLevel = watch('educationLevel')
  const servingCount = watch('servingCount')

  // Handle recipe selection
  const handleRecipeSelect = (recipe: RecipeWithDetails) => {
    const updatedRecipes = [...selectedRecipes, recipe]
    setSelectedRecipes(updatedRecipes)
    setValue('selectedRecipes', updatedRecipes)
  }

  const handleRecipeRemove = (recipeId: string) => {
    const updatedRecipes = selectedRecipes.filter(r => r.id !== recipeId)
    setSelectedRecipes(updatedRecipes)
    setValue('selectedRecipes', updatedRecipes)
  }

  // Handle form submission
  const handleSubmit = (data: MenuFormData) => {
    const formData = {
      ...data,
      selectedRecipes
    }
    onSubmit(formData)
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${className}`}>
      <Form {...form}>
        <form 
          id={formId}
          onSubmit={form.handleSubmit(handleSubmit)} 
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Informasi Dasar
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Pilih Resep
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Analisis Gizi
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Informasi Menu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="menuName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Menu</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Menu Bergizi Anak SD - Senin"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Pelaksanaan</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Tingkat Pendidikan
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih tingkat pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TK">Taman Kanak-Kanak (TK)</SelectItem>
                              <SelectItem value="SD">Sekolah Dasar (SD)</SelectItem>
                              <SelectItem value="SMP">Sekolah Menengah Pertama (SMP)</SelectItem>
                              <SelectItem value="SMA">Sekolah Menengah Atas (SMA)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servingCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Jumlah Porsi
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="1"
                              max="1000"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Menu (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsi singkat tentang menu ini..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="specialDietaryRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kebutuhan Diet Khusus (Opsional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Halal, Vegetarian, Bebas Gluten"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batas Anggaran per Porsi (Opsional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="15000"
                              {...field}
                              onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="button"
                  onClick={() => setActiveTab('recipes')}
                  className="flex items-center gap-2"
                >
                  Lanjut: Pilih Resep
                  <ChefHat className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: Recipe Selection */}
            <TabsContent value="recipes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Pilihan Resep
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Pilih resep makanan yang sesuai untuk tingkat {educationLevel} dengan {servingCount} porsi
                  </p>
                </CardHeader>
                <CardContent>
                  <RecipeSelector
                    selectedRecipes={selectedRecipes}
                    onRecipeSelect={handleRecipeSelect}
                    onRecipeRemove={handleRecipeRemove}
                    targetLevel={educationLevel}
                    maxSelections={8}
                    sppgId={sppgId}
                    excludeMenuIds={excludeMenuIds}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('basic')}
                  className="flex items-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  Kembali: Info Dasar
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab('nutrition')}
                  disabled={selectedRecipes.length === 0}
                  className="flex items-center gap-2"
                >
                  Lanjut: Analisis Gizi
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Tab 3: Nutrition Analysis */}
            <TabsContent value="nutrition" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Analisis Gizi & Biaya
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Evaluasi kesesuaian menu dengan standar AKG dan anggaran
                  </p>
                </CardHeader>
                <CardContent>
                  {selectedRecipes.length > 0 ? (
                    <NutritionCalculator
                      selectedRecipes={selectedRecipes}
                      targetLevel={educationLevel}
                      servingCount={servingCount}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Belum Ada Resep Dipilih
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Pilih resep terlebih dahulu untuk melihat analisis gizi
                      </p>
                      <Button 
                        type="button"
                        onClick={() => setActiveTab('recipes')}
                        className="flex items-center gap-2"
                      >
                        <ChefHat className="h-4 w-4" />
                        Pilih Resep
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('recipes')}
                  className="flex items-center gap-2"
                >
                  <ChefHat className="h-4 w-4" />
                  Kembali: Pilih Resep
                </Button>
                
                {selectedRecipes.length > 0 && (
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Menu'}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}