"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MenuForm } from "@/modules/menu-planning";
import { toast } from "sonner";

export default function CreateMenuPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get sppgId from session - you may need to adjust this based on your auth structure
  const sppgId = session?.user?.sppgId || 'default-sppg-id';

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsSubmitting(true);
      console.log("Form data received:", data);

      // Convert form data to API format
      const apiData = {
        name: data.menuName,
        description: data.description || '',
        targetLevel: data.educationLevel,
        mealType: 'LUNCH', // Default to LUNCH for now
        status: 'DRAFT',
        servingDate: data.date ? new Date(data.date as string) : undefined,
        
        // Calculate nutrition from selected recipes
        calories: calculateTotalNutrition(data.selectedRecipes as any[], 'calories'),
        protein: calculateTotalNutrition(data.selectedRecipes as any[], 'protein'),
        carbs: calculateTotalNutrition(data.selectedRecipes as any[], 'carbs'),
        fat: calculateTotalNutrition(data.selectedRecipes as any[], 'fat'),
        fiber: calculateTotalNutrition(data.selectedRecipes as any[], 'fiber'),
        calcium: calculateTotalNutrition(data.selectedRecipes as any[], 'calcium'),
        iron: calculateTotalNutrition(data.selectedRecipes as any[], 'iron'),
        
        // Calculate cost from selected recipes
        costPerPortion: calculateTotalCost(data.selectedRecipes as any[]),
        
        // Time estimates - take max from selected recipes
        prepTime: calculateMaxTime(data.selectedRecipes as any[], 'prepTime'),
        cookTime: calculateMaxTime(data.selectedRecipes as any[], 'cookTime'),
        
        // Include recipes data if needed by service
        recipes: (data.selectedRecipes as any[])?.map(recipe => ({
          name: recipe.menu?.name || 'Recipe',
          instructions: recipe.instructions || '',
          prepTime: recipe.prepTime || 30,
          cookTime: recipe.cookTime || 30,
          servings: data.servingCount || 1
        }))
      };

      console.log("API data to send:", apiData);

      const response = await fetch("/api/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        console.error("Response status:", response.status);
        console.error("Response statusText:", response.statusText);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const createdMenu = await response.json();

      // TODO: Add success notification
      toast.success(`Menu "${createdMenu.name}" created successfully`, {
        description: "The menu has been saved and is ready for use.",
      });

      // Success redirect to menu details or list
      router.push("/menus");
    } catch (error) {
      console.error("Failed to create menu:", error);
      // TODO: Add error notification
      toast.error("Failed to create menu", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for calculations
  const calculateTotalNutrition = (recipes: any[], field: string): number => {
    if (!recipes || recipes.length === 0) return 0;
    return recipes.reduce((total, recipe) => {
      const value = recipe.menu?.[field] || 0;
      return total + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  const calculateTotalCost = (recipes: any[]): number => {
    if (!recipes || recipes.length === 0) return 0;
    return recipes.reduce((total, recipe) => {
      const cost = recipe.menu?.costPerPortion || 0;
      return total + (typeof cost === 'number' ? cost : 0);
    }, 0);
  };

  const calculateMaxTime = (recipes: any[], field: string): number => {
    if (!recipes || recipes.length === 0) return 30; // default
    return Math.max(...recipes.map(recipe => recipe[field] || 30));
  };

  const handleBack = () => {
    router.push("/menus");
  };

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
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menus
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-semibold">Create Menu</h1>
                <p className="text-sm text-muted-foreground">
                  Create comprehensive menus with recipe selection and nutrition
                  analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? "Edit Mode" : "Preview"}
              </Button>

              <Button
                type="submit"
                form="menu-form"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Menu"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-none">
        <CardHeader>
          <CardTitle>Menu Details & Recipe Selection</CardTitle>
          <p className="text-muted-foreground">
            Use this comprehensive interface to create detailed menus with
            automatic nutrition analysis and AKG compliance checking.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <MenuForm
            onSubmit={handleSubmit}
            formId="menu-form"
            isPreviewMode={isPreviewMode}
            isLoading={isSubmitting}
            sppgId={sppgId}
          />
        </CardContent>
      </Card>
    </>
  );
}
