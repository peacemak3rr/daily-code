<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { useFoodDatabase } from '@/composables/useFoodDatabase'
import MealSection from '@/components/MealSection.vue'
import FoodPicker from '@/components/FoodPicker.vue'
import type { MealType, FoodItem } from '@/types'

const { todayPlan, replaceFood, adjustGrams, ensureTodayPlan } = useDailyPlan()
const { allFoods } = useFoodDatabase()

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
        <span>蛋白质: {{ Math.round(todayPlan.macros.proteinTarget) }}g</span>
      </div>

      <MealSection
        title="早餐"
        :entries="todayPlan.meals.breakfast"
        :foodMap="foodMap"
        @replace="(i) => onReplace('breakfast', i)"
        @adjust="(i, g) => onAdjust('breakfast', i, g)"
      />
      <MealSection
        title="午餐"
        :entries="todayPlan.meals.lunch"
        :foodMap="foodMap"
        @replace="(i) => onReplace('lunch', i)"
        @adjust="(i, g) => onAdjust('lunch', i, g)"
      />
      <MealSection
        title="晚餐"
        :entries="todayPlan.meals.dinner"
        :foodMap="foodMap"
        @replace="(i) => onReplace('dinner', i)"
        @adjust="(i, g) => onAdjust('dinner', i, g)"
      />

      <FoodPicker
        v-if="pickerVisible"
        :foods="allFoods"
        :current-food-id="pickerTarget && todayPlan ? todayPlan.meals[pickerTarget.meal][pickerTarget.index]?.foodId : undefined"
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
