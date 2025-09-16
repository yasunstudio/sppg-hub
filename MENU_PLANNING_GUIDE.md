# 🍽️ Menu Planning Module Implementation Guide

## 📋 Overview
This guide serves as the single source of truth for implementing the Menu Planning module in SPPG-Hub. It ensures consistency, maintainability, and follows best practices for React/Next.js applications with TypeScript, Zod, and Zustand.

## 🎯 Module Objectives
- ✅ **CRUD Operations**: Create, Read, Update, Delete menus
- ✅ **AKG Compliance**: Automatic nutrition validation per education level
- ✅ **Cost Calculation**: Real-time cost computation based on ingredients
- ✅ **Recipe Management**: Detailed recipes with ingredients mapping
- ✅ **Filtering & Search**: Advanced menu filtering and search capabilities
- ✅ **Mobile-First**: Responsive design for all devices

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
```
UI Components → Hooks → Stores → Services → Database
```
- **Components**: Pure UI, minimal logic
- **Hooks**: Business logic and state management
- **Stores**: Global state with Zustand
- **Services**: API calls and data transformation
- **Schemas**: Data validation with Zod

### 2. **Type Safety First**
- All components must be fully typed
- Zod schemas for runtime validation
- TypeScript interfaces for compile-time safety
- No `any` types allowed

### 3. **Performance Optimization**
- Zustand for minimal re-renders
- React Hook Form for form performance
- Debounced search and filters
- Virtual scrolling for large lists

## 📂 Folder Structure Specification

```
src/modules/menu-planning/
├── components/
│   ├── menu-list/
│   │   ├── menu-card.tsx              # Individual menu display card
│   │   ├── menu-filters.tsx           # Filter controls (level, status, etc.)
│   │   ├── menu-search.tsx            # Search input with debounce
│   │   └── menu-list-view.tsx         # Main list container
│   ├── menu-form/
│   │   ├── menu-form.tsx              # Main form component
│   │   ├── basic-info-section.tsx     # Name, description, level
│   │   ├── nutrition-section.tsx      # Nutrition input fields
│   │   ├── cost-section.tsx           # Cost calculation display
│   │   ├── recipe-section.tsx         # Recipe and ingredients
│   │   └── form-actions.tsx           # Save, cancel, delete buttons
│   ├── menu-details/
│   │   ├── menu-overview.tsx          # Menu summary display
│   │   ├── nutrition-panel.tsx        # AKG compliance display
│   │   ├── cost-breakdown.tsx         # Cost analysis
│   │   ├── recipe-display.tsx         # Recipe instructions
│   │   └── ingredients-list.tsx       # Ingredients with quantities
│   └── shared/
│       ├── nutrition-badge.tsx        # AKG status indicator
│       ├── cost-display.tsx           # Currency formatting
│       └── loading-skeleton.tsx       # Loading states
├── hooks/
│   ├── use-menu-store.ts              # Zustand store hook
│   ├── use-menu-form.ts               # Form logic hook
│   ├── use-nutrition-calculator.ts    # AKG calculation hook
│   ├── use-menu-filters.ts            # Filter state hook
│   └── use-debounced-search.ts        # Search optimization hook
├── stores/
│   ├── menu-store.ts                  # Main menu state management
│   └── menu-ui-store.ts               # UI state (modals, selections)
├── schemas/
│   ├── menu.schema.ts                 # Menu validation schema
│   ├── nutrition.schema.ts            # Nutrition validation
│   ├── recipe.schema.ts               # Recipe validation
│   └── index.ts                       # Schema exports
├── services/
│   ├── menu.service.ts                # Menu CRUD operations
│   ├── nutrition.service.ts           # AKG calculations
│   └── recipe.service.ts              # Recipe operations
├── types/
│   ├── menu.types.ts                  # Menu-related types
│   ├── nutrition.types.ts             # Nutrition types
│   ├── recipe.types.ts                # Recipe types
│   └── index.ts                       # Type exports
├── utils/
│   ├── nutrition-helpers.ts           # AKG calculation utilities
│   ├── cost-calculations.ts           # Cost computation
│   ├── menu-validators.ts             # Custom validation
│   └── constants.ts                   # Module constants
└── index.ts                           # Module exports
```

## 🔧 Implementation Standards

### 1. **Zod Schema Patterns**
```typescript
// schemas/menu.schema.ts
import { z } from 'zod'

export const menuBaseSchema = z.object({
  name: z.string()
    .min(3, 'Menu name must be at least 3 characters')
    .max(100, 'Menu name must be less than 100 characters'),
  description: z.string().optional(),
  targetLevel: z.enum(['TK', 'SD', 'SMP', 'SMA']),
  status: z.enum(['DRAFT', 'APPROVED', 'ACTIVE', 'INACTIVE']).default('DRAFT'),
})

export const nutritionSchema = z.object({
  calories: z.number().min(0).max(3000),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0),
  sodium: z.number().min(0).optional(),
})

export const menuCreateSchema = menuBaseSchema.extend({
  nutrition: nutritionSchema,
  costPerPortion: z.number().min(0),
  servingSize: z.number().min(1),
})

export const menuUpdateSchema = menuCreateSchema.partial()
```

