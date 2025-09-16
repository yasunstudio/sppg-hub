'use client'

import { useState } from 'react'
import { ArrowLeft, Edit, Copy, Trash2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import type { MenuWithRelations } from '../../types/menu.types'

interface MenuDetailsViewProps {
  menu: MenuWithRelations
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onBack?: () => void
}

export function MenuDetailsView({
  menu,
  onEdit,
  onDelete,
  onDuplicate,
  onBack
}: MenuDetailsViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <>
      {/* Header */}
      <div className="bg-background border-b -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menus
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold">{menu.name}</h1>
                  <Badge variant={menu.status === 'APPROVED' ? 'default' : 'secondary'}>
                    {menu.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {menu.description || 'No description provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDuplicate}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Target Level</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{menu.targetLevel}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Serving Date</div>
                      <div>{new Date(menu.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Recipe Count</div>
                      <div>{menu.recipes?.length || 0} recipes</div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Menu Type</div>
                      <div>Daily Menu</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status & Approval</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Current Status</div>
                      <Badge variant={menu.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {menu.status}
                      </Badge>
                    </div>
                    
                    {menu.approvedBy && (
                      <div className="grid gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Approved By</div>
                        <div>{menu.approvedBy}</div>
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Created</div>
                      <div>{new Date(menu.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                      <div>{new Date(menu.updatedAt).toLocaleDateString('id-ID')}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recipes Tab */}
            <TabsContent value="recipes">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Recipes</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    List of recipes included in this menu
                  </p>
                </CardHeader>
                <CardContent>
                  {menu.recipes && menu.recipes.length > 0 ? (
                    <div className="grid gap-4">
                      {menu.recipes.map((recipe, index) => (
                        <Card key={recipe.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">Recipe {index + 1}</h4>
                              <p className="text-sm text-muted-foreground">
                                Serving size: {recipe.servingSize}g
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Prep: {recipe.prepTime}min • Cook: {recipe.cookTime || 0}min
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Recipe
                            </Button>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">{recipe.instructions}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No recipes added to this menu yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    AKG compliance and nutritional breakdown
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Nutrition analysis will be available when recipes are added.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Production Tab */}
            <TabsContent value="production">
              <Card>
                <CardHeader>
                  <CardTitle>Production Planning</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ingredient requirements and production schedule
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Production planning features coming in Phase 3.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </>
  )
}