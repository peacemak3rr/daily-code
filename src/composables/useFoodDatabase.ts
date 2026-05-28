// src/composables/useFoodDatabase.ts
import { ref, computed, watch } from 'vue'
import type { FoodItem, FoodCategory } from '@/types'
import { FOOD_DATABASE } from '@/constants/foodDatabase'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'food-db'

const customFoods = ref<FoodItem[]>(loadFromStorage<FoodItem[]>(STORAGE_KEY) ?? [])

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
