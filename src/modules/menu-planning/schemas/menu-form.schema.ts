import { z } from 'zod'

// Menu form validation schema
export const menuFormSchema = z.object({
  name: z.string()
    .min(1, 'Menu name is required')
    .min(3, 'Menu name must be at least 3 characters')
    .max(100, 'Menu name must be less than 100 characters'),
  
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  targetLevel: z.enum(['TK', 'SD', 'SMP', 'SMA'], {
    message: 'Target education level is required'
  }),
  
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'], {
    message: 'Meal type is required'
  }),
  
  status: z.enum(['DRAFT', 'APPROVED', 'ACTIVE', 'INACTIVE']).default('DRAFT'),
  
  servingDate: z.date({
    message: 'Serving date is required'
  }),
  
  recipeIds: z.array(z.string().uuid())
    .min(1, 'At least one recipe is required')
    .max(10, 'Maximum 10 recipes allowed per menu'),

  // Optional calculated fields that will be set programmatically
  costPerPortion: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  calcium: z.number().min(0).optional(),
  iron: z.number().min(0).optional()
})

// Recipe selection schema
export const recipeSelectionSchema = z.object({
  recipeIds: z.array(z.string().uuid())
    .min(1, 'At least one recipe must be selected')
    .max(15, 'Maximum 15 recipes allowed per menu')
})

// Menu filter schema
export const menuFilterSchema = z.object({
  search: z.string().optional(),
  targetLevel: z.enum(['TK', 'SD', 'SMP', 'SMA']).optional(),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'ACTIVE', 'INACTIVE']).optional(),
  minCost: z.number().min(0).optional(),
  maxCost: z.number().min(0).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional()
})

// Export inferred types
export type MenuFormData = z.infer<typeof menuFormSchema>
export type RecipeSelectionData = z.infer<typeof recipeSelectionSchema>
export type MenuFilterData = z.infer<typeof menuFilterSchema>