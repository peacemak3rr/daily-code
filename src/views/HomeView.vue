<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useDailyPlan } from '@/composables/useDailyPlan'
import CalorieGauge from '@/components/CalorieGauge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { estimateDaysToTarget } from '@/utils/bodyCalculations'
import { FOOD_DATABASE } from '@/constants/foodDatabase'

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
  return Math.round(totalMealCalories.value - tdee.value + totalExerciseCalories.value)
})

const breakfastSummary = computed(() => {
  return todayPlan.value?.meals.breakfast.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return f ? `${f.name} ${e.grams}g` : ''
  }).filter(Boolean).join(' | ') || '—'
})

const lunchSummary = computed(() => {
  return todayPlan.value?.meals.lunch.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return f ? `${f.name} ${e.grams}g` : ''
  }).filter(Boolean).join(' | ') || '—'
})

const dinnerSummary = computed(() => {
  return todayPlan.value?.meals.dinner.map(e => {
    const f = FOOD_DATABASE.find(x => x.id === e.foodId)
    return f ? `${f.name} ${e.grams}g` : ''
  }).filter(Boolean).join(' | ') || '—'
})
</script>

<template>
  <div class="home-root">
    <van-empty v-if="!profile" description="请先在「我的」页面填写身体数据" />

    <template v-else>
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

      <div class="section-card">
        <ProgressBar
          :current="totalMealCalories"
          :target="todayPlan?.calorieTarget ?? 1"
          label="热量摄入进度"
          unit="kcal"
        />
        <ProgressBar
          :current="totalExerciseCalories"
          :target="Math.round((todayPlan?.calorieTarget ?? 1) * 0.3)"
          label="运动消耗进度"
          unit="kcal"
        />
      </div>

      <div class="section-card net-cal">
        <div class="net-label">净热量 (摄入 - TDEE + 运动消耗)</div>
        <div class="net-value" :class="{ negative: netCalories < 0 }">
          {{ netCalories }} kcal
        </div>
        <div class="net-hint">
          {{ netCalories < 0 ? '✅ 处于热量缺口' : '⚠️ 热量盈余' }}
        </div>
      </div>

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

      <div class="section-card">
        <div class="section-title">今日饮食</div>
        <div class="meal-summary" v-if="hasTodayPlan">
          <div class="meal-line"><strong>早餐:</strong> {{ breakfastSummary }}</div>
          <div class="meal-line"><strong>午餐:</strong> {{ lunchSummary }}</div>
          <div class="meal-line"><strong>晚餐:</strong> {{ dinnerSummary }}</div>
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
