import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Day, PlannedMeal, WeekPlan } from '@/types/recipe'

const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function getWeekId(date: Date = new Date()): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
}

function createEmptyWeekPlan(weekId: string): WeekPlan {
  const now = new Date().toISOString()
  return {
    weekId,
    days: {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {},
    },
    servings: 2,
    createdAt: now,
    updatedAt: now,
  }
}

interface MealPlanState {
  plans: Record<string, WeekPlan>
  currentWeekId: string

  // Actions
  getCurrentPlan: () => WeekPlan
  addRecipeToSlot: (recipeId: string, day: Day, mealType: 'breakfast' | 'lunch' | 'dinner') => void
  removeRecipeFromSlot: (day: Day, mealType: 'breakfast' | 'lunch' | 'dinner') => void
  setServings: (servings: number) => void
  clearWeek: () => void
  navigateWeek: (direction: 'prev' | 'next') => void
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      plans: {},
      currentWeekId: getWeekId(),

      getCurrentPlan: () => {
        const { plans, currentWeekId } = get()
        if (!plans[currentWeekId]) {
          set(state => ({
            plans: {
              ...state.plans,
              [currentWeekId]: createEmptyWeekPlan(currentWeekId),
            },
          }))
        }
        return get().plans[currentWeekId] || createEmptyWeekPlan(currentWeekId)
      },

      addRecipeToSlot: (recipeId, day, mealType) => {
        const { currentWeekId } = get()
        const meal: PlannedMeal = { recipeId, servings: get().getCurrentPlan().servings }

        set(state => ({
          plans: {
            ...state.plans,
            [currentWeekId]: {
              ...state.plans[currentWeekId] || createEmptyWeekPlan(currentWeekId),
              days: {
                ...(state.plans[currentWeekId]?.days || createEmptyWeekPlan(currentWeekId).days),
                [day]: {
                  ...(state.plans[currentWeekId]?.days?.[day] || {}),
                  [mealType]: meal,
                },
              },
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      removeRecipeFromSlot: (day, mealType) => {
        const { currentWeekId } = get()

        set(state => {
          const currentPlan = state.plans[currentWeekId]
          if (!currentPlan) return state

          const updatedDay = { ...currentPlan.days[day] }
          delete updatedDay[mealType]

          return {
            plans: {
              ...state.plans,
              [currentWeekId]: {
                ...currentPlan,
                days: {
                  ...currentPlan.days,
                  [day]: updatedDay,
                },
                updatedAt: new Date().toISOString(),
              },
            },
          }
        })
      },

      setServings: (servings) => {
        const { currentWeekId } = get()
        set(state => ({
          plans: {
            ...state.plans,
            [currentWeekId]: {
              ...state.plans[currentWeekId] || createEmptyWeekPlan(currentWeekId),
              servings,
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      clearWeek: () => {
        const { currentWeekId } = get()
        set(state => ({
          plans: {
            ...state.plans,
            [currentWeekId]: createEmptyWeekPlan(currentWeekId),
          },
        }))
      },

      navigateWeek: (direction) => {
        set(state => {
          const [year, weekStr] = state.currentWeekId.split('-W')
          const week = parseInt(weekStr)
          const newWeek = direction === 'next' ? week + 1 : week - 1

          let newYear = parseInt(year)
          let adjustedWeek = newWeek

          if (newWeek > 52) {
            newYear++
            adjustedWeek = 1
          } else if (newWeek < 1) {
            newYear--
            adjustedWeek = 52
          }

          return { currentWeekId: `${newYear}-W${adjustedWeek.toString().padStart(2, '0')}` }
        })
      },
    }),
    {
      name: 'slowcarb-meal-plans',
      partialize: (state) => ({
        plans: state.plans,
        currentWeekId: state.currentWeekId
      }),
    }
  )
)

export { DAYS }
