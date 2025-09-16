import type { TargetLevel } from '../types'
import type { AKGRequirements } from '../schemas'

// AKG (Angka Kecukupan Gizi) requirements per education level
// Based on Indonesian nutritional guidelines
export const AKG_REQUIREMENTS: Record<TargetLevel, AKGRequirements> = {
  TK: {
    calories: { min: 800, max: 1200 },
    protein: { min: 20, max: 35 },
    carbs: { min: 120, max: 180 },
    fat: { min: 25, max: 40 },
    fiber: { min: 10, max: 15 },
    sodium: { min: 400, max: 800 }
  },
  SD: {
    calories: { min: 1200, max: 1800 },
    protein: { min: 30, max: 50 },
    carbs: { min: 180, max: 270 },
    fat: { min: 35, max: 60 },
    fiber: { min: 15, max: 25 },
    sodium: { min: 600, max: 1200 }
  },
  SMP: {
    calories: { min: 1600, max: 2200 },
    protein: { min: 45, max: 70 },
    carbs: { min: 240, max: 330 },
    fat: { min: 50, max: 80 },
    fiber: { min: 20, max: 30 },
    sodium: { min: 800, max: 1500 }
  },
  SMA: {
    calories: { min: 1800, max: 2500 },
    protein: { min: 50, max: 80 },
    carbs: { min: 270, max: 375 },
    fat: { min: 55, max: 90 },
    fiber: { min: 25, max: 35 },
    sodium: { min: 1000, max: 1800 }
  }
}

// Default serving sizes per education level
export const DEFAULT_SERVING_SIZES: Record<TargetLevel, number> = {
  TK: 1,
  SD: 1,
  SMP: 1.2,
  SMA: 1.5
}

// Common measurement units
export const MEASUREMENT_UNITS = [
  'gram',
  'kilogram',
  'mililiter',
  'liter',
  'sendok makan',
  'sendok teh',
  'cangkir',
  'gelas',
  'potong',
  'buah',
  'lembar',
  'butir',
  'siung',
  'batang'
] as const

// Recipe difficulty colors for UI
export const DIFFICULTY_COLORS = {
  EASY: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  MEDIUM: { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  HARD: { bg: 'bg-red-50 dark:bg-red-950/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' }
} as const

// Menu status colors for UI
export const STATUS_COLORS = {
  DRAFT: { bg: 'bg-slate-50 dark:bg-slate-950/20', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' },
  APPROVED: { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  ACTIVE: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  INACTIVE: { bg: 'bg-red-50 dark:bg-red-950/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' }
} as const

// Target level colors for UI
export const TARGET_LEVEL_COLORS = {
  TK: { bg: 'bg-pink-50 dark:bg-pink-950/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  SD: { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  SMP: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  SMA: { bg: 'bg-indigo-50 dark:bg-indigo-950/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' }
} as const

// Recipe categories with Indonesian names
export const RECIPE_CATEGORY_NAMES = {
  MAIN_COURSE: 'Makanan Utama',
  SIDE_DISH: 'Lauk Pauk',
  SOUP: 'Sup',
  DESSERT: 'Pencuci Mulut',
  SNACK: 'Camilan',
  BEVERAGE: 'Minuman'
} as const

// Target level Indonesian names
export const TARGET_LEVEL_NAMES = {
  TK: 'Taman Kanak-Kanak',
  SD: 'Sekolah Dasar',
  SMP: 'Sekolah Menengah Pertama',
  SMA: 'Sekolah Menengah Atas'
} as const

// Menu status Indonesian names
export const MENU_STATUS_NAMES = {
  DRAFT: 'Konsep',
  APPROVED: 'Disetujui',
  ACTIVE: 'Aktif',
  INACTIVE: 'Tidak Aktif'
} as const

// Pagination constants
export const PAGINATION_LIMITS = {
  MIN: 5,
  DEFAULT: 10,
  MAX: 100,
  OPTIONS: [5, 10, 20, 50, 100]
} as const

// Form validation constants
export const VALIDATION_LIMITS = {
  MENU_NAME: { MIN: 3, MAX: 100 },
  RECIPE_NAME: { MIN: 3, MAX: 100 },
  DESCRIPTION: { MAX: 500 },
  INSTRUCTIONS: { MAX: 2000 },
  NOTES: { MAX: 200 },
  SEARCH: { MAX: 100 },
  MAX_RECIPES_PER_MENU: 10,
  MAX_INGREDIENTS_PER_RECIPE: 50,
  MAX_PREP_COOK_TIME_HOURS: 8
} as const

// Nutrition compliance tolerances (percentage)
export const COMPLIANCE_TOLERANCE = {
  UNDER_THRESHOLD: 0.8, // 80% of minimum is considered "under"
  OVER_THRESHOLD: 1.2,  // 120% of maximum is considered "over"
  COMPLIANT_RANGE: { MIN: 0.8, MAX: 1.2 }
} as const