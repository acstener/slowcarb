import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, ShoppingCart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MacroDisplay } from '@/components/recipe/MacroBadge'
import { useMealPlanStore, DAYS } from '@/stores/mealPlanStore'
import { recipes } from '@/data/recipes'
import { cn } from '@/lib/utils'
import type { Day, MealType, Recipe } from '@/types/recipe'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

const dayLabels: Record<Day, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

function RecipePicker({
  onSelect,
  mealType,
}: {
  onSelect: (recipe: Recipe) => void
  mealType: MealType
}) {
  const filteredRecipes = recipes.filter(
    (r) => mealType === 'breakfast' ? r.mealType.includes('breakfast') : true
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
      {filteredRecipes.map((recipe) => (
        <button
          key={recipe.id}
          onClick={() => onSelect(recipe)}
          className="flex gap-3 p-3 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all text-left"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-16 h-16 rounded-md object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium text-sm line-clamp-2">{recipe.title}</p>
            <MacroDisplay
              protein={recipe.nutrition.protein}
              carbs={recipe.nutrition.carbs}
              fat={recipe.nutrition.fat}
              size="sm"
              className="mt-1"
            />
          </div>
        </button>
      ))}
    </div>
  )
}

function MealSlot({
  day,
  mealType,
  recipeId,
  onAdd,
  onRemove,
}: {
  day: Day
  mealType: MealType
  recipeId?: string
  onAdd: (recipe: Recipe) => void
  onRemove: () => void
}) {
  const recipe = recipeId ? recipes.find((r) => r.id === recipeId) : null

  if (recipe) {
    return (
      <div className="relative group rounded-lg overflow-hidden border bg-card">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full aspect-[16/9] object-cover"
        />
        <div className="p-2">
          <p className="text-xs font-medium line-clamp-1">{recipe.title}</p>
          <span className="text-xs text-muted-foreground font-mono">
            {recipe.nutrition.protein}P
          </span>
        </div>
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            'w-full aspect-[16/9] rounded-lg border-2 border-dashed',
            'flex flex-col items-center justify-center gap-1',
            'text-muted-foreground hover:border-primary hover:text-primary',
            'transition-colors'
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs capitalize">{mealType}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add {mealType} for {dayLabels[day]}</DialogTitle>
        </DialogHeader>
        <RecipePicker
          mealType={mealType}
          onSelect={(recipe) => {
            onAdd(recipe)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export function MealPlannerPage() {
  const {
    getCurrentPlan,
    currentWeekId,
    addRecipeToSlot,
    removeRecipeFromSlot,
    navigateWeek,
    setServings,
  } = useMealPlanStore()

  const plan = getCurrentPlan()
  const [servingsInput, setServingsInput] = useState(plan.servings)

  // Calculate week dates
  const [year, weekStr] = currentWeekId.split('-W')
  const weekNum = parseInt(weekStr)

  // Calculate totals
  let totalProtein = 0
  let totalMeals = 0

  DAYS.forEach((day) => {
    MEAL_TYPES.forEach((meal) => {
      const recipeId = plan.days[day]?.[meal]?.recipeId
      if (recipeId) {
        const recipe = recipes.find((r) => r.id === recipeId)
        if (recipe) {
          totalProtein += recipe.nutrition.protein
          totalMeals++
        }
      }
    })
  })

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Meal Planner</h1>
            <p className="text-muted-foreground mt-1">
              Plan your week of slow carb meals
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Servings Control */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                min={1}
                max={10}
                value={servingsInput}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1
                  setServingsInput(val)
                  setServings(val)
                }}
                className="w-8 bg-transparent text-center font-mono focus:outline-none"
              />
              <span className="text-sm text-muted-foreground">people</span>
            </div>
            <Button asChild>
              <Link to="/shopping">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Shopping List
              </Link>
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-display text-xl font-semibold">
            Week {weekNum}, {year}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Planner Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-7 gap-4 min-w-[900px]">
            {/* Day Headers */}
            {DAYS.map((day) => (
              <div key={day} className="text-center pb-2 border-b">
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {dayLabels[day]}
                </span>
              </div>
            ))}

            {/* Meal Slots */}
            {DAYS.map((day) => (
              <div key={day} className="space-y-3">
                {MEAL_TYPES.map((mealType) => (
                  <MealSlot
                    key={mealType}
                    day={day}
                    mealType={mealType}
                    recipeId={plan.days[day]?.[mealType]?.recipeId}
                    onAdd={(recipe) => addRecipeToSlot(recipe.id, day, mealType)}
                    onRemove={() => removeRecipeFromSlot(day, mealType)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="mt-8 p-6 rounded-xl bg-muted/50">
          <h3 className="font-medium mb-4">Weekly Summary</h3>
          <div className="flex gap-8">
            <div>
              <span className="text-3xl font-mono font-bold text-primary">{totalMeals}</span>
              <span className="text-muted-foreground text-sm block">meals planned</span>
            </div>
            <div>
              <span className="text-3xl font-mono font-bold text-red-500">{totalProtein}g</span>
              <span className="text-muted-foreground text-sm block">total protein</span>
            </div>
            <div>
              <span className="text-3xl font-mono font-bold text-muted-foreground">
                {totalMeals > 0 ? Math.round(totalProtein / totalMeals) : 0}g
              </span>
              <span className="text-muted-foreground text-sm block">avg per meal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
