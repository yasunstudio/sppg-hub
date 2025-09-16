import { z } from 'zod'
import { nutritionSchema } from './nutrition.schema'

// Target levels enum
const targetLevels = ['TK', 'SD', 'SMP', 'SMA'] as const
export const targetLevelSchema = z.enum(targetLevels)

// Menu status enum  
const menuStatuses = ['DRAFT', 'APPROVED', 'ACTIVE', 'INACTIVE'] as const
export const menuStatusSchema = z.enum(menuStatuses)

// Meal type enum - matches database MealType enum
const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const
export const mealTypeSchema = z.enum(mealTypes)

// Recipe ingredient schema for menu
export const menuRecipeIngredientSchema = z.object({
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
    .optional()
})

// Recipe schema for menu
export const menuRecipeSchema = z.object({
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
  ingredients: z.array(menuRecipeIngredientSchema)
    .min(1, 'Recipe must have at least one ingredient')
    .max(50, 'Too many ingredients (max 50)')
})

// Base menu schema
export const menuBaseSchema = z.object({
  name: z.string()
    .min(3, 'Menu name must be at least 3 characters')
    .max(100, 'Menu name too long')
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, 'Menu name contains invalid characters'),
  description: z.string()
    .max(500, 'Description too long')
    .optional(),
  targetLevel: targetLevelSchema,
  mealType: mealTypeSchema,
  status: menuStatusSchema.default('DRAFT')
})

// Menu create schema - flattened nutrition fields to match database
export const menuCreateSchema = menuBaseSchema.extend({
  servingDate: z.date()
    .refine(date => date >= new Date(new Date().setHours(0,0,0,0)), 'Serving date cannot be in the past')
    .optional(),
  costPerPortion: z.number()
    .min(0, 'Cost cannot be negative')
    .max(100000, 'Cost seems too high'),
  // Flattened nutrition fields to match database schema
  calories: z.number()
    .min(0, 'Calories cannot be negative')
    .max(5000, 'Calories seems too high'),
  protein: z.number()
    .min(0, 'Protein cannot be negative')
    .max(500, 'Protein seems too high'),
  carbs: z.number()
    .min(0, 'Carbs cannot be negative')
    .max(1000, 'Carbs seems too high'),
  fat: z.number()
    .min(0, 'Fat cannot be negative')
    .max(500, 'Fat seems too high'),
  fiber: z.number()
    .min(0, 'Fiber cannot be negative')
    .max(100, 'Fiber seems too high'),
  calcium: z.number()
    .min(0, 'Calcium cannot be negative')
    .max(2000, 'Calcium seems too high')
    .optional(),
  iron: z.number()
    .min(0, 'Iron cannot be negative')
    .max(50, 'Iron seems too high')
    .optional(),
  // Time fields from database
  prepTime: z.number()
    .min(1, 'Prep time must be at least 1 minute')
    .max(600, 'Prep time cannot exceed 10 hours')
    .optional(),
  cookTime: z.number()
    .min(0, 'Cook time cannot be negative')
    .max(480, 'Cook time seems too long (max 8 hours)')
    .optional(),
  recipes: z.array(menuRecipeSchema)
    .max(10, 'Too many recipes per menu (max 10)')
    .optional()
})

// Menu update schema
export const menuUpdateSchema = menuCreateSchema.partial()

// Menu filter schema
export const menuFilterSchema = z.object({
  search: z.string()
    .max(100, 'Search term too long')
    .optional(),
  targetLevel: targetLevelSchema.optional(),
  status: menuStatusSchema.optional(),
  minCost: z.number()
    .min(0, 'Minimum cost cannot be negative')
    .optional(),
  maxCost: z.number()
    .min(0, 'Maximum cost cannot be negative')  
    .optional(),
  hasRecipes: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional()
}).refine(data => {
  // Validate min/max cost
  if (data.minCost && data.maxCost && data.minCost > data.maxCost) {
    return false
  }
  // Validate date range
  if (data.createdAfter && data.createdBefore && data.createdAfter > data.createdBefore) {
    return false
  }
  return true
}, {
  message: 'Invalid filter values: minimum cannot be greater than maximum'
})

// Menu pagination schema
export const menuPaginationSchema = z.object({
  page: z.number()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  sortBy: z.enum(['name', 'createdAt', 'costPerPortion'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
})

// Types derived from schemas
export type TargetLevel = z.infer<typeof targetLevelSchema>
export type MenuStatus = z.infer<typeof menuStatusSchema>
export type MealType = z.infer<typeof mealTypeSchema>
export type MenuRecipeIngredientData = z.infer<typeof menuRecipeIngredientSchema>
export type MenuRecipeData = z.infer<typeof menuRecipeSchema>
export type CreateMenuData = z.infer<typeof menuCreateSchema>
export type UpdateMenuData = z.infer<typeof menuUpdateSchema>
export type MenuFilter = z.infer<typeof menuFilterSchema>
export type MenuPagination = z.infer<typeof menuPaginationSchema>