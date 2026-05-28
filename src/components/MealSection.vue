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
      @adjust="(g) => emit('adjust', idx, g)"
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
