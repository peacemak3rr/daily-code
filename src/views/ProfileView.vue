<script setup lang="ts">
import { ref } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useDailyPlan } from '@/composables/useDailyPlan'
import { useSettings } from '@/composables/useSettings'
import BodyForm from '@/components/BodyForm.vue'
import type { UserProfile } from '@/types'

const { profile, hasProfile, currentBodyFat, bmr, tdee, saveProfile, clearProfile } = useProfile()
const { settings, updateSettings, resetToDefaults } = useSettings()
const { generateTodayPlan } = useDailyPlan()

const showForm = ref(false)

function onSaveProfile(data: UserProfile) {
  saveProfile(data)
  generateTodayPlan()
  showForm.value = false
}
</script>

<template>
  <div class="profile-root">
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
