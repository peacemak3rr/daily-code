// src/composables/useDailyPlan.ts
import { ref, computed, watch } from 'vue'
import type { DailyPlan } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { calculateCalorieTarget } from '@/utils/bodyCalculations'
import { generateMealPlan } from '@/utils/mealPlanner'
import { generateExercisePlan } from '@/utils/exercisePlanner'
import { useProfile } from './useProfile'
import { useSettings } from './useSettings'
import { FOOD_DATABASE } from '@/constants/foodDatabase'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'

const STORAGE_KEY = 'plans'

const plans = ref<DailyPlan[]>(loadFromStorage<DailyPlan[]>(STORAGE_KEY) ?? [])

watch(plans, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useDailyPlan() {
  const { profile } = useProfile()
  const { settings } = useSettings()

  const todayPlan = computed(() => {
    return plans.value.find(p => p.date === todayStr()) ?? null
  })

  const hasTodayPlan = computed(() => todayPlan.value !== null)

  const totalMealCalories = computed(() => {
    const plan = todayPlan.value
    if (!plan) return 0
    const entries = [...plan.meals.breakfast, ...plan.meals.lunch, ...plan.meals.dinner]
    return Math.round(entries.reduce((sum, e) => {
      const food = FOOD_DATABASE.find(f => f.id === e.foodId)
      return sum + (food ? (food.per100g.calories * e.grams) / 100 : 0)
    }, 0))
  })

  const totalExerciseCalories = computed(() => {
    const plan = todayPlan.value
    if (!plan) return 0
    return [...plan.exercises.aerobic, ...plan.exercises.anaerobic]
      .reduce((sum, e) => sum + e.calories, 0)
  })

  function generateTodayPlan(): DailyPlan | null {
    if (!profile.value) return null
    const profileData = profile.value
    const deficit = settings.calorieDeficit
    const calorieTarget = calculateCalorieTarget(profileData, deficit)
    const meals = generateMealPlan(calorieTarget, profileData.weight, settings, FOOD_DATABASE, plans.value)
    const exercises = generateExercisePlan(calorieTarget * 0.3, profileData.weight, {
      aerobicRatio: settings.aerobicRatio,
      anaerobicRatio: settings.anaerobicRatio,
    })

    const plan: DailyPlan = {
      date: todayStr(),
      generatedAt: new Date().toISOString(),
      calorieTarget,
      meals,
      exercises,
      macros: {
        proteinTarget: profileData.weight * settings.proteinPerKg,
        fatTarget: profileData.weight * settings.fatPerKg,
        carbsTarget: 0,
      },
    }

    // Replace existing today plan or append
    const idx = plans.value.findIndex(p => p.date === todayStr())
    if (idx >= 0) {
      plans.value[idx] = plan
    } else {
      plans.value.push(plan)
    }

    return plan
  }

  function ensureTodayPlan(): DailyPlan | null {
    if (todayPlan.value) return todayPlan.value
    return generateTodayPlan()
  }

  function updateMealEntry(mealType: 'breakfast' | 'lunch' | 'dinner', index: number, entry: { foodId?: string; grams?: number }) {
    const plan = todayPlan.value
    if (!plan) return
    const meal = plan.meals[mealType]
    if (index >= 0 && index < meal.length) {
      if (entry.foodId !== undefined) meal[index].foodId = entry.foodId
      if (entry.grams !== undefined) meal[index].grams = entry.grams
    }
  }

  function replaceFood(mealType: 'breakfast' | 'lunch' | 'dinner', index: number, newFoodId: string) {
    updateMealEntry(mealType, index, { foodId: newFoodId })
  }

  function adjustGrams(mealType: 'breakfast' | 'lunch' | 'dinner', index: number, grams: number) {
    updateMealEntry(mealType, index, { grams })
  }

  function updateExerciseEntry(exType: 'aerobic' | 'anaerobic', index: number, entry: { exerciseId?: string; minutes?: number }) {
    const plan = todayPlan.value
    if (!plan) return
    const exercises = plan.exercises[exType]
    if (index >= 0 && index < exercises.length) {
      if (entry.exerciseId !== undefined) exercises[index].exerciseId = entry.exerciseId
      if (entry.minutes !== undefined) {
        exercises[index].minutes = entry.minutes
        const exDef = EXERCISE_DATABASE.find(e => e.id === exercises[index].exerciseId)
        const weight = profile.value?.weight ?? 70
        if (exDef) {
          exercises[index].calories = Math.round((exDef.kcalPerKgPerHour * weight * entry.minutes) / 60)
        }
      }
    }
  }

  return {
    plans,
    todayPlan,
    hasTodayPlan,
    totalMealCalories,
    totalExerciseCalories,
    generateTodayPlan,
    ensureTodayPlan,
    replaceFood,
    adjustGrams,
    updateExerciseEntry,
  }
}
