import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { RecipeCard } from '@/components/recipe/RecipeCard'
import { RecipeDetailModal } from '@/components/recipe/RecipeDetailModal'
import { recipes } from '@/data/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { cn } from '@/lib/utils'
import type { Recipe, Day, MealType } from '@/types/recipe'

const proteins = ['all', 'chicken', 'beef', 'pork', 'fish', 'legumes'] as const

export function RecipesPage() {
  const [search, setSearch] = useState('')
  const [protein, setProtein] = useState<string>('all')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { addRecipeToSlot } = useMealPlanStore()

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (search && !recipe.title.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (protein !== 'all' && recipe.primaryProtein !== protein) {
        return false
      }
      return true
    })
  }, [search, protein])

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  const handleAddToMealPlan = (recipe: Recipe, day: Day, mealType: MealType) => {
    addRecipeToSlot(recipe.id, day, mealType)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display text-3xl">Recipes</h1>
          <p className="mt-2 text-neutral-400">
            {filteredRecipes.length} recipes
          </p>
        </header>

        {/* Filters - minimal */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12 pb-8 border-b border-neutral-100">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-6 py-2 text-sm bg-transparent border-b border-neutral-200 focus:border-neutral-900 focus:outline-none transition-colors placeholder:text-neutral-300"
            />
          </div>

          {/* Protein filter - simple text links */}
          <div className="flex items-center gap-4">
            {proteins.map((p) => (
              <button
                key={p}
                onClick={() => setProtein(p)}
                className={cn(
                  'text-sm capitalize transition-colors',
                  protein === p
                    ? 'text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-neutral-400 py-20">
            No recipes found
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToMealPlan={handleAddToMealPlan}
      />
    </div>
  )
}
