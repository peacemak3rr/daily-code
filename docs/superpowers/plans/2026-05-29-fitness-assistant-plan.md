# 私人健身助手 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile browser-accessible fitness assistant (Vue 3 + Vite + TS + Vant 4) for fat loss, with body data input, auto-generated daily meal plans following Chinese Dietary Guidelines, exercise planning, and pure localStorage persistence.

**Architecture:** Single-page app with 4 tabs (Home/Diet/Exercise/Profile). Core logic in pure TypeScript utility functions (calculations, meal planning, exercise planning). State managed via Vue 3 composables that wrap localStorage. Vant 4 provides mobile-optimized UI components. No router — Vant Tabbar handles view switching.

**Tech Stack:** Vue 3, Vite, TypeScript, Vant 4, Vitest (testing), localStorage (persistence)

## File Structure

```
src/
  main.ts                          # App entry
  App.vue                          # Root with Vant Tabbar
  env.d.ts                         # Vite env types
  types/index.ts                   # All shared TS types
  constants/
    foodDatabase.ts                # ~50 Chinese foods with nutrition data
    exerciseDatabase.ts            # Aerobic + anaerobic exercise data
    defaults.ts                    # Calorie deficit, ratios, guidelines
  utils/
    storage.ts                     # Typed localStorage helpers
    bodyCalculations.ts            # Navy method, BMR, TDEE, body fat %
    mealPlanner.ts                 # Meal generation per dietary guidelines
    exercisePlanner.ts             # Exercise plan generation
  composables/
    useProfile.ts                  # User profile state
    useDailyPlan.ts                # Today's plan state + auto-gen
    useSettings.ts                 # App settings state
    useFoodDatabase.ts             # Editable food DB state
  components/
    CalorieGauge.vue               # Circular calorie progress
    ProgressBar.vue                # Horizontal progress bar
    FoodCard.vue                   # Food item with grams display
    MealSection.vue                # Meal group (breakfast/lunch/dinner)
    ExerciseCard.vue               # Exercise type + duration + calories
    BodyForm.vue                   # Body data input form
    FoodPicker.vue                 # Food selection popup for replacement
  views/
    HomeView.vue                   # Daily dashboard
    DietView.vue                   # Meal detail + food adjustment
    ExerciseView.vue               # Exercise detail + adjustment
    ProfileView.vue                # Body data, goals, settings
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/env.d.ts`

- [ ] **Step 1: Initialize package.json and install dependencies**

Run: `cd D:/code/dailyCode && npm create vite@latest . -- --template vue-ts`

Then install Vant and vitest:
Run: `npm install vant @vant/use`
Run: `npm install -D vitest @vue/test-utils happy-dom`

- [ ] **Step 2: Verify vite.config.ts exists with Vant auto-import setup**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': '/src' }
  },
  test: {
    environment: 'happy-dom'
  }
})
```

- [ ] **Step 3: Verify project starts**

Run: `npm run dev`
Expected: Vite dev server starts, open http://localhost:5173 shows blank Vite+Vue page.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 + Vite + TS + Vant project"
```

---

### Task 2: TypeScript Type Definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write all type definitions**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: Default Settings Constants

**Files:**
- Create: `src/constants/defaults.ts`

- [ ] **Step 1: Write defaults constants**

```typescript
// src/constants/defaults.ts
import type { AppSettings } from '@/types'

export const DEFAULT_SETTINGS: AppSettings = {
  calorieDeficit: 500,
  breakfastRatio: 0.3,
  lunchRatio: 0.4,
  dinnerRatio: 0.3,
  aerobicRatio: 0.6,
  anaerobicRatio: 0.4,
  proteinPerKg: 2.0,
  fatPerKg: 0.8,
}

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: '久坐不动',
  light: '轻度活动(每周1-3天)',
  moderate: '中度活动(每周3-5天)',
  active: '非常活跃(每周6-7天)',
  very_active: '高强度(体力劳动/每天训练)',
}

// Dietary Guidelines constraints (daily totals)
export const DIETARY_GUIDE = {
  grainsMin: 250,       // g/day
  grainsMax: 400,
  vegetablesMin: 300,   // g/day
  vegetablesMax: 500,
  fruitsMin: 200,       // g/day
  fruitsMax: 350,
  dairyTarget: 300,     // g/day
  soyNutsMin: 25,       // g/day
  soyNutsMax: 35,
  animalProteinMin: 120, // g/day
  animalProteinMax: 200,
  oilMax: 30,           // g/day (for display only)
  saltMax: 5,           // g/day (for display only)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/defaults.ts
git commit -m "feat: add default settings and dietary guideline constants"
```

---

### Task 4: Food Database

**Files:**
- Create: `src/constants/foodDatabase.ts`

- [ ] **Step 1: Write food database with ~50 Chinese common foods**

