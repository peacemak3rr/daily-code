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
        :stroke-dashoffset="2 * Math.PI * 52 * (1 - Math.min(current / Math.max(target, 1), 1))"
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
