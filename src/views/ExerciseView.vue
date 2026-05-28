<script setup lang="ts">
import { computed } from 'vue'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { useProfile } from '@/composables/useProfile'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'
import ExerciseCard from '@/components/ExerciseCard.vue'
import type { ExerciseDef } from '@/types'

const { todayPlan, ensureTodayPlan } = useDailyPlan()
const { profile } = useProfile()

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
  const bodyWeight = profile.value?.weight ?? 70
  const newCal = Math.round((def.kcalPerKgPerHour * bodyWeight * minutes) / 60)
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
        <div class="ex-section-title">有氧运动</div>
        <ExerciseCard
          v-for="(entry, idx) in todayPlan.exercises.aerobic"
          :key="'a' + idx"
          :entry="entry"
          :exercise="exerciseMap.get(entry.exerciseId)"
          @replace="() => {}"
          @adjust="(m) => onAdjust('aerobic', idx, m)"
        />
      </div>

      <div class="ex-section">
        <div class="ex-section-title">无氧运动</div>
        <ExerciseCard
          v-for="(entry, idx) in todayPlan.exercises.anaerobic"
          :key="'n' + idx"
          :entry="entry"
          :exercise="exerciseMap.get(entry.exerciseId)"
          @replace="() => {}"
          @adjust="(m) => onAdjust('anaerobic', idx, m)"
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
