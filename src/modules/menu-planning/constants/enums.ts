// Display names for enums

export const TARGET_LEVEL_NAMES = {
  TK: 'Taman Kanak-Kanak (TK)',
  SD: 'Sekolah Dasar (SD)',
  SMP: 'Sekolah Menengah Pertama (SMP)',
  SMA: 'Sekolah Menengah Atas (SMA)'
} as const

export const MENU_STATUS_NAMES = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
} as const

export const MEAL_TYPE_NAMES = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack'
} as const

// Status color mapping for UI
export const STATUS_COLORS = {
  DRAFT: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  APPROVED: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  INACTIVE: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
} as const

// Target level color mapping
export const TARGET_LEVEL_COLORS = {
  TK: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200'
  },
  SD: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  SMP: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  SMA: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  }
} as const

// Meal type color mapping
export const MEAL_TYPE_COLORS = {
  BREAKFAST: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  LUNCH: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  DINNER: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200'
  },
  SNACK: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200'
  }
} as const