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
          @change="$emit('adjust', ($event as number))"
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
