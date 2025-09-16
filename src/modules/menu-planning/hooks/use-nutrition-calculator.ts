import { useCallback } from 'react'
import { 
  calculateNutritionCompliance, 
  calculateRecipeNutrition,
  getNutritionRecommendations,
  meetsMinimumRequirements
} from '../utils/nutrition-helpers'
import type { TargetLevel, NutritionData, NutritionCompliance } from '../types'

interface RecipeIngredientInput {
  quantity: number
  unit: string
  ingredient: {
    nutritionPer100g: NutritionData
  }
}

interface UseNutritionCalculatorProps {
  targetLevel: TargetLevel
  servingSize?: number
}

/**
 * Hook for calculating nutrition values and AKG compliance
 */
export function useNutritionCalculator({ 
  targetLevel, 
  servingSize = 1 
}: UseNutritionCalculatorProps) {
  
  // Calculate nutrition from recipe ingredients
  const calculateFromIngredients = useCallback((
    ingredients: RecipeIngredientInput[]
  ): NutritionData => {
    const totalNutrition = calculateRecipeNutrition(ingredients)
    
    // Adjust for serving size
    return {
      calories: totalNutrition.calories / servingSize,
      protein: totalNutrition.protein / servingSize,
      carbs: totalNutrition.carbs / servingSize,
      fat: totalNutrition.fat / servingSize,
      fiber: totalNutrition.fiber / servingSize,
      sodium: totalNutrition.sodium ? totalNutrition.sodium / servingSize : undefined,
      calcium: totalNutrition.calcium ? totalNutrition.calcium / servingSize : undefined,
      iron: totalNutrition.iron ? totalNutrition.iron / servingSize : undefined,
      vitaminA: totalNutrition.vitaminA ? totalNutrition.vitaminA / servingSize : undefined,
      vitaminC: totalNutrition.vitaminC ? totalNutrition.vitaminC / servingSize : undefined
    }
  }, [servingSize])
  
  // Calculate compliance for given nutrition data
  const calculateCompliance = useCallback((
    nutrition: NutritionData
  ): NutritionCompliance => {
    return calculateNutritionCompliance(nutrition, targetLevel)
  }, [targetLevel])
  
  // Get recommendations for improvement
  const getRecommendations = useCallback((
    nutrition: NutritionData
  ): string[] => {
    return getNutritionRecommendations(nutrition, targetLevel)
  }, [targetLevel])
  
  // Check if nutrition meets minimum requirements
  const checkMinimumRequirements = useCallback((
    nutrition: NutritionData
  ): boolean => {
    return meetsMinimumRequirements(nutrition, targetLevel)
  }, [targetLevel])
  
  // Calculate nutrition score (0-100)
  const calculateNutritionScore = useCallback((
    nutrition: NutritionData
  ): number => {
    const compliance = calculateCompliance(nutrition)
    
    // Count compliant nutrients
    const nutrients = Object.values(compliance.details)
    const compliantCount = nutrients.filter(status => status === 'COMPLIANT').length
    const totalNutrients = nutrients.length
    
    // Base score from compliance
    let score = (compliantCount / totalNutrients) * 80 // Max 80 points from compliance
    
    // Bonus points for balanced nutrition (within ideal ranges)
    const percentages = compliance.percentages
    const balanceBonus = Object.values(percentages).reduce((bonus, percentage) => {
      if (percentage >= 90 && percentage <= 110) {
        return bonus + 4 // 4 points per perfectly balanced nutrient (max 20)
      } else if (percentage >= 80 && percentage <= 120) {
        return bonus + 2 // 2 points per well-balanced nutrient
      }
      return bonus
    }, 0)
    
    score += Math.min(balanceBonus, 20) // Cap bonus at 20 points
    
    return Math.round(Math.min(score, 100))
  }, [calculateCompliance])
  
  // Get nutrition quality grade
  const getNutritionGrade = useCallback((score: number): {
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    color: string
    description: string
  } => {
    if (score >= 90) {
      return {
        grade: 'A',
        color: 'green',
        description: 'Excellent - Memenuhi semua kebutuhan gizi'
      }
    } else if (score >= 80) {
      return {
        grade: 'B', 
        color: 'blue',
        description: 'Good - Memenuhi sebagian besar kebutuhan gizi'
      }
    } else if (score >= 70) {
      return {
        grade: 'C',
        color: 'yellow', 
        description: 'Fair - Perlu perbaikan pada beberapa nutrisi'
      }
    } else if (score >= 60) {
      return {
        grade: 'D',
        color: 'orange',
        description: 'Poor - Banyak kekurangan nutrisi'
      }
    } else {
      return {
        grade: 'F',
        color: 'red',
        description: 'Fail - Tidak memenuhi kebutuhan gizi minimal'
      }
    }
  }, [])
  
  // Calculate multiple nutrition metrics at once
  const calculateNutritionSummary = useCallback((
    nutrition: NutritionData
  ) => {
    const compliance = calculateCompliance(nutrition)
    const recommendations = getRecommendations(nutrition)
    const meetsMinimum = checkMinimumRequirements(nutrition)
    const score = calculateNutritionScore(nutrition)
    const grade = getNutritionGrade(score)
    
    return {
      nutrition,
      compliance,
      recommendations,
      meetsMinimum,
      score,
      grade,
      targetLevel,
      servingSize
    }
  }, [
    calculateCompliance,
    getRecommendations, 
    checkMinimumRequirements,
    calculateNutritionScore,
    getNutritionGrade,
    targetLevel,
    servingSize
  ])
  
  return {
    calculateFromIngredients,
    calculateCompliance,
    getRecommendations,
    checkMinimumRequirements,
    calculateNutritionScore,
    getNutritionGrade,
    calculateNutritionSummary,
    
    // Current settings
    targetLevel,
    servingSize
  }
}