// Nutrition data structure
export interface NutritionData {
  calories: number
  protein: number        // grams
  carbs: number         // grams
  fat: number           // grams
  fiber: number         // grams
  sodium?: number       // milligrams
  calcium?: number      // milligrams
  iron?: number         // milligrams
  vitaminA?: number     // IU
  vitaminC?: number     // milligrams
}

// AKG (Angka Kecukupan Gizi) per education level
export interface AKGRequirements {
  calories: { min: number; max: number }
  protein: { min: number; max: number }
  carbs: { min: number; max: number }
  fat: { min: number; max: number }
  fiber: { min: number; max: number }
  sodium?: { min: number; max: number }
}

// AKG compliance status
export type ComplianceStatus = 'COMPLIANT' | 'UNDER' | 'OVER' | 'MISSING'

// Nutrition compliance result
export interface NutritionCompliance {
  overall: ComplianceStatus
  details: {
    calories: ComplianceStatus
    protein: ComplianceStatus
    carbs: ComplianceStatus
    fat: ComplianceStatus
    fiber: ComplianceStatus
  }
  percentages: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

// Nutrition calculation input
export interface NutritionCalculationInput {
  ingredientId: string
  quantity: number
  unit: string
  nutritionPer100g: NutritionData
}

// Nutrition stats for dashboard
export interface NutritionStats {
  totalMenus: number
  compliantMenus: number
  complianceRate: number
  avgCalories: number
  avgProtein: number
  avgCost: number
}