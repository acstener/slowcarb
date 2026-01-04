import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { RecipesPage } from '@/pages/RecipesPage'
import { MealPlannerPage } from '@/pages/MealPlannerPage'
import { ShoppingListPage } from '@/pages/ShoppingListPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:slug" element={<RecipesPage />} />
            <Route path="/planner" element={<MealPlannerPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
