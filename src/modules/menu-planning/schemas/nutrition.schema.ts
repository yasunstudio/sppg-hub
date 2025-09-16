import { z } from 'zod'

// Base nutrition schema
export const nutritionSchema = z.object({
  calories: z.number()
    .min(0, 'Calories cannot be negative')
    .max(3000, 'Calories seems too high'),
  protein: z.number()
    .min(0, 'Protein cannot be negative')
    .max(200, 'Protein seems too high'),
  carbs: z.number()
    .min(0, 'Carbs cannot be negative')
    .max(500, 'Carbs seems too high'),
  fat: z.number()
    .min(0, 'Fat cannot be negative')
    .max(150, 'Fat seems too high'),
  fiber: z.number()
    .min(0, 'Fiber cannot be negative')
    .max(100, 'Fiber seems too high'),
  sodium: z.number()
    .min(0, 'Sodium cannot be negative')
    .max(5000, 'Sodium seems too high')
    .optional(),
  calcium: z.number()
    .min(0, 'Calcium cannot be negative')
    .optional(),
  iron: z.number()
    .min(0, 'Iron cannot be negative')
    .optional(),
  vitaminA: z.number()
    .min(0, 'Vitamin A cannot be negative')
    .optional(),
  vitaminC: z.number()
    .min(0, 'Vitamin C cannot be negative')
    .optional(),
})

// AKG requirements schema
export const akgRequirementsSchema = z.object({
  calories: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  protein: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  carbs: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  fat: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  fiber: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }),
  sodium: z.object({
    min: z.number().min(0),
    max: z.number().min(0)
  }).optional()
})

// Nutrition calculation input schema
export const nutritionCalculationInputSchema = z.object({
  ingredientId: z.string().uuid('Invalid ingredient ID'),
  quantity: z.number()
    .min(0.1, 'Quantity must be at least 0.1')
    .max(10000, 'Quantity seems too high'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit name too long'),
  nutritionPer100g: nutritionSchema
})

// Nutrition filter schema
export const nutritionFilterSchema = z.object({
  minCalories: z.number().min(0).optional(),
  maxCalories: z.number().min(0).optional(),
  minProtein: z.number().min(0).optional(),
  maxProtein: z.number().min(0).optional(),
  minCarbs: z.number().min(0).optional(),
  maxCarbs: z.number().min(0).optional(),
  minFat: z.number().min(0).optional(),
  maxFat: z.number().min(0).optional(),
  minFiber: z.number().min(0).optional(),
  maxFiber: z.number().min(0).optional()
}).refine(data => {
  // Validate min/max pairs
  if (data.minCalories && data.maxCalories && data.minCalories > data.maxCalories) {
    return false
  }
  if (data.minProtein && data.maxProtein && data.minProtein > data.maxProtein) {
    return false
  }
  if (data.minCarbs && data.maxCarbs && data.minCarbs > data.maxCarbs) {
    return false
  }
  if (data.minFat && data.maxFat && data.minFat > data.maxFat) {
    return false
  }
  if (data.minFiber && data.maxFiber && data.minFiber > data.maxFiber) {
    return false
  }
  return true
}, {
  message: 'Minimum values cannot be greater than maximum values'
})

// Types derived from schemas
export type NutritionData = z.infer<typeof nutritionSchema>
export type AKGRequirements = z.infer<typeof akgRequirementsSchema>
export type NutritionCalculationInput = z.infer<typeof nutritionCalculationInputSchema>
export type NutritionFilter = z.infer<typeof nutritionFilterSchema>