### 2. **Zustand Store Pattern**
```typescript
// stores/menu-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface MenuStore {
  // State
  menus: Menu[]
  currentMenu: Menu | null
  isLoading: boolean
  error: string | null
  filters: MenuFilters
  
  // Actions
  fetchMenus: () => Promise<void>
  fetchMenuById: (id: string) => Promise<void>
  createMenu: (data: CreateMenuData) => Promise<Menu>
  updateMenu: (id: string, data: UpdateMenuData) => Promise<Menu>
  deleteMenu: (id: string) => Promise<void>
  
  // Filter actions
  setFilters: (filters: Partial<MenuFilters>) => void
  clearFilters: () => void
  
  // UI actions
  setCurrentMenu: (menu: Menu | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed selectors
  getFilteredMenus: () => Menu[]
  getMenusByLevel: (level: TargetLevel) => Menu[]
  getNutritionStats: () => NutritionStats
}

export const useMenuStore = create<MenuStore>()(
  devtools(
    (set, get) => ({
      // Implementation...
    }),
    { name: 'menu-store' }
  )
)
```

### 3. **Component Structure**
```typescript
// components/menu-form/menu-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuCreateSchema, type MenuCreateData } from '../../schemas'
import { useMenuStore } from '../../hooks/use-menu-store'

interface MenuFormProps {
  menu?: Menu
  onSuccess?: (menu: Menu) => void
  onCancel?: () => void
}

export function MenuForm({ menu, onSuccess, onCancel }: MenuFormProps) {
  const { createMenu, updateMenu, isLoading } = useMenuStore()
  
  const form = useForm<MenuCreateData>({
    resolver: zodResolver(menuCreateSchema),
    defaultValues: menu ? {
      name: menu.name,
      description: menu.description,
      // ... other fields
    } : {
      name: '',
      targetLevel: 'SD',
      status: 'DRAFT',
      // ... default values
    }
  })
  
  const onSubmit = async (data: MenuCreateData) => {
    try {
      const result = menu 
        ? await updateMenu(menu.id, data)
        : await createMenu(data)
      
      onSuccess?.(result)
    } catch (error) {
      // Error handling
    }
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form implementation */}
    </form>
  )
}
```

### 4. **Service Layer Pattern**
```typescript
// services/menu.service.ts
import { prisma } from '@/lib/prisma'
import type { CreateMenuData, UpdateMenuData, MenuFilters } from '../types'

export class MenuService {
  static async getMenus(sppgId: string, filters?: MenuFilters) {
    return await prisma.menu.findMany({
      where: {
        sppgId,
        ...(filters?.targetLevel && { targetLevel: filters.targetLevel }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          name: { contains: filters.search, mode: 'insensitive' }
        }),
      },
      include: {
        recipes: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  static async createMenu(sppgId: string, data: CreateMenuData) {
    return await prisma.menu.create({
      data: {
        ...data,
        sppgId,
      },
      include: {
        recipes: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      }
    })
  }
  
  // Other CRUD methods...
}
```

## 🎨 UI/UX Guidelines

### 1. **Responsive Design**
- Mobile: Single column layout
- Tablet: Two column layout  
- Desktop: Three column layout
- Always mobile-first CSS

### 2. **Loading States**
- Skeleton loaders for content
- Spinners for actions
- Disabled states during submission

### 3. **Error Handling**
- Toast notifications for user feedback
- Inline validation errors
- Graceful fallbacks for failed requests

### 4. **Accessibility**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals/forms

## 📊 Data Flow

### Menu List Flow:
```
User opens /menus → useMenuStore.fetchMenus() → MenuService.getMenus() → 
Prisma query → Update store → Re-render MenuListView
```

### Menu Creation Flow:
```
User fills form → Form validation (Zod) → useMenuStore.createMenu() → 
MenuService.createMenu() → Prisma create → Update store → Navigate to menu
```

### Nutrition Calculation Flow:
```
User changes ingredients → useNutritionCalculator() → Calculate totals → 
Validate AKG compliance → Update form values → Show compliance status
```

## ✅ Implementation Checklist

### Phase 1: Foundation
- [ ] Create folder structure
- [ ] Setup Zod schemas
- [ ] Create TypeScript types
- [ ] Setup Zustand stores
- [ ] Create service layer

### Phase 2: Core Components  
- [ ] Menu list view
- [ ] Menu form with validation
- [ ] Menu details page
- [ ] Navigation setup

### Phase 3: Advanced Features
- [ ] Nutrition calculator
- [ ] Cost calculations
- [ ] Recipe management
- [ ] Filtering and search

### Phase 4: Integration
- [ ] API integration
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile optimization

## 🚫 Implementation Rules

### DO:
- ✅ Follow the folder structure exactly
- ✅ Use TypeScript for everything
- ✅ Validate all data with Zod
- ✅ Handle loading and error states
- ✅ Write reusable components
- ✅ Follow naming conventions

### DON'T:
- ❌ Use `any` type
- ❌ Skip error handling
- ❌ Hardcode values
- ❌ Create God components
- ❌ Ignore accessibility
- ❌ Skip TypeScript interfaces

## 📝 Naming Conventions

### Files:
- Components: `kebab-case.tsx` (menu-form.tsx)
- Hooks: `use-kebab-case.ts` (use-menu-store.ts)
- Types: `kebab-case.types.ts` (menu.types.ts)
- Services: `kebab-case.service.ts` (menu.service.ts)

### Variables:
- React components: `PascalCase` (MenuForm)
- Functions/variables: `camelCase` (fetchMenus)
- Constants: `SCREAMING_SNAKE_CASE` (DEFAULT_SERVING_SIZE)
- Types/Interfaces: `PascalCase` (MenuFormData)

## 🔍 Quality Standards

- **TypeScript**: Strict mode, no implicit any
- **ESLint**: Follow project linting rules
- **Testing**: Unit tests for utilities and services
- **Performance**: Memoize expensive calculations
- **Accessibility**: WCAG 2.1 AA compliance

---

**This guide is the single source of truth for Menu Planning module implementation. Any deviation must be documented and justified.**

*Created: September 16, 2025*  
*Version: 1.0*