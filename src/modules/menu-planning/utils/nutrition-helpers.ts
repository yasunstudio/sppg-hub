import type { TargetLevel, NutritionData, NutritionCompliance, ComplianceStatus } from '../types'
import { AKG_REQUIREMENTS, COMPLIANCE_TOLERANCE } from './constants'

/**
 * Calculate nutrition compliance for a given menu and target level
 */
export function calculateNutritionCompliance(
  nutrition: NutritionData,
  targetLevel: TargetLevel
): NutritionCompliance {
  const requirements = AKG_REQUIREMENTS[targetLevel]
  
  const caloriesStatus = getComplianceStatus(
    nutrition.calories,
    requirements.calories.min,
    requirements.calories.max
  )
  
  const proteinStatus = getComplianceStatus(
    nutrition.protein,
    requirements.protein.min,
    requirements.protein.max
  )
  
  const carbsStatus = getComplianceStatus(
    nutrition.carbs,
    requirements.carbs.min,
    requirements.carbs.max
  )
  
  const fatStatus = getComplianceStatus(
    nutrition.fat,
    requirements.fat.min,
    requirements.fat.max
  )
  
  const fiberStatus = getComplianceStatus(
    nutrition.fiber,
    requirements.fiber.min,
    requirements.fiber.max
  )
  
  // Calculate overall compliance
  const statuses = [caloriesStatus, proteinStatus, carbsStatus, fatStatus, fiberStatus]
  const overallStatus = getOverallComplianceStatus(statuses)
  
  // Calculate percentages of AKG requirements
  const percentages = {
    calories: calculatePercentage(nutrition.calories, requirements.calories.min, requirements.calories.max),
    protein: calculatePercentage(nutrition.protein, requirements.protein.min, requirements.protein.max),
    carbs: calculatePercentage(nutrition.carbs, requirements.carbs.min, requirements.carbs.max),
    fat: calculatePercentage(nutrition.fat, requirements.fat.min, requirements.fat.max),
    fiber: calculatePercentage(nutrition.fiber, requirements.fiber.min, requirements.fiber.max)
  }
  
  return {
    overall: overallStatus,
    details: {
      calories: caloriesStatus,
      protein: proteinStatus,
      carbs: carbsStatus,
      fat: fatStatus,
      fiber: fiberStatus
    },
    percentages
  }
}

/**
 * Get compliance status for a single nutrient
 */
function getComplianceStatus(
  value: number,
  min: number,
  max: number
): ComplianceStatus {
  if (value < min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD) {
    return 'UNDER'
  }
  if (value > max * COMPLIANCE_TOLERANCE.OVER_THRESHOLD) {
    return 'OVER'
  }
  if (value >= min && value <= max) {
    return 'COMPLIANT'
  }
  return 'COMPLIANT' // Within acceptable range
}

/**
 * Calculate overall compliance status from individual statuses
 */
function getOverallComplianceStatus(statuses: ComplianceStatus[]): ComplianceStatus {
  if (statuses.some(status => status === 'UNDER' || status === 'OVER')) {
    return statuses.find(status => status === 'UNDER') ? 'UNDER' : 'OVER'
  }
  if (statuses.every(status => status === 'COMPLIANT')) {
    return 'COMPLIANT'
  }
  return 'COMPLIANT'
}

/**
 * Calculate percentage of nutrient relative to AKG requirement
 */
function calculatePercentage(value: number, min: number, max: number): number {
  const target = (min + max) / 2 // Use midpoint as target
  return Math.round((value / target) * 100)
}

/**
 * Calculate total nutrition from recipe ingredients
 */
export function calculateRecipeNutrition(
  ingredients: Array<{
    quantity: number
    unit: string
    ingredient: {
      nutritionPer100g: NutritionData
    }
  }>
): NutritionData {
  const totalNutrition: NutritionData = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
    calcium: 0,
    iron: 0,
    vitaminA: 0,
    vitaminC: 0
  }
  
  for (const item of ingredients) {
    const multiplier = getUnitMultiplier(item.unit, item.quantity)
    const nutrition = item.ingredient.nutritionPer100g
    
    totalNutrition.calories += nutrition.calories * multiplier
    totalNutrition.protein += nutrition.protein * multiplier
    totalNutrition.carbs += nutrition.carbs * multiplier
    totalNutrition.fat += nutrition.fat * multiplier
    totalNutrition.fiber += nutrition.fiber * multiplier
    
    if (nutrition.sodium) totalNutrition.sodium! += nutrition.sodium * multiplier
    if (nutrition.calcium) totalNutrition.calcium! += nutrition.calcium * multiplier
    if (nutrition.iron) totalNutrition.iron! += nutrition.iron * multiplier
    if (nutrition.vitaminA) totalNutrition.vitaminA! += nutrition.vitaminA * multiplier
    if (nutrition.vitaminC) totalNutrition.vitaminC! += nutrition.vitaminC * multiplier
  }
  
  return totalNutrition
}

