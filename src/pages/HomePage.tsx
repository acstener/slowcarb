import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, ShoppingCart, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/recipe/RecipeCard'
import { RecipeDetailModal } from '@/components/recipe/RecipeDetailModal'
import { recipes } from '@/data/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import type { Recipe, Day, MealType } from '@/types/recipe'

const features = [
  {
    icon: Utensils,
    title: 'Browse Recipes',
    description: 'Discover delicious slow carb compliant meals with detailed macros.',
    href: '/recipes',
  },
  {
    icon: Calendar,
    title: 'Plan Your Week',
    description: 'Drag and drop recipes to build your weekly meal plan.',
    href: '/planner',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Shopping',
    description: 'Generate consolidated shopping lists with AI-powered optimization.',
    href: '/shopping',
  },
]

export function HomePage() {
  const featuredRecipes = recipes.slice(0, 4)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { addRecipeToSlot } = useMealPlanStore()

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  const handleAddToMealPlan = (recipe: Recipe, day: Day, mealType: MealType) => {
    addRecipeToSlot(recipe.id, day, mealType)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Slow Carb Meals,{' '}
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Discover Tim Ferriss-inspired recipes, plan your weekly meals, and generate smart shopping lists.
              High protein, low carb, maximum flavor.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/recipes">
                  Browse Recipes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/planner">Start Planning</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="group p-6 rounded-2xl bg-background border hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Featured Recipes
            </h2>
            <Button asChild variant="ghost" className="gap-1">
              <Link to="/recipes">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
            Ready to Start Your Slow Carb Journey?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Plan your first week of meals and see how easy healthy eating can be.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/planner">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToMealPlan={handleAddToMealPlan}
      />
    </div>
  )
}
