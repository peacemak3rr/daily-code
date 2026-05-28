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