/**
 * Get multiplication factor for unit conversion to per-100g basis
 */
function getUnitMultiplier(unit: string, quantity: number): number {
  // Base conversion: quantity represents how many 100g portions
  switch (unit.toLowerCase()) {
    case 'gram':
      return quantity / 100
    case 'kilogram':
      return (quantity * 1000) / 100
    case 'mililiter':
    case 'ml':
      return quantity / 100 // Assuming density ~1 for liquids
    case 'liter':
      return (quantity * 1000) / 100
    case 'sendok makan':
      return (quantity * 15) / 100 // 1 tbsp ≈ 15ml
    case 'sendok teh':
      return (quantity * 5) / 100 // 1 tsp ≈ 5ml
    case 'cangkir':
      return (quantity * 250) / 100 // 1 cup ≈ 250ml
    case 'gelas':
      return (quantity * 200) / 100 // 1 glass ≈ 200ml
    default:
      // For pieces, estimate average weight
      return quantity * 0.5 // Assume 50g per piece as default
  }
}

/**
 * Check if nutrition data meets minimum requirements
 */
export function meetsMinimumRequirements(
  nutrition: NutritionData,
  targetLevel: TargetLevel
): boolean {
  const requirements = AKG_REQUIREMENTS[targetLevel]
  
  return (
    nutrition.calories >= requirements.calories.min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD &&
    nutrition.protein >= requirements.protein.min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD &&
    nutrition.carbs >= requirements.carbs.min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD &&
    nutrition.fat >= requirements.fat.min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD &&
    nutrition.fiber >= requirements.fiber.min * COMPLIANCE_TOLERANCE.UNDER_THRESHOLD
  )
}

/**
 * Get nutrition recommendations for improvement
 */
export function getNutritionRecommendations(
  nutrition: NutritionData,
  targetLevel: TargetLevel
): string[] {
  const compliance = calculateNutritionCompliance(nutrition, targetLevel)
  const recommendations: string[] = []
  const requirements = AKG_REQUIREMENTS[targetLevel]
  
  if (compliance.details.calories === 'UNDER') {
    recommendations.push(
      `Kalori terlalu rendah. Tambahkan ${Math.round(requirements.calories.min - nutrition.calories)} kalori lagi.`
    )
  } else if (compliance.details.calories === 'OVER') {
    recommendations.push(
      `Kalori terlalu tinggi. Kurangi ${Math.round(nutrition.calories - requirements.calories.max)} kalori.`
    )
  }
  
  if (compliance.details.protein === 'UNDER') {
    recommendations.push(
      `Protein kurang. Tambahkan ${Math.round(requirements.protein.min - nutrition.protein)}g protein.`
    )
  }
  
  if (compliance.details.fiber === 'UNDER') {
    recommendations.push(
      `Serat kurang. Tambahkan sayuran atau buah untuk mencukupi ${Math.round(requirements.fiber.min - nutrition.fiber)}g serat.`
    )
  }
  
  if (compliance.details.carbs === 'UNDER') {
    recommendations.push(
      `Karbohidrat kurang. Tambahkan nasi, roti, atau sumber karbo lain.`
    )
  }
  
  return recommendations
}

/**
 * Format nutrition value for display
 */
export function formatNutritionValue(
  value: number,
  nutrient: keyof NutritionData,
  showUnit = true
): string {
  const rounded = Math.round(value * 10) / 10
  
  if (!showUnit) return rounded.toString()
  
  switch (nutrient) {
    case 'calories':
      return `${rounded} kkal`
    case 'protein':
    case 'carbs':
    case 'fat':
    case 'fiber':
      return `${rounded}g`
    case 'sodium':
    case 'calcium':
    case 'iron':
    case 'vitaminC':
      return `${rounded}mg`
    case 'vitaminA':
      return `${rounded} IU`
    default:
      return rounded.toString()
  }
}