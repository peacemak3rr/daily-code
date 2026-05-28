// src/utils/__tests__/mealPlanner.test.ts
import { describe, it, expect } from 'vitest'
import { generateMealPlan } from '../mealPlanner'
import { FOOD_DATABASE } from '@/constants/foodDatabase'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/constants/defaults'

const settings: AppSettings = { ...DEFAULT_SETTINGS }

describe('generateMealPlan', () => {
  it('should produce 3 meals with food entries', () => {
    const plan = generateMealPlan(2000, 80, settings, FOOD_DATABASE, [])
    expect(plan.breakfast.length).toBeGreaterThan(0)
    expect(plan.lunch.length).toBeGreaterThan(0)
    expect(plan.dinner.length).toBeGreaterThan(0)
  })

  it('should stay within calorie target', () => {
    const plan = generateMealPlan(2000, 80, settings, FOOD_DATABASE, [])
    const totalCal = [...plan.breakfast, ...plan.lunch, ...plan.dinner].reduce((sum, entry) => {
      const food = FOOD_DATABASE.find(f => f.id === entry.foodId)!
      return sum + (food.per100g.calories * entry.grams) / 100
    }, 0)
    expect(totalCal).toBeGreaterThan(2000 * 0.85)
    expect(totalCal).toBeLessThan(2000 * 1.05)
  })

  it('should include vegetables in lunch and dinner', () => {
    const plan = generateMealPlan(2000, 80, settings, FOOD_DATABASE, [])
    const lunchVeg = plan.lunch.some(e => {
      const f = FOOD_DATABASE.find(x => x.id === e.foodId)!
      return f.category === 'vegetable'
    })
    const dinnerVeg = plan.dinner.some(e => {
      const f = FOOD_DATABASE.find(x => x.id === e.foodId)!
      return f.category === 'vegetable'
    })
    expect(lunchVeg).toBe(true)
    expect(dinnerVeg).toBe(true)
  })
})
