import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Recipe, Day, MealType } from '@/types/recipe'

interface RecipeDetailModalProps {
  recipe: Recipe | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToMealPlan?: (recipe: Recipe, day: Day, mealType: MealType) => void
}

const DAYS: { value: Day; label: string }[] = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
]

export function RecipeDetailModal({
  recipe,
  open,
  onOpenChange,
  onAddToMealPlan,
}: RecipeDetailModalProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)
  const [added, setAdded] = useState(false)

  if (!recipe) return null

  const handleAdd = (mealType: MealType) => {
    if (selectedDay && onAddToMealPlan) {
      onAddToMealPlan(recipe, selectedDay, mealType)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
        setShowPicker(false)
        setSelectedDay(null)
      }, 1200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl p-0 gap-0 border-0 shadow-2xl overflow-hidden"
      >
        {/* Close */}
        <DialogClose className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>

        {/* Image - refined, not overwhelming */}
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <h2 className="font-display text-2xl tracking-tight">
            {recipe.title}
          </h2>

          {/* Meta - subtle, inline */}
          <p className="mt-2 text-sm text-neutral-500">
            {recipe.prepTime + recipe.cookTime} min · {recipe.servings} servings
          </p>

          {/* Macros - simple text */}
          <p className="mt-1 text-sm text-neutral-500">
            {recipe.nutrition.protein}g protein · {recipe.nutrition.carbs}g carbs · {recipe.nutrition.fat}g fat
          </p>

          {/* Divider */}
          <div className="my-6 h-px bg-neutral-100" />

          {/* Ingredients - separated into core and spices */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients
                .filter((ing) => ing.category !== 'spices')
                .map((ing) => (
                  <li key={ing.id} className="text-sm text-neutral-700">
                    <span className="text-neutral-900">{ing.quantity} {ing.unit}</span>
                    {' '}{ing.name}
                    {ing.preparation && (
                      <span className="text-neutral-400">, {ing.preparation}</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          {/* Spice Mix - if any */}
          {recipe.ingredients.some((ing) => ing.category === 'spices') && (
            <div className="mt-5">
              <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
                Spice Mix
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients
                  .filter((ing) => ing.category === 'spices')
                  .map((ing) => (
                    <span
                      key={ing.id}
                      className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 rounded-full"
                    >
                      {ing.quantity} {ing.unit} {ing.name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-6 h-px bg-neutral-100" />

          {/* Instructions */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Method
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="text-sm text-neutral-600 leading-relaxed">
                  <span className="text-neutral-400 mr-3">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer - understated */}
        <div className="px-8 py-4 border-t border-neutral-100 bg-neutral-50/50">
          {!showPicker ? (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
            >
              Add to Meal Plan
            </button>
          ) : added ? (
            <p className="py-3 text-sm text-center text-neutral-500">
              Added to meal plan
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center gap-1">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => setSelectedDay(day.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs transition-colors',
                      selectedDay === day.value
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-500 hover:text-neutral-900'
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {selectedDay && (
                <div className="flex justify-center gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((meal) => (
                    <button
                      key={meal}
                      onClick={() => handleAdd(meal)}
                      className="px-4 py-1.5 text-xs capitalize text-neutral-600 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setShowPicker(false)
                  setSelectedDay(null)
                }}
                className="w-full text-xs text-neutral-400 hover:text-neutral-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
