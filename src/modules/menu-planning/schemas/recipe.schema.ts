import { z } from 'zod'

// Recipe difficulty levels
const recipeDifficulties = ['EASY', 'MEDIUM', 'HARD'] as const
export const recipeDifficultySchema = z.enum(recipeDifficulties)

// Recipe categories
const recipeCategories = [
  'MAIN_COURSE',
  'SIDE_DISH',
  'SOUP', 
  'DESSERT',
  'SNACK',
  'BEVERAGE'
] as const
export const recipeCategorySchema = z.enum(recipeCategories)

// Recipe ingredient schema
export const recipeIngredientSchema = z.object({
  ingredientId: z.string()
    .uuid('Invalid ingredient ID'),
  quantity: z.number()
    .min(0.1, 'Quantity must be at least 0.1')
    .max(10000, 'Quantity seems too high'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit name too long'),
  notes: z.string()
    .max(200, 'Notes too long')
    .optional(),
  isOptional: z.boolean()
    .default(false)
})

// Base recipe schema
export const recipeBaseSchema = z.object({
  name: z.string()
    .min(3, 'Recipe name must be at least 3 characters')
    .max(100, 'Recipe name too long'),
  description: z.string()
    .max(500, 'Description too long')
    .optional(),
  instructions: z.string()
    .max(2000, 'Instructions too long')
    .optional(),
  prepTime: z.number()
    .min(1, 'Prep time must be at least 1 minute')
    .max(600, 'Prep time cannot exceed 10 hours')
    .optional(),
  cookTime: z.number()
    .min(0, 'Cook time cannot be negative')
    .max(480, 'Cook time seems too long (max 8 hours)')
    .optional(),
  servings: z.number()
    .min(1, 'Servings must be at least 1')
    .max(1000, 'Servings seems too high'),
  category: recipeCategorySchema.optional(),
  difficulty: recipeDifficultySchema
    .default('MEDIUM')
})

// Recipe create schema
export const recipeCreateSchema = recipeBaseSchema.extend({
  ingredients: z.array(recipeIngredientSchema)
    .min(1, 'Recipe must have at least one ingredient')
    .max(50, 'Too many ingredients (max 50)')
})

// Recipe update schema  
export const recipeUpdateSchema = recipeCreateSchema.partial()

// Recipe filter schema
export const recipeFilterSchema = z.object({
  search: z.string()
    .max(100, 'Search term too long')
    .optional(),
  category: recipeCategorySchema.optional(),
  difficulty: recipeDifficultySchema.optional(),
  maxPrepTime: z.number()
    .min(0, 'Prep time cannot be negative')
    .optional(),
  maxCookTime: z.number()
    .min(0, 'Cook time cannot be negative')
    .optional(),
  minServings: z.number()
    .min(1, 'Minimum servings must be at least 1')
    .optional(),
  maxServings: z.number()
    .min(1, 'Maximum servings must be at least 1')
    .optional(),
  hasIngredient: z.array(z.string().uuid())
    .max(10, 'Too many ingredient filters')
    .optional(),
  excludeIngredient: z.array(z.string().uuid())
    .max(10, 'Too many ingredient exclusions')
    .optional()
}).refine(data => {
  // Validate servings range
  if (data.minServings && data.maxServings && data.minServings > data.maxServings) {
    return false
  }
  return true
}, {
  message: 'Minimum servings cannot be greater than maximum servings'
})

// Cost breakdown item schema
export const recipeCostItemSchema = z.object({
  ingredientId: z.string().uuid(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitCost: z.number(),
  totalCost: z.number(),
  percentage: z.number().min(0).max(100)
})

// Recipe cost breakdown schema
export const recipeCostBreakdownSchema = z.object({
  ingredientCosts: z.array(recipeCostItemSchema),
  totalCost: z.number().min(0),
  costPerServing: z.number().min(0)
})

// Types derived from schemas
export type RecipeDifficulty = z.infer<typeof recipeDifficultySchema>
export type RecipeCategory = z.infer<typeof recipeCategorySchema>
export type CreateRecipeIngredientData = z.infer<typeof recipeIngredientSchema>
export type CreateRecipeData = z.infer<typeof recipeCreateSchema>
export type UpdateRecipeData = z.infer<typeof recipeUpdateSchema>
export type RecipeFilter = z.infer<typeof recipeFilterSchema>
export type RecipeCostItem = z.infer<typeof recipeCostItemSchema>
export type RecipeCostBreakdown = z.infer<typeof recipeCostBreakdownSchema>