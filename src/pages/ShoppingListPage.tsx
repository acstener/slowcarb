import { useMemo, useState } from 'react'
import { Minus, Plus, Users, Printer, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useMealPlanStore, DAYS } from '@/stores/mealPlanStore'
import { recipes } from '@/data/recipes'
import { cn } from '@/lib/utils'
import type { MealType } from '@/types/recipe'

interface AggregatedItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  recipes: string[]
  checked: boolean
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

const categoryOrder = ['protein', 'vegetables', 'legumes', 'pantry', 'oils', 'spices']
const categoryLabels: Record<string, string> = {
  protein: 'Proteins',
  vegetables: 'Vegetables',
  legumes: 'Legumes & Beans',
  pantry: 'Pantry',
  oils: 'Oils & Fats',
  spices: 'Spices & Seasonings',
}

export function ShoppingListPage() {
  const { getCurrentPlan } = useMealPlanStore()
  const plan = getCurrentPlan()
  const [servings, setServings] = useState(plan.servings)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Aggregate ingredients from planned meals
  const aggregatedItems = useMemo(() => {
    const itemsMap = new Map<string, AggregatedItem>()

    DAYS.forEach((day) => {
      MEAL_TYPES.forEach((meal) => {
        const recipeId = plan.days[day]?.[meal]?.recipeId
        if (recipeId) {
          const recipe = recipes.find((r) => r.id === recipeId)
          if (recipe) {
            // Scale ingredients based on servings
            const scale = servings / recipe.servings

            recipe.ingredients.forEach((ing) => {
              const key = `${ing.name.toLowerCase()}-${ing.unit}`
              const existing = itemsMap.get(key)

              if (existing) {
                existing.quantity += ing.quantity * scale
                if (!existing.recipes.includes(recipe.title)) {
                  existing.recipes.push(recipe.title)
                }
              } else {
                itemsMap.set(key, {
                  id: key,
                  name: ing.name,
                  quantity: ing.quantity * scale,
                  unit: ing.unit,
                  category: ing.category,
                  recipes: [recipe.title],
                  checked: checkedItems.has(key),
                })
              }
            })
          }
        }
      })
    })

    return Array.from(itemsMap.values())
  }, [plan, servings, checkedItems])

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, AggregatedItem[]> = {}

    aggregatedItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })

    // Sort by category order
    const sortedGroups: [string, AggregatedItem[]][] = []
    categoryOrder.forEach((cat) => {
      if (groups[cat]) {
        sortedGroups.push([cat, groups[cat]])
      }
    })

    return sortedGroups
  }, [aggregatedItems])

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const checkedCount = checkedItems.size
  const totalCount = aggregatedItems.length

  const formatQuantity = (qty: number): string => {
    if (qty === Math.floor(qty)) return qty.toString()
    return qty.toFixed(1)
  }

  if (aggregatedItems.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Shopping List</h1>
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No meals planned yet. Add some recipes to your meal plan first!
            </p>
            <Button asChild>
              <a href="/planner">Go to Meal Planner</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Shopping List</h1>
            <p className="text-muted-foreground mt-1">
              {checkedCount} of {totalCount} items checked
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Servings Control */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setServings(Math.max(1, servings - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="flex items-center gap-1.5 px-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-semibold">{servings}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setServings(Math.min(10, servings + 1))}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button variant="outline" size="icon" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="space-y-8">
          {groupedItems.map(([category, items]) => (
            <div key={category}>
              <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                {categoryLabels[category] || category}
                <span className="text-sm text-muted-foreground font-normal">
                  ({items.length})
                </span>
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checkedItems.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg transition-all',
                        isChecked
                          ? 'bg-muted/50 opacity-60'
                          : 'bg-card border hover:shadow-sm'
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="h-5 w-5 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-medium',
                            isChecked && 'line-through text-muted-foreground'
                          )}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          For: {item.recipes.join(', ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm">
                          {formatQuantity(item.quantity)} {item.unit}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Banner */}
        {checkedCount === totalCount && totalCount > 0 && (
          <div className="mt-8 p-6 rounded-xl bg-primary/10 text-center">
            <Check className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-primary">All done! Happy cooking!</p>
          </div>
        )}
      </div>
    </div>
  )
}
