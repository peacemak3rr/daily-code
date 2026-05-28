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
        :style="{ width: Math.min((current / Math.max(target, 1)) * 100, 100) + '%' }"
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
.pb-active { background: linear-gradient(90deg, #1989fa, #07c160); }
.pb-done { background: #07c160; }
</style>
