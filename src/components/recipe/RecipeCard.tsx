import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <article className="group cursor-pointer">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="pt-4">
        <h3 className="font-display text-lg leading-snug group-hover:text-neutral-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="mt-1.5 text-sm text-neutral-400">
          {totalTime} min · {recipe.nutrition.protein}g protein
        </p>
      </div>
    </article>
  )
}