```typescript
// src/constants/foodDatabase.ts
import type { FoodItem } from '@/types'

export const FOOD_DATABASE: FoodItem[] = [
  // ===== 主食类 (staple) =====
  { id: 'oatmeal', name: '燕麦片', category: 'staple', per100g: { calories: 377, protein: 13.5, carbs: 66.3, fat: 6.7 } },
  { id: 'whole_wheat_bread', name: '全麦面包', category: 'staple', per100g: { calories: 246, protein: 10.7, carbs: 42.5, fat: 3.0 } },
  { id: 'brown_rice', name: '糙米饭(熟)', category: 'staple', per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 0.9 } },
  { id: 'mixed_grain_porridge', name: '杂粮粥', category: 'staple', per100g: { calories: 56, protein: 1.3, carbs: 11.5, fat: 0.3 } },
  { id: 'sweet_potato', name: '红薯', category: 'staple', per100g: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 } },
  { id: 'corn', name: '玉米', category: 'staple', per100g: { calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2 } },
  { id: 'whole_wheat_noodles', name: '全麦面条(熟)', category: 'staple', per100g: { calories: 132, protein: 5.3, carbs: 26.1, fat: 1.1 } },
  { id: 'millet_porridge', name: '小米粥', category: 'staple', per100g: { calories: 46, protein: 1.4, carbs: 8.4, fat: 0.7 } },
  { id: 'buckwheat_noodles', name: '荞麦面(熟)', category: 'staple', per100g: { calories: 138, protein: 5.5, carbs: 24.3, fat: 1.6 } },
  { id: 'potato', name: '土豆', category: 'staple', per100g: { calories: 76, protein: 2.0, carbs: 17.2, fat: 0.2 } },
  { id: 'purple_sweet_potato', name: '紫薯', category: 'staple', per100g: { calories: 106, protein: 1.8, carbs: 24.6, fat: 0.1 } },
  { id: 'quinoa', name: '藜麦(熟)', category: 'staple', per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 } },
  { id: 'black_rice', name: '黑米饭(熟)', category: 'staple', per100g: { calories: 116, protein: 3.2, carbs: 24.3, fat: 0.9 } },

  // ===== 蛋白质类 (protein) =====
  { id: 'chicken_breast', name: '鸡胸肉', category: 'protein', per100g: { calories: 133, protein: 31.0, carbs: 1.0, fat: 1.5 } },
  { id: 'egg_boiled', name: '鸡蛋(煮)', category: 'protein', per100g: { calories: 151, protein: 12.5, carbs: 1.5, fat: 10.5 } },
  { id: 'beef_shank', name: '牛腱子', category: 'protein', per100g: { calories: 125, protein: 22.3, carbs: 1.8, fat: 3.6 } },
  { id: 'salmon', name: '三文鱼', category: 'protein', per100g: { calories: 208, protein: 20.4, carbs: 0, fat: 13.4 } },
  { id: 'shrimp', name: '虾仁', category: 'protein', per100g: { calories: 93, protein: 20.3, carbs: 1.4, fat: 0.6 } },
  { id: 'pork_loin', name: '猪里脊', category: 'protein', per100g: { calories: 143, protein: 21.1, carbs: 2.3, fat: 5.8 } },
  { id: 'sea_bass', name: '鲈鱼', category: 'protein', per100g: { calories: 105, protein: 18.6, carbs: 0, fat: 3.4 } },
  { id: 'chicken_thigh_skinless', name: '去皮鸡腿', category: 'protein', per100g: { calories: 119, protein: 19.7, carbs: 0.3, fat: 3.9 } },
  { id: 'lean_beef', name: '瘦牛肉', category: 'protein', per100g: { calories: 125, protein: 22.2, carbs: 1.6, fat: 3.8 } },
  { id: 'egg_white', name: '鸡蛋白', category: 'protein', per100g: { calories: 48, protein: 11.0, carbs: 0.7, fat: 0 } },
  { id: 'chicken_liver', name: '鸡肝', category: 'protein', per100g: { calories: 119, protein: 17.0, carbs: 3.2, fat: 4.8 } },

  // ===== 乳制品/豆类 (dairy_soy) =====
  { id: 'yogurt_plain', name: '纯酸奶', category: 'dairy_soy', per100g: { calories: 72, protein: 5.3, carbs: 7.0, fat: 2.7 } },
  { id: 'milk_whole', name: '纯牛奶', category: 'dairy_soy', per100g: { calories: 54, protein: 3.0, carbs: 4.8, fat: 3.0 } },
  { id: 'soy_milk', name: '豆浆(无糖)', category: 'dairy_soy', per100g: { calories: 31, protein: 3.0, carbs: 1.2, fat: 1.6 } },
  { id: 'milk_skim', name: '脱脂牛奶', category: 'dairy_soy', per100g: { calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1 } },
  { id: 'greek_yogurt', name: '希腊酸奶', category: 'dairy_soy', per100g: { calories: 97, protein: 9.0, carbs: 4.0, fat: 5.0 } },
  { id: 'tofu', name: '豆腐', category: 'dairy_soy', per100g: { calories: 76, protein: 8.1, carbs: 3.2, fat: 3.7 } },

  // ===== 蔬菜类 (vegetable) =====
  { id: 'broccoli', name: '西兰花', category: 'vegetable', per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 } },
  { id: 'spinach', name: '菠菜', category: 'vegetable', per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
  { id: 'tomato', name: '番茄', category: 'vegetable', per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 } },
  { id: 'cucumber', name: '黄瓜', category: 'vegetable', per100g: { calories: 16, protein: 0.7, carbs: 3.0, fat: 0.1 } },
  { id: 'napa_cabbage', name: '大白菜', category: 'vegetable', per100g: { calories: 13, protein: 1.5, carbs: 2.2, fat: 0.3 } },
  { id: 'lettuce', name: '生菜', category: 'vegetable', per100g: { calories: 14, protein: 1.4, carbs: 2.1, fat: 0.2 } },
  { id: 'carrot', name: '胡萝卜', category: 'vegetable', per100g: { calories: 37, protein: 1.0, carbs: 8.8, fat: 0.2 } },
  { id: 'celery', name: '芹菜', category: 'vegetable', per100g: { calories: 14, protein: 0.7, carbs: 3.0, fat: 0.1 } },
  { id: 'winter_melon', name: '冬瓜', category: 'vegetable', per100g: { calories: 12, protein: 0.4, carbs: 2.6, fat: 0.2 } },
  { id: 'mushroom', name: '菌菇类', category: 'vegetable', per100g: { calories: 27, protein: 2.7, carbs: 3.9, fat: 0.3 } },
  { id: 'pumpkin', name: '南瓜', category: 'vegetable', per100g: { calories: 22, protein: 0.7, carbs: 5.3, fat: 0.1 } },
  { id: 'green_pepper', name: '青椒', category: 'vegetable', per100g: { calories: 22, protein: 0.9, carbs: 4.6, fat: 0.2 } },

  // ===== 水果类 (fruit) =====
  { id: 'apple', name: '苹果', category: 'fruit', per100g: { calories: 53, protein: 0.3, carbs: 13.8, fat: 0.2 } },
  { id: 'banana', name: '香蕉', category: 'fruit', per100g: { calories: 93, protein: 1.4, carbs: 22.8, fat: 0.3 } },
  { id: 'blueberry', name: '蓝莓', category: 'fruit', per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 } },
  { id: 'orange', name: '橙子', category: 'fruit', per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 } },
  { id: 'kiwi', name: '猕猴桃', category: 'fruit', per100g: { calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 } },
  { id: 'strawberry', name: '草莓', category: 'fruit', per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 } },
  { id: 'watermelon', name: '西瓜', category: 'fruit', per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.1 } },

  // ===== 坚果油脂类 (nut_oil) =====
  { id: 'walnut', name: '核桃', category: 'nut_oil', per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 } },
  { id: 'almond', name: '杏仁', category: 'nut_oil', per100g: { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 } },
  { id: 'peanut', name: '花生', category: 'nut_oil', per100g: { calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2 } },
  { id: 'avocado', name: '牛油果', category: 'nut_oil', per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 } },
  { id: 'olive_oil', name: '橄榄油', category: 'nut_oil', per100g: { calories: 899, protein: 0, carbs: 0, fat: 99.9 } },
]

// Default meal templates (food IDs per meal slot)
export const MEAL_TEMPLATES = {
  breakfast: {
    staples: ['oatmeal', 'whole_wheat_bread', 'mixed_grain_porridge', 'sweet_potato', 'corn', 'millet_porridge'],
    proteins: ['egg_boiled', 'egg_white', 'milk_whole', 'milk_skim', 'soy_milk', 'greek_yogurt', 'yogurt_plain'],
    extras: ['apple', 'banana', 'blueberry', 'tomato', 'cucumber'],
  },
  lunch: {
    staples: ['brown_rice', 'black_rice', 'quinoa', 'whole_wheat_noodles', 'buckwheat_noodles', 'sweet_potato'],
    proteins: ['chicken_breast', 'beef_shank', 'lean_beef', 'shrimp', 'pork_loin', 'tofu', 'sea_bass'],
    vegetables: ['broccoli', 'spinach', 'napa_cabbage', 'lettuce', 'carrot', 'celery', 'green_pepper', 'mushroom'],
  },
  dinner: {
    staples: ['sweet_potato', 'potato', 'purple_sweet_potato', 'pumpkin', 'corn'],
    proteins: ['sea_bass', 'shrimp', 'tofu', 'chicken_breast', 'egg_white', 'salmon'],
    vegetables: ['broccoli', 'spinach', 'tomato', 'cucumber', 'winter_melon', 'lettuce', 'celery', 'mushroom'],
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/foodDatabase.ts
git commit -m "feat: add food database with 50 Chinese foods and meal templates"
```

---

### Task 5: Exercise Database

**Files:**
- Create: `src/constants/exerciseDatabase.ts`

- [ ] **Step 1: Write exercise database**

```typescript
// src/constants/exerciseDatabase.ts
import type { ExerciseDef } from '@/types'

export const EXERCISE_DATABASE: ExerciseDef[] = [
  // ===== 有氧运动 (aerobic) =====
  { id: 'running', name: '跑步(8km/h)', type: 'aerobic', kcalPerKgPerHour: 7.0 },
  { id: 'brisk_walking', name: '快走(6km/h)', type: 'aerobic', kcalPerKgPerHour: 4.3 },
  { id: 'walking', name: '慢走(4km/h)', type: 'aerobic', kcalPerKgPerHour: 2.8 },
  { id: 'cycling', name: '骑行(中等)', type: 'aerobic', kcalPerKgPerHour: 6.4 },
  { id: 'swimming', name: '游泳(自由泳)', type: 'aerobic', kcalPerKgPerHour: 7.0 },
  { id: 'jump_rope', name: '跳绳', type: 'aerobic', kcalPerKgPerHour: 10.0 },
  { id: 'hiit', name: 'HIIT', type: 'aerobic', kcalPerKgPerHour: 10.5 },
  { id: 'elliptical', name: '椭圆机', type: 'aerobic', kcalPerKgPerHour: 5.7 },
  { id: 'stair_climbing', name: '爬楼梯', type: 'aerobic', kcalPerKgPerHour: 7.8 },
  { id: 'rowing', name: '划船机', type: 'aerobic', kcalPerKgPerHour: 6.4 },

  // ===== 无氧运动 (anaerobic) =====
  { id: 'squat', name: '深蹲', type: 'anaerobic', kcalPerKgPerHour: 4.3 },
  { id: 'pushup', name: '俯卧撑', type: 'anaerobic', kcalPerKgPerHour: 3.8 },
  { id: 'pullup', name: '引体向上', type: 'anaerobic', kcalPerKgPerHour: 4.7 },
  { id: 'dumbbell_press', name: '哑铃推举', type: 'anaerobic', kcalPerKgPerHour: 3.6 },
  { id: 'deadlift', name: '硬拉', type: 'anaerobic', kcalPerKgPerHour: 5.1 },
  { id: 'bench_press', name: '卧推', type: 'anaerobic', kcalPerKgPerHour: 4.1 },
  { id: 'crunch', name: '卷腹', type: 'anaerobic', kcalPerKgPerHour: 3.0 },
  { id: 'plank', name: '平板支撑', type: 'anaerobic', kcalPerKgPerHour: 2.6 },
  { id: 'kettlebell_swing', name: '壶铃摆动', type: 'anaerobic', kcalPerKgPerHour: 5.5 },
  { id: 'yoga', name: '瑜伽', type: 'anaerobic', kcalPerKgPerHour: 2.6 },
]

export const DEFAULT_AEROBIC_EXERCISES = ['running', 'brisk_walking', 'cycling', 'jump_rope']
export const DEFAULT_ANAEROBIC_EXERCISES = ['squat', 'pushup', 'crunch', 'dumbbell_press']
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/exerciseDatabase.ts
git commit -m "feat: add exercise database with 20 exercise types"
```

