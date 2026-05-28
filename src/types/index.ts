// src/types/index.ts

// ---- Enums / Literals ----

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export type FoodCategory = 'staple' | 'protein' | 'dairy_soy' | 'vegetable' | 'fruit' | 'nut_oil'

export type ExerciseType = 'aerobic' | 'anaerobic'

// ---- Food ----

export interface FoodItem {
  id: string
  name: string
  category: FoodCategory
  per100g: {
    calories: number    // kcal
    protein: number     // g
    carbs: number       // g
    fat: number         // g
  }
}

// ---- Meal Plan Entry ----

export interface MealEntry {
  foodId: string
  grams: number
}

export interface MealPlan {
  breakfast: MealEntry[]
  lunch: MealEntry[]
  dinner: MealEntry[]
}

// ---- Exercise Plan Entry ----

export interface ExerciseEntry {
  exerciseId: string
  minutes: number
  calories: number
}

export interface ExercisePlan {
  aerobic: ExerciseEntry[]
  anaerobic: ExerciseEntry[]
}

// ---- User Profile ----

export interface UserProfile {
  gender: 'male' | 'female'
  age: number
  height: number       // cm
  weight: number       // kg
  neck: number         // cm
  waist: number        // cm
  hip: number          // cm
  manualBodyFat: number | null  // %, null = use Navy estimate
  targetBodyFat: number         // %
  activityLevel: ActivityLevel
}

// ---- Daily Plan ----

export interface DailyPlan {
  date: string          // YYYY-MM-DD
  generatedAt: string   // ISO timestamp
  calorieTarget: number // kcal intake target
  meals: MealPlan
  exercises: ExercisePlan
  macros: {
    proteinTarget: number  // g
    fatTarget: number      // g
    carbsTarget: number    // g
  }
}

// ---- Settings ----

export interface AppSettings {
  calorieDeficit: number    // default 500
  breakfastRatio: number    // default 0.3
  lunchRatio: number        // default 0.4
  dinnerRatio: number       // default 0.3
  aerobicRatio: number      // default 0.6
  anaerobicRatio: number    // default 0.4
  proteinPerKg: number      // default 2.0
  fatPerKg: number          // default 0.8
}

// ---- Exercise Definition ----

export interface ExerciseDef {
  id: string
  name: string
  type: ExerciseType
  kcalPerKgPerHour: number  // MET-based calorie burn rate
}
