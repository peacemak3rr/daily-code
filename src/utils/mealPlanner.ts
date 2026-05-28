// src/utils/mealPlanner.ts
import type { MealPlan, MealEntry, FoodItem, AppSettings, DailyPlan } from '@/types'
import { MEAL_TEMPLATES } from '@/constants/foodDatabase'
import { DIETARY_GUIDE } from '@/constants/defaults'

function pickFood(pool: string[], foodDb: FoodItem[], excludeIds: string[] = []): FoodItem {
  const available = pool
    .map(id => foodDb.find(f => f.id === id))
    .filter((f): f is FoodItem => !!f && !excludeIds.includes(f.id))
  if (available.length === 0) {
    // Fallback: pick any food from the database
    return foodDb.filter(f => !excludeIds.includes(f.id))[0]
  }
  return available[Math.floor(Math.random() * available.length)]
}

function calcCalories(entry: MealEntry, foodDb: FoodItem[]): number {
  const food = foodDb.find(f => f.id === entry.foodId)
  if (!food) return 0
  return (food.per100g.calories * entry.grams) / 100
}

function sumCalories(entries: MealEntry[], foodDb: FoodItem[]): number {
  return entries.reduce((sum, e) => sum + calcCalories(e, foodDb), 0)
}

export function generateMealPlan(
  dailyCalorieTarget: number,
  bodyWeightKg: number,
  settings: AppSettings,
  foodDb: FoodItem[],
  recentPlans: DailyPlan[],
): MealPlan {
  // Macro targets
  const proteinTarget = bodyWeightKg * settings.proteinPerKg

  // Per-meal calorie budgets
  const breakfastCal = dailyCalorieTarget * settings.breakfastRatio
  const lunchCal = dailyCalorieTarget * settings.lunchRatio
  const dinnerCal = dailyCalorieTarget * settings.dinnerRatio

  // Track recently used food IDs to rotate
  const recentIds = recentPlans.slice(0, 3).flatMap(p =>
    [...p.meals.breakfast, ...p.meals.lunch, ...p.meals.dinner].map(e => e.foodId)
  )

  function buildMeal(
    calorieBudget: number,
    staplePool: string[],
    proteinPool: string[],
    vegPool: string[],
    vegCount: number,
    recentIds: string[],
  ): MealEntry[] {
    const entries: MealEntry[] = []
    const usedIds = new Set<string>()

    // Pick and add vegetables first (dietary guidelines priority)
    for (let i = 0; i < vegCount; i++) {
      const veg = pickFood(vegPool, foodDb, [...recentIds, ...Array.from(usedIds)])
      if (veg) {
        const grams = 100 + Math.floor(Math.random() * 50) // 100-150g per veg
        entries.push({ foodId: veg.id, grams })
        usedIds.add(veg.id)
      }
    }

    // Pick protein (target ~1/3 of daily protein per meal)
    const protein = pickFood(proteinPool, foodDb, [...recentIds, ...Array.from(usedIds)])
    if (protein) {
      const mealProteinTarget = proteinTarget / 3
      const grams = Math.round((mealProteinTarget / protein.per100g.protein) * 100)
      entries.push({ foodId: protein.id, grams: Math.max(50, Math.min(grams, 250)) })
      usedIds.add(protein.id)
    }

    // Fill remaining calories with staples until budget is substantially met
    let remainingCal = calorieBudget - sumCalories(entries, foodDb)
    while (remainingCal > 100) {
      const staple = pickFood(staplePool, foodDb, [...recentIds, ...Array.from(usedIds)])
      if (!staple) break
      const grams = Math.min(300, Math.round((remainingCal / staple.per100g.calories) * 100))
      if (grams < 20) break
      entries.push({ foodId: staple.id, grams })
      usedIds.add(staple.id)
      remainingCal = calorieBudget - sumCalories(entries, foodDb)
    }

    return entries
  }

  const breakfast = buildMeal(breakfastCal, MEAL_TEMPLATES.breakfast.staples, MEAL_TEMPLATES.breakfast.proteins, MEAL_TEMPLATES.breakfast.extras, 1, recentIds)

  const lunch = buildMeal(lunchCal, MEAL_TEMPLATES.lunch.staples, MEAL_TEMPLATES.lunch.proteins, MEAL_TEMPLATES.lunch.vegetables, 2, recentIds)

  const dinner = buildMeal(dinnerCal, MEAL_TEMPLATES.dinner.staples, MEAL_TEMPLATES.dinner.proteins, MEAL_TEMPLATES.dinner.vegetables, 2, recentIds)

  return { breakfast, lunch, dinner }
}
