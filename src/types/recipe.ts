export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
}

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  preparation?: string
  category: 'protein' | 'legumes' | 'vegetables' | 'pantry' | 'spices' | 'oils'
  optional?: boolean
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  nutrition: Nutrition
  mealType: ('breakfast' | 'lunch' | 'dinner')[]
  primaryProtein: 'chicken' | 'beef' | 'pork' | 'fish' | 'eggs' | 'legumes'
  tags: string[]
  ingredients: Ingredient[]
  instructions: string[]
}

export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface PlannedMeal {
  recipeId: string
  servings: number
}

export interface DayPlan {
  breakfast?: PlannedMeal
  lunch?: PlannedMeal
  dinner?: PlannedMeal
}

export interface WeekPlan {
  weekId: string
  days: Record<Day, DayPlan>
  servings: number
  createdAt: string
  updatedAt: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
  recipeIds: string[]
}