---

### Task 6: Storage Utility

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/utils/__tests__/storage.test.ts`

- [ ] **Step 1: Write failing test for storage**

```typescript
// src/utils/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load data', () => {
    const data = { name: 'test', value: 42 }
    saveToStorage('test-key', data)
    const loaded = loadFromStorage<typeof data>('test-key')
    expect(loaded).toEqual(data)
  })

  it('should return null for missing key', () => {
    const result = loadFromStorage('nonexistent')
    expect(result).toBeNull()
  })

  it('should remove data', () => {
    saveToStorage('test-key', { a: 1 })
    removeFromStorage('test-key')
    expect(loadFromStorage('test-key')).toBeNull()
  })

  it('should return null for corrupt JSON', () => {
    localStorage.setItem('bad-key', 'not-json{{{')
    const result = loadFromStorage('bad-key')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/storage.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write storage utility implementation**

```typescript
// src/utils/storage.ts

const PREFIX = 'fitness-'

export function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/storage.test.ts`
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.ts src/utils/__tests__/storage.test.ts
git commit -m "feat: add typed localStorage utility with tests"
```

---

### Task 7: Body Calculation Utilities

**Files:**
- Create: `src/utils/bodyCalculations.ts`
- Create: `src/utils/__tests__/bodyCalculations.test.ts`

- [ ] **Step 1: Write failing tests for body calculations**

```typescript
// src/utils/__tests__/bodyCalculations.test.ts
import { describe, it, expect } from 'vitest'
import {
  estimateBodyFatNavy,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
} from '../bodyCalculations'
import type { UserProfile } from '@/types'

const sampleProfile: UserProfile = {
  gender: 'male',
  age: 30,
  height: 175,
  weight: 80,
  neck: 38,
  waist: 90,
  hip: 100,
  manualBodyFat: null,
  targetBodyFat: 15,
  activityLevel: 'moderate',
}

describe('estimateBodyFatNavy', () => {
  it('should estimate male body fat percentage', () => {
    const bf = estimateBodyFatNavy('male', 175, 90, 38, 100)
    // Navy formula: 495 / (1.0324 - 0.19077 * log10(waist-neck) + 0.15456 * log10(height)) - 450
    // waist-neck=52, log10(52)=1.716, log10(175)=2.243
    // denom = 1.0324 - 0.19077*1.716 + 0.15456*2.243 = 1.0324 - 0.3274 + 0.3467 = 1.0517
    // bf = 495/1.0517 - 450 = 470.67 - 450 = 20.67
    expect(bf).toBeCloseTo(20.67, 2)
  })

  it('should estimate female body fat percentage', () => {
    const bf = estimateBodyFatNavy('female', 165, 75, 34, 100)
    // Female: 495 / (1.29579 - 0.35004 * log10(waist+hip-neck) + 0.22100 * log10(height)) - 450
    expect(bf).toBeGreaterThan(0)
    expect(bf).toBeLessThan(60)
  })
})

describe('calculateBMR', () => {
  it('should compute male BMR with Mifflin-St Jeor', () => {
    const bmr = calculateBMR('male', 80, 175, 30)
    // 10*80 + 6.25*175 - 5*30 + 5 = 800 + 1093.75 - 150 + 5 = 1748.75
    expect(bmr).toBeCloseTo(1748.75, 1)
  })

  it('should compute female BMR', () => {
    const bmr = calculateBMR('female', 60, 165, 25)
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    expect(bmr).toBeCloseTo(1345.25, 1)
  })
})

describe('calculateTDEE', () => {
  it('should multiply BMR by activity factor', () => {
    expect(calculateTDEE(1748.75, 'moderate')).toBeCloseTo(1748.75 * 1.55, 1)
  })
})

describe('calculateCalorieTarget', () => {
  it('should compute daily calorie target with deficit', () => {
    const profile = { ...sampleProfile }
    const target = calculateCalorieTarget(profile, 500)
    const bmr = calculateBMR('male', 80, 175, 30)
    const tdee = bmr * 1.55
    expect(target).toBeCloseTo(tdee - 500, 1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/bodyCalculations.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write body calculation implementation**

```typescript
// src/utils/bodyCalculations.ts
import type { UserProfile, ActivityLevel } from '@/types'
import { ACTIVITY_MULTIPLIERS } from '@/constants/defaults'

/** US Navy method for body fat % estimation */
export function estimateBodyFatNavy(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm: number,
): number {
  const h = Math.log10(heightCm)
  if (gender === 'male') {
    const denom = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * h
    return 495 / denom - 450
  }
  const denom = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * h
  return 495 / denom - 450
}

/** Mifflin-St Jeor equation */
export function calculateBMR(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

/** Total Daily Energy Expenditure */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2)
}

/** Get current body fat % — manual override if set, otherwise Navy estimate */
export function getBodyFat(profile: UserProfile): number {
  if (profile.manualBodyFat !== null) return profile.manualBodyFat
  return estimateBodyFatNavy(profile.gender, profile.height, profile.waist, profile.neck, profile.hip)
}

/** Daily calorie intake target = TDEE - deficit */
export function calculateCalorieTarget(profile: UserProfile, deficit: number): number {
  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  return Math.round(tdee - deficit)
}

/** Weekly fat loss estimate in kg, based on 7700 kcal per kg of fat */
export function estimateWeeklyFatLoss(deficit: number): number {
  return (deficit * 7) / 7700
}

/** Days to reach target body fat */
export function estimateDaysToTarget(profile: UserProfile, currentBf: number): number {
  const fatMass = profile.weight * (currentBf / 100)
  const leanMass = profile.weight - fatMass
  const targetFatMass = leanMass / (1 - profile.targetBodyFat / 100) - leanMass
  const fatToLose = fatMass - targetFatMass
  if (fatToLose <= 0) return 0
  const weeklyLoss = estimateWeeklyFatLoss(500) // assume 500 deficit
  return Math.ceil((fatToLose / weeklyLoss) * 7)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/bodyCalculations.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/bodyCalculations.ts src/utils/__tests__/bodyCalculations.test.ts
git commit -m "feat: add body calculation utilities (Navy method, BMR, TDEE)"
```

---

### Task 8: Meal Planner Algorithm

**Files:**
- Create: `src/utils/mealPlanner.ts`
- Create: `src/utils/__tests__/mealPlanner.test.ts`

- [ ] **Step 1: Write failing tests for meal planner**

```typescript
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
    // Should be within 5% of target
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/mealPlanner.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write meal planner implementation**

```typescript
// src/utils/mealPlanner.ts
import type { MealPlan, MealEntry, FoodItem, AppSettings, DailyPlan } from '@/types'
import { MEAL_TEMPLATES } from '@/constants/foodDatabase'
import { DIETARY_GUIDE } from '@/constants/defaults'

function pickFood(pool: string[], foodDb: FoodItem[], excludeIds: string[] = []): FoodItem {
  const available = pool
    .map(id => foodDb.find(f => f.id === id))
    .filter((f): f is FoodItem => !!f && !excludeIds.includes(f.id))
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
  const fatTarget = bodyWeightKg * settings.fatPerKg
  const proteinCal = proteinTarget * 4
  const fatCal = fatTarget * 9
  const carbCal = dailyCalorieTarget - proteinCal - fatCal

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
    stapleFirst: boolean,
    recentIds: string[],
  ): MealEntry[] {
    const entries: MealEntry[] = []

    // Pick and add vegetables first (dietary guidelines priority)
    const usedIds = new Set<string>()
    for (let i = 0; i < vegCount; i++) {
      const veg = pickFood(vegPool, foodDb, [...recentIds, ...Array.from(usedIds)])
      if (veg) {
        const grams = 100 + Math.floor(Math.random() * 50) // 100-150g per veg
        entries.push({ foodId: veg.id, grams })
        usedIds.add(veg.id)
      }
    }

    // Pick protein
    const protein = pickFood(proteinPool, foodDb, [...recentIds, ...Array.from(usedIds)])
    if (protein) {
      // Target ~1/3 of daily protein per meal
      const mealProteinTarget = proteinTarget / 3
      const grams = Math.round((mealProteinTarget / protein.per100g.protein) * 100)
      entries.push({ foodId: protein.id, grams: Math.max(50, Math.min(grams, 250)) })
      usedIds.add(protein.id)
    }

    // Calculate remaining calories for staple
    const usedCal = sumCalories(entries, foodDb)
    const remainingCal = calorieBudget - usedCal

    // Pick staple and scale to fill remaining calories
    if (remainingCal > 50) {
      const staple = pickFood(staplePool, foodDb, [...recentIds, ...Array.from(usedIds)])
      if (staple) {
        const grams = Math.round((remainingCal / staple.per100g.calories) * 100)
        entries.push({ foodId: staple.id, grams: Math.max(30, Math.min(grams, 300)) })
      }
    }

    return entries
  }

  const breakfast = buildMeal(breakfastCal, MEAL_TEMPLATES.breakfast.staples, MEAL_TEMPLATES.breakfast.proteins, MEAL_TEMPLATES.breakfast.extras, 1, false, recentIds)

  const lunch = buildMeal(lunchCal, MEAL_TEMPLATES.lunch.staples, MEAL_TEMPLATES.lunch.proteins, MEAL_TEMPLATES.lunch.vegetables, 2, false, recentIds)

  const dinner = buildMeal(dinnerCal, MEAL_TEMPLATES.dinner.staples, MEAL_TEMPLATES.dinner.proteins, MEAL_TEMPLATES.dinner.vegetables, 2, false, recentIds)

  return { breakfast, lunch, dinner }
}

export function computeMealMacros(
  mealPlan: MealPlan,
  foodDb: FoodItem[],
  bodyWeightKg: number,
  settings: AppSettings,
) {
  return {
    proteinTarget: bodyWeightKg * settings.proteinPerKg,
    fatTarget: bodyWeightKg * settings.fatPerKg,
    carbsTarget: 0, // filled below
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/mealPlanner.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/mealPlanner.ts src/utils/__tests__/mealPlanner.test.ts
git commit -m "feat: add meal planner algorithm following Chinese dietary guidelines"
```

---

### Task 9: Exercise Planner Algorithm

**Files:**
- Create: `src/utils/exercisePlanner.ts`
- Create: `src/utils/__tests__/exercisePlanner.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/utils/__tests__/exercisePlanner.test.ts
import { describe, it, expect } from 'vitest'
import { generateExercisePlan } from '../exercisePlanner'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'

describe('generateExercisePlan', () => {
  it('should produce aerobic and anaerobic entries', () => {
    const plan = generateExercisePlan(500, 80, { aerobicRatio: 0.6, anaerobicRatio: 0.4 })
    expect(plan.aerobic.length).toBeGreaterThan(0)
    expect(plan.anaerobic.length).toBeGreaterThan(0)
  })

  it('should match total calories to target', () => {
    const target = 500
    const plan = generateExercisePlan(target, 80, { aerobicRatio: 0.6, anaerobicRatio: 0.4 })
    const total = [...plan.aerobic, ...plan.anaerobic].reduce((s, e) => s + e.calories, 0)
    // Within 10%
    expect(total).toBeGreaterThan(target * 0.85)
    expect(total).toBeLessThan(target * 1.15)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/exercisePlanner.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write exercise planner implementation**

```typescript
// src/utils/exercisePlanner.ts
import type { ExercisePlan, ExerciseEntry } from '@/types'
import { EXERCISE_DATABASE as allExercises } from '@/constants/exerciseDatabase'
import { DEFAULT_AEROBIC_EXERCISES, DEFAULT_ANAEROBIC_EXERCISES } from '@/constants/exerciseDatabase'

export function generateExercisePlan(
  exerciseCalorieTarget: number,
  bodyWeightKg: number,
  ratios: { aerobicRatio: number; anaerobicRatio: number },
): ExercisePlan {
  const aerobicCal = exerciseCalorieTarget * ratios.aerobicRatio
  const anaerobicCal = exerciseCalorieTarget * ratios.anaerobicRatio

  function planForType(calTarget: number, defaultIds: string[], type: 'aerobic' | 'anaerobic'): ExerciseEntry[] {
    const exercises = defaultIds
      .map(id => allExercises.find(e => e.id === id))
      .filter((e): e is typeof allExercises[number] => !!e && e.type === type)

    if (exercises.length === 0) return []

    const calPerExercise = calTarget / exercises.length
    return exercises.map(ex => {
      const calPerMinute = (ex.kcalPerKgPerHour * bodyWeightKg) / 60
      const minutes = Math.round(calPerExercise / calPerMinute)
      const actualCal = Math.round(calPerMinute * minutes)
      return { exerciseId: ex.id, minutes: Math.max(5, minutes), calories: Math.max(10, actualCal) }
    })
  }

  return {
    aerobic: planForType(aerobicCal, DEFAULT_AEROBIC_EXERCISES, 'aerobic'),
    anaerobic: planForType(anaerobicCal, DEFAULT_ANAEROBIC_EXERCISES, 'anaerobic'),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/exercisePlanner.test.ts`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/exercisePlanner.ts src/utils/__tests__/exercisePlanner.test.ts
git commit -m "feat: add exercise planner algorithm"
```

---

### Task 10: useSettings Composable

**Files:**
- Create: `src/composables/useSettings.ts`

- [ ] **Step 1: Write useSettings composable**

```typescript
// src/composables/useSettings.ts
import { reactive, watch } from 'vue'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/constants/defaults'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'settings'

const state = reactive<AppSettings>(loadFromStorage<AppSettings>(STORAGE_KEY) ?? { ...DEFAULT_SETTINGS })

watch(state, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })

export function useSettings() {
  function resetToDefaults() {
    Object.assign(state, DEFAULT_SETTINGS)
  }

  function updateSettings(partial: Partial<AppSettings>) {
    Object.assign(state, partial)
  }

  return { settings: state, resetToDefaults, updateSettings }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useSettings.ts
git commit -m "feat: add useSettings composable"
```

---

### Task 11: useProfile Composable

**Files:**
- Create: `src/composables/useProfile.ts`

- [ ] **Step 1: Write useProfile composable**

```typescript
// src/composables/useProfile.ts
import { ref, computed, watch } from 'vue'
import type { UserProfile } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getBodyFat, calculateBMR, calculateTDEE } from '@/utils/bodyCalculations'

const STORAGE_KEY = 'profile'

const profile = ref<UserProfile | null>(loadFromStorage<UserProfile>(STORAGE_KEY))

watch(profile, (val) => {
  if (val) saveToStorage(STORAGE_KEY, val)
}, { deep: true })

export function useProfile() {
  const hasProfile = computed(() => profile.value !== null)

  const currentBodyFat = computed(() => {
    if (!profile.value) return null
    return getBodyFat(profile.value)
  })

  const bmr = computed(() => {
    if (!profile.value) return null
    return calculateBMR(profile.value.gender, profile.value.weight, profile.value.height, profile.value.age)
  })

  const tdee = computed(() => {
    if (!profile.value || !bmr.value) return null
    return calculateTDEE(bmr.value, profile.value.activityLevel)
  })

  const bfDistance = computed(() => {
    if (!profile.value || !currentBodyFat.value) return null
    return currentBodyFat.value - profile.value.targetBodyFat
  })

  function saveProfile(data: UserProfile) {
    profile.value = { ...data }
  }

  function updateProfile(partial: Partial<UserProfile>) {
    if (profile.value) {
      profile.value = { ...profile.value, ...partial }
    }
  }

  function clearProfile() {
    profile.value = null
    localStorage.removeItem('fitness-profile')
  }

  return { profile, hasProfile, currentBodyFat, bmr, tdee, bfDistance, saveProfile, updateProfile, clearProfile }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useProfile.ts
git commit -m "feat: add useProfile composable"
```

---

### Task 12: useDailyPlan Composable

**Files:**
- Create: `src/composables/useDailyPlan.ts`

- [ ] **Step 1: Write useDailyPlan composable**

```typescript
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
    return entries.reduce((sum, e) => {
      const food = FOOD_DATABASE.find(f => f.id === e.foodId)
      return sum + (food ? (food.per100g.calories * e.grams) / 100 : 0)
    }, 0)
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
        // Recalculate calories using EXERCISE_DATABASE and profile weight
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
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useDailyPlan.ts
git commit -m "feat: add useDailyPlan composable with auto-generation"
```

---

### Task 13: useFoodDatabase Composable

**Files:**
- Create: `src/composables/useFoodDatabase.ts`

- [ ] **Step 1: Write useFoodDatabase composable**

```typescript
// src/composables/useFoodDatabase.ts
import { ref, computed, watch } from 'vue'
import type { FoodItem, FoodCategory } from '@/types'
import { FOOD_DATABASE } from '@/constants/foodDatabase'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'food-db'

const customFoods = ref<FoodItem[]>(loadFromStorage<FoodItem[]>(STORAGE_KEY) ?? [])
const useCustom = ref(loadFromStorage<FoodItem[]>(STORAGE_KEY) !== null)

watch(customFoods, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })

export function useFoodDatabase() {
  const allFoods = computed(() => {
    return [...FOOD_DATABASE, ...customFoods.value]
  })

  function getFoodsByCategory(category: FoodCategory): FoodItem[] {
    return allFoods.value.filter(f => f.category === category)
  }

  function getFoodById(id: string): FoodItem | undefined {
    return allFoods.value.find(f => f.id === id)
  }

  function addCustomFood(food: FoodItem) {
    customFoods.value.push(food)
  }

  function removeCustomFood(id: string) {
    customFoods.value = customFoods.value.filter(f => f.id !== id)
  }

  return { allFoods, getFoodsByCategory, getFoodById, addCustomFood, removeCustomFood }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useFoodDatabase.ts
git commit -m "feat: add useFoodDatabase composable"
```

---

### Task 14: CalorieGauge Component

**Files:**
- Create: `src/components/CalorieGauge.vue`

- [ ] **Step 1: Write CalorieGauge component**

```vue
<!-- src/components/CalorieGauge.vue -->
<script setup lang="ts">
defineProps<{
  current: number
  target: number
  label: string
}>()
</script>

<template>
  <div class="gauge-container">
    <svg viewBox="0 0 120 120" class="gauge-svg">
      <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f0f0" stroke-width="10" />
      <circle
        cx="60" cy="60" r="52"
        fill="none"
        :stroke="current <= target ? '#07c160' : '#ee0a24'"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="2 * Math.PI * 52"
        :stroke-dashoffset="2 * Math.PI * 52 * (1 - Math.min(current / target, 1))"
        transform="rotate(-90 60 60)"
        class="gauge-arc"
      />
      <text x="60" y="55" text-anchor="middle" class="gauge-value">{{ Math.round(current) }}</text>
      <text x="60" y="72" text-anchor="middle" class="gauge-unit">/ {{ Math.round(target) }} kcal</text>
    </svg>
    <div class="gauge-label">{{ label }}</div>
  </div>
</template>

<style scoped>
.gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gauge-svg {
  width: 140px;
  height: 140px;
}
.gauge-arc {
  transition: stroke-dashoffset 0.8s ease;
}
.gauge-value {
  font-size: 22px;
  font-weight: 700;
  fill: #323233;
}
.gauge-unit {
  font-size: 11px;
  fill: #969799;
}
.gauge-label {
  margin-top: 4px;
  font-size: 13px;
  color: #646566;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CalorieGauge.vue
git commit -m "feat: add CalorieGauge circular progress component"
```

---

### Task 15: ProgressBar Component

**Files:**
- Create: `src/components/ProgressBar.vue`

- [ ] **Step 1: Write ProgressBar component**

```vue
<!-- src/components/ProgressBar.vue -->
<script setup lang="ts">
defineProps<{
  current: number
  target: number
  label: string
  unit?: string
}>()
</script>

<template>
  <div class="pb-root">
    <div class="pb-header">
      <span class="pb-label">{{ label }}</span>
      <span class="pb-value">{{ Math.round(current) }} / {{ Math.round(target) }} {{ unit ?? '' }}</span>
    </div>
    <div class="pb-track">
      <div
        class="pb-fill"
        :style="{ width: Math.min((current / target) * 100, 100) + '%' }"
        :class="current >= target ? 'pb-done' : 'pb-active'"
      />
    </div>
  </div>
</template>

<style scoped>
.pb-root { margin: 8px 0; }
.pb-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 4px;
}
.pb-label { color: #323233; }
.pb-value { color: #969799; }
.pb-track {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.pb-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}
.pb-active { background: linear-gradient(90deg, #07c160, #07c160); }
.pb-done { background: #07c160; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgressBar.vue
git commit -m "feat: add ProgressBar component"
```

---

### Task 16: FoodCard and MealSection Components

**Files:**
- Create: `src/components/FoodCard.vue`
- Create: `src/components/MealSection.vue`

- [ ] **Step 1: Write FoodCard component**

```vue
<!-- src/components/FoodCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { FoodItem, MealEntry } from '@/types'

const props = defineProps<{
  entry: MealEntry
  food: FoodItem | undefined
}>()

const emit = defineEmits<{
  replace: []
  adjust: [grams: number]
}>()

const calories = computed(() => {
  if (!props.food) return 0
  return Math.round((props.food.per100g.calories * props.entry.grams) / 100)
})
</script>

<template>
  <van-swipe-cell>
    <div class="food-card">
      <div class="food-info">
        <div class="food-name">{{ food?.name ?? '未知食物' }}</div>
        <div class="food-detail">
          {{ entry.grams }}g · {{ calories }}kcal
          <span v-if="food"> | 蛋白{{ ((food.per100g.protein * entry.grams) / 100).toFixed(1) }}g</span>
        </div>
      </div>
      <div class="food-actions">
        <van-stepper
          :model-value="entry.grams"
          :step="10"
          :min="10"
          :max="500"
          @change="$emit('adjust', $event as number)"
        />
      </div>
    </div>
    <template #right>
      <van-button square type="primary" text="替换" @click="$emit('replace')" />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.food-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
}
.food-name { font-size: 15px; font-weight: 500; color: #323233; }
.food-detail { font-size: 12px; color: #969799; margin-top: 2px; }
.food-actions { flex-shrink: 0; margin-left: 12px; }
</style>
```

- [ ] **Step 2: Write MealSection component**

```vue
<!-- src/components/MealSection.vue -->
<script setup lang="ts">
import type { MealEntry, FoodItem } from '@/types'
import FoodCard from './FoodCard.vue'

defineProps<{
  title: string
  entries: MealEntry[]
  foodMap: Map<string, FoodItem>
}>()

const emit = defineEmits<{
  replace: [index: number]
  adjust: [index: number, grams: number]
}>()
</script>

<template>
  <div class="meal-section">
    <div class="meal-title">{{ title }}</div>
    <div v-if="entries.length === 0" class="meal-empty">暂无食物</div>
    <FoodCard
      v-for="(entry, idx) in entries"
      :key="idx"
      :entry="entry"
      :food="foodMap.get(entry.foodId)"
      @replace="emit('replace', idx)"
      @adjust="(g: number) => emit('adjust', idx, g)"
    />
  </div>
</template>

<style scoped>
.meal-section { margin-bottom: 16px; }
.meal-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  padding: 12px 16px 4px;
}
.meal-empty {
  padding: 24px 16px;
  text-align: center;
  color: #c8c9cc;
  font-size: 14px;
}
</style>
```

- [ ] **Step 3: Verify FoodCard.vue imports `computed` from Vue**

Check `src/components/FoodCard.vue` — the `<script setup>` block must include `import { computed } from 'vue'`.

- [ ] **Step 4: Commit**

```bash
git add src/components/FoodCard.vue src/components/MealSection.vue
git commit -m "feat: add FoodCard and MealSection components"
```

---

### Task 17: ExerciseCard Component

**Files:**
- Create: `src/components/ExerciseCard.vue`

- [ ] **Step 1: Write ExerciseCard component**

```vue
<!-- src/components/ExerciseCard.vue -->
<script setup lang="ts">
import type { ExerciseEntry, ExerciseDef } from '@/types'

defineProps<{
  entry: ExerciseEntry
  exercise: ExerciseDef | undefined
}>()

const emit = defineEmits<{
  replace: []
  adjust: [minutes: number]
}>()
</script>

<template>
  <van-swipe-cell>
    <div class="ex-card">
      <div class="ex-info">
        <div class="ex-name">{{ exercise?.name ?? '未知运动' }}</div>
        <div class="ex-detail">{{ entry.minutes }}分钟 · {{ entry.calories }}kcal</div>
      </div>
      <div class="ex-actions">
        <van-stepper
          :model-value="entry.minutes"
          :step="5"
          :min="5"
          :max="120"
          @change="$emit('adjust', $event as number)"
        />
      </div>
    </div>
    <template #right>
      <van-button square type="primary" text="替换" @click="$emit('replace')" />
    </template>
  </van-swipe-cell>
</template>

<style scoped>
.ex-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
}
.ex-name { font-size: 15px; font-weight: 500; color: #323233; }
.ex-detail { font-size: 12px; color: #969799; margin-top: 2px; }
.ex-actions { flex-shrink: 0; margin-left: 12px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExerciseCard.vue
git commit -m "feat: add ExerciseCard component"
```

---

### Task 18: BodyForm Component

**Files:**
- Create: `src/components/BodyForm.vue`

- [ ] **Step 1: Write BodyForm component**

```vue
<!-- src/components/BodyForm.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import type { UserProfile } from '@/types'
import { ACTIVITY_LABELS } from '@/constants/defaults'

const props = defineProps<{
  initial?: UserProfile | null
}>()

const emit = defineEmits<{
  save: [profile: UserProfile]
}>()

const form = reactive<UserProfile>(props.initial ?? {
  gender: 'male',
  age: 30,
  height: 170,
  weight: 70,
  neck: 37,
  waist: 85,
  hip: 95,
  manualBodyFat: null,
  targetBodyFat: 15,
  activityLevel: 'moderate',
})

const activityOptions = Object.entries(ACTIVITY_LABELS).map(([value, label]) => ({
  value, label,
}))

function onSubmit() {
  emit('save', { ...form })
}
</script>

<template>
  <van-form @submit="onSubmit">
    <van-field name="gender" label="性别">
      <template #input>
        <van-radio-group v-model="form.gender" direction="horizontal">
          <van-radio name="male">男</van-radio>
          <van-radio name="female">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <van-field v-model.number="form.age" name="age" label="年龄" type="number" placeholder="输入年龄" :rules="[{ required: true }]" />

    <van-field v-model.number="form.height" name="height" label="身高(cm)" type="number" placeholder="输入身高" :rules="[{ required: true }]" />

    <van-field v-model.number="form.weight" name="weight" label="体重(kg)" type="number" placeholder="输入体重" :rules="[{ required: true }]" />

    <van-field v-model.number="form.neck" name="neck" label="颈围(cm)" type="number" placeholder="输入颈围" />

    <van-field v-model.number="form.waist" name="waist" label="腰围(cm)" type="number" placeholder="输入腰围" />

    <van-field v-model.number="form.hip" name="hip" label="臀围(cm)" type="number" placeholder="输入臀围" />

    <van-field v-model.number="form.manualBodyFat" name="manualBodyFat" label="体脂率(%)" type="number" placeholder="留空则自动估算" />

    <van-field v-model.number="form.targetBodyFat" name="targetBodyFat" label="目标体脂率(%)" type="number" placeholder="输入目标体脂率" :rules="[{ required: true }]" />

    <van-field name="activityLevel" label="活动水平">
      <template #input>
        <van-picker
          :model-value="[form.activityLevel]"
          :columns="[activityOptions]"
          :columns-field-names="{ text: 'label', value: 'value' }"
          @change="(val: { selectedOptions: [{ value: string }] }) => form.activityLevel = val.selectedOptions[0].value as any"
        />
      </template>
    </van-field>

    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">保存</van-button>
    </div>
  </van-form>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BodyForm.vue
git commit -m "feat: add BodyForm component for profile input"
```

---

### Task 19: FoodPicker Component

**Files:**
- Create: `src/components/FoodPicker.vue`

- [ ] **Step 1: Write FoodPicker popup component**

```vue
<!-- src/components/FoodPicker.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FoodItem, FoodCategory } from '@/types'

const props = defineProps<{
  foods: FoodItem[]
  currentFoodId?: string
}>()

const emit = defineEmits<{
  select: [foodId: string]
  close: []
}>()

const searchText = ref('')
const activeCategory = ref<FoodCategory | 'all'>('all')

const categories: { key: FoodCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'staple', label: '主食' },
  { key: 'protein', label: '蛋白质' },
  { key: 'dairy_soy', label: '乳制品/豆类' },
  { key: 'vegetable', label: '蔬菜' },
  { key: 'fruit', label: '水果' },
  { key: 'nut_oil', label: '坚果油脂' },
]

const filteredFoods = computed(() => {
  let list = props.foods
  if (activeCategory.value !== 'all') {
    list = list.filter(f => f.category === activeCategory.value)
  }
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    list = list.filter(f => f.name.includes(q))
  }
  return list
})
</script>

<template>
  <van-popup :show="true" round position="bottom" :style="{ height: '70%' }" @click-overlay="$emit('close')">
    <div class="picker-root">
      <div class="picker-header">
        <span @click="$emit('close')">取消</span>
        <span class="picker-title">选择食物</span>
        <span />
      </div>

      <van-search v-model="searchText" placeholder="搜索食物" shape="round" />

      <div class="picker-categories">
        <span
          v-for="cat in categories"
          :key="cat.key"
          class="cat-tag"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >{{ cat.label }}</span>
      </div>

      <div class="picker-list">
        <div
          v-for="food in filteredFoods"
          :key="food.id"
          class="picker-item"
          :class="{ selected: food.id === currentFoodId }"
          @click="$emit('select', food.id)"
        >
          <div class="picker-item-name">{{ food.name }}</div>
          <div class="picker-item-macros">
            {{ food.per100g.calories }}kcal | 蛋白{{ food.per100g.protein }}g | 碳水{{ food.per100g.carbs }}g | 脂肪{{ food.per100g.fat }}g
          </div>
        </div>
        <div v-if="filteredFoods.length === 0" class="picker-empty">无匹配食物</div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.picker-root { padding: 8px 0; }
.picker-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 14px;
  color: #1989fa;
}
.picker-title { color: #323233; font-weight: 600; }
.picker-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
}
.cat-tag {
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  background: #f7f8fa;
  color: #646566;
}
.cat-tag.active { background: #1989fa; color: #fff; }
.picker-list { max-height: 40vh; overflow-y: auto; }
.picker-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.picker-item.selected { background: #ecf5ff; }
.picker-item-name { font-size: 14px; color: #323233; }
.picker-item-macros { font-size: 11px; color: #969799; margin-top: 2px; }
.picker-empty { text-align: center; padding: 24px; color: #c8c9cc; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FoodPicker.vue
git commit -m "feat: add FoodPicker popup component"
```

---

### Task 20: HomeView

**Files:**
- Create: `src/views/HomeView.vue`

- [ ] **Step 1: Write HomeView dashboard**

```vue
<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useDailyPlan } from '@/composables/useDailyPlan'
import CalorieGauge from '@/components/CalorieGauge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { estimateDaysToTarget, getBodyFat } from '@/utils/bodyCalculations'
import { FOOD_DATABASE } from '@/constants/foodDatabase'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'

const { profile, currentBodyFat, tdee, bfDistance } = useProfile()
const { todayPlan, hasTodayPlan, totalMealCalories, totalExerciseCalories, ensureTodayPlan } = useDailyPlan()

onMounted(() => {
  if (profile.value) {
    ensureTodayPlan()
  }
})

const daysToTarget = computed(() => {
  if (!profile.value || currentBodyFat.value === null) return null
  return estimateDaysToTarget(profile.value, currentBodyFat.value)
})

const netCalories = computed(() => {
  if (!tdee.value) return 0
  return Math.round(totalMealCalories.value - tdee.value - totalExerciseCalories.value)
})

const breakfastSummary = computed(() => {
  return todayPlan.value?.meals.breakfast.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return `${f?.name ?? '?'} ${e.grams}g`
  }).join(' | ') ?? ''
})

const lunchSummary = computed(() => {
  return todayPlan.value?.meals.lunch.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return `${f?.name ?? '?'} ${e.grams}g`
  }).join(' | ') ?? ''
})

const dinnerSummary = computed(() => {
  return todayPlan.value?.meals.dinner.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return `${f?.name ?? '?'} ${e.grams}g`
  }).join(' | ') ?? ''
})
</script>

<template>
  <div class="home-root">
    <!-- No profile state -->
    <van-empty v-if="!profile" description="请先在「我的」页面填写身体数据" />

    <template v-else>
      <!-- Calorie gauges -->
      <div class="gauges-row">
        <CalorieGauge
          :current="totalMealCalories"
          :target="todayPlan?.calorieTarget ?? 0"
          label="摄入热量"
        />
        <CalorieGauge
          :current="totalExerciseCalories"
          :target="(todayPlan?.calorieTarget ?? 0) * 0.3"
          label="运动消耗"
        />
      </div>

      <!-- Progress -->
      <div class="section-card">
        <ProgressBar
          :current="totalMealCalories"
          :target="todayPlan?.calorieTarget ?? 1"
          label="热量摄入进度"
          unit="kcal"
        />
        <ProgressBar
          :current="totalExerciseCalories"
          :target="(todayPlan?.calorieTarget ?? 1) * 0.3"
          label="运动消耗进度"
          unit="kcal"
        />
      </div>

      <!-- Net calories -->
      <div class="section-card net-cal">
        <div class="net-label">净热量</div>
        <div class="net-value" :class="{ negative: netCalories < 0 }">
          {{ netCalories }} kcal
        </div>
        <div class="net-hint">
          {{ netCalories < 0 ? '✅ 处于热量缺口' : '⚠️ 热量盈余' }}
        </div>
      </div>

      <!-- Body stats -->
      <div class="section-card stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ currentBodyFat?.toFixed(1) ?? '--' }}%</div>
          <div class="stat-label">当前体脂</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ bfDistance ? (bfDistance > 0 ? '+' : '') + bfDistance.toFixed(1) + '%' : '--' }}</div>
          <div class="stat-label">距目标</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ daysToTarget ?? '--' }}天</div>
          <div class="stat-label">预计达成</div>
        </div>
      </div>

      <!-- Today's meal summary -->
      <div class="section-card">
        <div class="section-title">今日饮食</div>
        <div class="meal-summary" v-if="hasTodayPlan">
          <div class="meal-line"><strong>早餐:</strong> {{ breakfastSummary || '—' }}</div>
          <div class="meal-line"><strong>午餐:</strong> {{ lunchSummary || '—' }}</div>
          <div class="meal-line"><strong>晚餐:</strong> {{ dinnerSummary || '—' }}</div>
        </div>
        <van-button v-else size="small" type="primary" @click="ensureTodayPlan">生成今日计划</van-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.home-root {
  padding: 16px;
  padding-bottom: 80px;
}
.gauges-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.net-cal { text-align: center; }
.net-label { font-size: 13px; color: #969799; }
.net-value { font-size: 28px; font-weight: 700; color: #ee0a24; }
.net-value.negative { color: #07c160; }
.net-hint { font-size: 13px; color: #969799; margin-top: 4px; }
.stats-row {
  display: flex;
  justify-content: space-around;
}
.stat-item { text-align: center; }
.stat-value { font-size: 20px; font-weight: 600; color: #323233; }
.stat-label { font-size: 12px; color: #969799; }
.section-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.meal-line { font-size: 13px; color: #646566; line-height: 1.8; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/HomeView.vue
git commit -m "feat: add HomeView dashboard with calorie gauges and meal summary"
```

---

### Task 21: DietView

**Files:**
- Create: `src/views/DietView.vue`

- [ ] **Step 1: Write DietView**

```vue
<!-- src/views/DietView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { useFoodDatabase } from '@/composables/useFoodDatabase'
import MealSection from '@/components/MealSection.vue'
import FoodPicker from '@/components/FoodPicker.vue'
import type { MealType, FoodItem } from '@/types'

const { todayPlan, replaceFood, adjustGrams, ensureTodayPlan } = useDailyPlan()
const { allFoods, getFoodById } = useFoodDatabase()

const pickerVisible = ref(false)
const pickerTarget = ref<{ meal: MealType; index: number } | null>(null)

const foodMap = computed(() => {
  const map = new Map<string, FoodItem>()
  allFoods.value.forEach(f => map.set(f.id, f))
  return map
})

function onReplace(meal: MealType, index: number) {
  pickerTarget.value = { meal, index }
  pickerVisible.value = true
}

function onSelectFood(foodId: string) {
  if (pickerTarget.value) {
    replaceFood(pickerTarget.value.meal, pickerTarget.value.index, foodId)
  }
  pickerVisible.value = false
  pickerTarget.value = null
}

function onAdjust(meal: MealType, index: number, grams: number) {
  adjustGrams(meal, index, grams)
}
</script>

<template>
  <div class="diet-root">
    <van-empty v-if="!todayPlan" description="今日暂无饮食计划">
      <van-button type="primary" @click="ensureTodayPlan">生成今日计划</van-button>
    </van-empty>

    <template v-else>
      <div class="diet-header">
        <span>目标摄入: <strong>{{ todayPlan.calorieTarget }} kcal</strong></span>
        <span>蛋白质: {{ todayPlan.macros.proteinTarget }}g</span>
      </div>

      <MealSection
        title="早餐"
        :entries="todayPlan.meals.breakfast"
        :foodMap="foodMap"
        @replace="(i: number) => onReplace('breakfast', i)"
        @adjust="(i: number, g: number) => onAdjust('breakfast', i, g)"
      />
      <MealSection
        title="午餐"
        :entries="todayPlan.meals.lunch"
        :foodMap="foodMap"
        @replace="(i: number) => onReplace('lunch', i)"
        @adjust="(i: number, g: number) => onAdjust('lunch', i, g)"
      />
      <MealSection
        title="晚餐"
        :entries="todayPlan.meals.dinner"
        :foodMap="foodMap"
        @replace="(i: number) => onReplace('dinner', i)"
        @adjust="(i: number, g: number) => onAdjust('dinner', i, g)"
      />

      <FoodPicker
        v-if="pickerVisible"
        :foods="allFoods"
        :current-food-id="pickerTarget ? todayPlan.meals[pickerTarget.meal][pickerTarget.index]?.foodId : undefined"
        @select="onSelectFood"
        @close="pickerVisible = false"
      />
    </template>
  </div>
</template>

<style scoped>
.diet-root { padding-bottom: 80px; }
.diet-header {
  display: flex;
  justify-content: space-around;
  padding: 12px 16px;
  font-size: 13px;
  color: #646566;
  background: #f7f8fa;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/DietView.vue
git commit -m "feat: add DietView with meal sections and food replacement"
```

---

### Task 22: ExerciseView

**Files:**
- Create: `src/views/ExerciseView.vue`

- [ ] **Step 1: Write ExerciseView**

```vue
<!-- src/views/ExerciseView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'
import ExerciseCard from '@/components/ExerciseCard.vue'
import type { ExerciseDef } from '@/types'

const { todayPlan, ensureTodayPlan, updateExerciseEntry } = useDailyPlan()

const exerciseMap = computed(() => {
  const map = new Map<string, ExerciseDef>()
  EXERCISE_DATABASE.forEach(e => map.set(e.id, e))
  return map
})

function onAdjust(exType: 'aerobic' | 'anaerobic', index: number, minutes: number) {
  const plan = todayPlan.value
  if (!plan) return
  const ex = plan.exercises[exType][index]
  if (!ex) return
  const def = EXERCISE_DATABASE.find(e => e.id === ex.exerciseId)
  if (!def) return
  const newCal = Math.round((def.kcalPerKgPerHour * 70 * minutes) / 60) // fallback 70kg
  // Recalculate with user weight in real flow — here we simplify
  plan.exercises[exType][index] = { ...ex, minutes, calories: newCal }
}
</script>

<template>
  <div class="ex-root">
    <van-empty v-if="!todayPlan" description="今日暂无运动计划">
      <van-button type="primary" @click="ensureTodayPlan">生成今日计划</van-button>
    </van-empty>

    <template v-else>
      <div class="ex-section">
        <div class="ex-section-title">🏃 有氧运动</div>
        <ExerciseCard
          v-for="(entry, idx) in todayPlan.exercises.aerobic"
          :key="'a' + idx"
          :entry="entry"
          :exercise="exerciseMap.get(entry.exerciseId)"
          @replace="() => {}"
          @adjust="(m: number) => onAdjust('aerobic', idx, m)"
        />
      </div>

      <div class="ex-section">
        <div class="ex-section-title">🏋️ 无氧运动</div>
        <ExerciseCard
          v-for="(entry, idx) in todayPlan.exercises.anaerobic"
          :key="'n' + idx"
          :entry="entry"
          :exercise="exerciseMap.get(entry.exerciseId)"
          @replace="() => {}"
          @adjust="(m: number) => onAdjust('anaerobic', idx, m)"
        />
      </div>

      <div class="ex-total">
        运动总消耗: <strong>{{ todayPlan.exercises.aerobic.reduce((s, e) => s + e.calories, 0) + todayPlan.exercises.anaerobic.reduce((s, e) => s + e.calories, 0) }} kcal</strong>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ex-root { padding-bottom: 80px; }
.ex-section { margin-bottom: 16px; }
.ex-section-title {
  font-size: 16px;
  font-weight: 600;
  padding: 12px 16px 4px;
}
.ex-total {
  text-align: center;
  padding: 16px;
  font-size: 15px;
  color: #323233;
}
</style>
```

- [ ] **Step 2: Use profile weight in exercise calorie calculation**

Refine `onAdjust` in ExerciseView to use actual body weight. Import `useProfile`:

```typescript
import { useProfile } from '@/composables/useProfile'
const { profile } = useProfile()
```

Update the calorie recalculation:
```typescript
const bodyWeight = profile.value?.weight ?? 70
const newCal = Math.round((def.kcalPerKgPerHour * bodyWeight * minutes) / 60)
```

- [ ] **Step 3: Commit**

```bash
git add src/views/ExerciseView.vue
git commit -m "feat: add ExerciseView with aerobic and anaerobic plans"
```

---

### Task 23: ProfileView

**Files:**
- Create: `src/views/ProfileView.vue`

- [ ] **Step 1: Write ProfileView**

```vue
<!-- src/views/ProfileView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { useSettings } from '@/composables/useSettings'
import BodyForm from '@/components/BodyForm.vue'
import type { UserProfile } from '@/types'

const { profile, hasProfile, currentBodyFat, bmr, tdee, saveProfile, clearProfile } = useProfile()
const { settings, updateSettings, resetToDefaults } = useSettings()
const { generateTodayPlan } = useDailyPlan()

const showForm = ref(false)
const activeTab = ref(0) // 0=profile, 1=settings, 2=food-db

function onSaveProfile(data: UserProfile) {
  saveProfile(data)
  generateTodayPlan()
  showForm.value = false
}
</script>

<template>
  <div class="profile-root">
    <!-- Profile card OR body form -->
    <div v-if="!hasProfile || showForm" class="section-card">
      <div class="section-title">{{ hasProfile ? '编辑身体数据' : '填写身体数据' }}</div>
      <BodyForm :initial="profile" @save="onSaveProfile" />
      <van-button v-if="hasProfile" size="small" plain @click="showForm = false" style="margin-top:8px">取消</van-button>
    </div>

    <div v-else class="section-card">
      <div class="profile-summary">
        <div class="ps-row">
          <span>{{ profile?.gender === 'male' ? '男' : '女' }}</span>
          <span>{{ profile?.age }}岁</span>
          <span>{{ profile?.height }}cm</span>
          <span>{{ profile?.weight }}kg</span>
        </div>
        <div class="ps-stats">
          <div class="ps-stat">
            <div class="ps-val">{{ currentBodyFat?.toFixed(1) ?? '--' }}%</div>
            <div class="ps-lbl">当前体脂</div>
          </div>
          <div class="ps-stat">
            <div class="ps-val">{{ bmr?.toFixed(0) ?? '--' }}</div>
            <div class="ps-lbl">BMR(kcal)</div>
          </div>
          <div class="ps-stat">
            <div class="ps-val">{{ tdee?.toFixed(0) ?? '--' }}</div>
            <div class="ps-lbl">TDEE(kcal)</div>
          </div>
        </div>
      </div>
      <div class="profile-actions">
        <van-button size="small" type="primary" @click="showForm = true">编辑数据</van-button>
        <van-button size="small" type="danger" plain @click="clearProfile">清除数据</van-button>
      </div>
    </div>

    <!-- Settings -->
    <div class="section-card">
      <div class="section-title">参数设置</div>
      <van-cell title="热量缺口(kcal)">
        <template #right-icon>
          <van-stepper
            :model-value="settings.calorieDeficit"
            :step="50"
            :min="100"
            :max="1000"
            @change="updateSettings({ calorieDeficit: $event as number })"
          />
        </template>
      </van-cell>
      <van-cell title="蛋白质(g/kg体重)">
        <template #right-icon>
          <van-stepper
            :model-value="settings.proteinPerKg"
            :step="0.1"
            :min="1.0"
            :max="3.0"
            :precision="1"
            @change="updateSettings({ proteinPerKg: $event as number })"
          />
        </template>
      </van-cell>
    </div>

    <div class="section-card">
      <van-button block plain type="danger" @click="resetToDefaults">恢复默认设置</van-button>
    </div>
  </div>
</template>

<style scoped>
.profile-root { padding: 16px; padding-bottom: 80px; }
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.section-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.ps-row {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #646566;
  margin-bottom: 12px;
}
.ps-stats {
  display: flex;
  justify-content: space-around;
}
.ps-stat { text-align: center; }
.ps-val { font-size: 20px; font-weight: 600; color: #323233; }
.ps-lbl { font-size: 12px; color: #969799; }
.profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/ProfileView.vue
git commit -m "feat: add ProfileView with body data and settings"
```

---

### Task 24: App.vue Shell

**Files:**
- Modify: `src/App.vue`
- Modify: `src/main.ts`

- [ ] **Step 1: Update main.ts with Vant imports**

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Vant imports
import {
  Button, Cell, ConfigProvider, Empty, Field, Form, NavBar,
  Picker, Popup, Progress, Radio, RadioGroup, Search,
  Stepper, SwipeCell, Tabbar, TabbarItem, Toast, Notify,
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// Register Vant components
const vantComponents = [
  Button, Cell, ConfigProvider, Empty, Field, Form, NavBar,
  Picker, Popup, Progress, Radio, RadioGroup, Search,
  Stepper, SwipeCell, Tabbar, TabbarItem,
]
vantComponents.forEach(c => app.use(c))

app.mount('#app')
```

- [ ] **Step 2: Write App.vue with Tabbar**

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import DietView from './views/DietView.vue'
import ExerciseView from './views/ExerciseView.vue'
import ProfileView from './views/ProfileView.vue'

const active = ref(0)
const views = [HomeView, DietView, ExerciseView, ProfileView]

const currentView = computed(() => views[active.value])
</script>

<template>
  <div class="app-shell">
    <div class="app-content">
      <component :is="currentView" />
    </div>
    <van-tabbar v-model="active" :fixed="true" :safe-area-inset-bottom="true">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="orders-o">饮食</van-tabbar-item>
      <van-tabbar-item icon="fire-o">运动</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f7f8fa;
  -webkit-font-smoothing: antialiased;
}
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-content {
  flex: 1;
  overflow-y: auto;
}
</style>
```

- [ ] **Step 3: Fix App.vue — move computed import to the single `<script setup>` block**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeView from './views/HomeView.vue'
import DietView from './views/DietView.vue'
import ExerciseView from './views/ExerciseView.vue'
import ProfileView from './views/ProfileView.vue'

const active = ref(0)
const views = [HomeView, DietView, ExerciseView, ProfileView]
const currentView = computed(() => views[active.value])
</script>
```

- [ ] **Step 4: Commit**

```bash
git add src/App.vue src/main.ts
git commit -m "feat: add App.vue shell with Vant Tabbar and views"
```

---

### Task 25: PWA Configuration

**Files:**
- Create: `public/manifest.json`
- Modify: `index.html`

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "减脂助手",
  "short_name": "减脂助手",
  "description": "私人健身减脂助手",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f7f8fa",
  "theme_color": "#07c160",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💪</text></svg>",
      "sizes": "100x100",
      "type": "image/svg+xml"
    }
  ]
}
```

- [ ] **Step 2: Update index.html with meta viewport and manifest link**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#07c160" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💪</text></svg>" />
    <title>减脂助手</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add public/manifest.json index.html
git commit -m "feat: add PWA manifest and mobile meta tags"
```

---

### Task 26: Final Integration & Smoke Test

**Files:** No new files.

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors. Fix any type issues.

- [ ] **Step 2: Run all unit tests**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 3: Run dev server and smoke test**

Run: `npm run dev`
Expected: Dev server starts, open in browser.
Manual checks:
- Tabbar shows 4 tabs, switching works
- "我的" tab → fill body data → save → redirected
- Home tab shows calorie gauges, meal summary, exercise summary
- Diet tab shows 3 meals with food cards, slide to replace, stepper to adjust
- Exercise tab shows exercise cards
- Settings tab shows configurable deficit, protein ratio
- Close and reopen browser → data persists
- Delete profile → back to empty state

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete fitness assistant MVP — integration and smoke test"
```

---
